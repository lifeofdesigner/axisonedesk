-- Purchasing module: purchase orders against inventory.suppliers, per
-- ARCHITECTURE.md §4. References `inventory.suppliers` and `inventory.products`
-- directly (shared tables), consistent with the SOT note that `suppliers`
-- stays owned by `inventory` until `purchasing` needs to extend it further.
--
-- Receiving a purchase order writes to the SAME inventory_transactions ledger
-- the Inventory milestone anticipated (`source = 'purchase_receipt'` already
-- existed in the enum, unused until now) — mirrors create_order's pattern
-- exactly: a security definer RPC that row-locks, validates, then writes
-- atomically.

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  supplier_id uuid references public.suppliers(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'ordered', 'received', 'cancelled')),
  expected_date date,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_purchase_orders_updated_at
  before update on public.purchase_orders
  for each row execute function public.set_updated_at();

create table public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  sku text not null,
  quantity int not null check (quantity > 0),
  unit_cost numeric(10, 2) not null default 0,
  line_total numeric(12, 2) generated always as (quantity * unit_cost) stored,
  created_at timestamptz not null default now()
);

alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;

create policy "purchase_orders_select_member" on public.purchase_orders
  for select using (org_id in (select public.current_org_ids()));

create policy "purchase_orders_write_editor" on public.purchase_orders
  for all using (public.has_permission(org_id, 'purchasing.edit'))
  with check (public.has_permission(org_id, 'purchasing.edit'));

create policy "purchase_order_items_select_member" on public.purchase_order_items
  for select using (org_id in (select public.current_org_ids()));

create policy "purchase_order_items_write_editor" on public.purchase_order_items
  for all using (public.has_permission(org_id, 'purchasing.edit'))
  with check (public.has_permission(org_id, 'purchasing.edit'));

insert into public.permissions (key, description, module_key) values
  ('purchasing.view', 'View purchase orders', 'purchasing'),
  ('purchasing.edit', 'Create purchase orders and receive stock', 'purchasing')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.is_system_role = true
  and r.name = 'Owner'
  and p.module_key = 'purchasing'
  and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
  );

-- security definer: purchase_order_items has no client insert policy beyond
-- the editor check above, but receiving ALSO needs to update products.quantity
-- (gated by inventory.edit, a different permission) and insert into
-- inventory_transactions (zero client insert policy at all) — same
-- cross-permission justification as create_order in migration 0004.
create or replace function public.receive_purchase_order(p_org_id uuid, p_purchase_order_id uuid)
returns public.purchase_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.purchase_orders;
  v_item record;
begin
  if not public.has_permission(p_org_id, 'purchasing.edit') then
    raise exception 'Not permitted';
  end if;

  select * into v_order from public.purchase_orders
    where id = p_purchase_order_id and org_id = p_org_id
    for update;

  if v_order is null then
    raise exception 'Purchase order not found';
  end if;
  if v_order.status = 'received' then
    raise exception 'Purchase order already received';
  end if;

  for v_item in
    select * from public.purchase_order_items
    where purchase_order_id = p_purchase_order_id and org_id = p_org_id
  loop
    if v_item.product_id is not null then
      update public.products
        set quantity = quantity + v_item.quantity
        where id = v_item.product_id and org_id = p_org_id;

      insert into public.inventory_transactions
        (org_id, product_id, direction, quantity, source, source_id, occurred_at)
      values
        (p_org_id, v_item.product_id, 'in', v_item.quantity, 'purchase_receipt', p_purchase_order_id, now());
    end if;
  end loop;

  update public.purchase_orders
    set status = 'received'
    where id = p_purchase_order_id and org_id = p_org_id
    returning * into v_order;

  return v_order;
end;
$$;

grant execute on function public.receive_purchase_order(uuid, uuid) to authenticated;
