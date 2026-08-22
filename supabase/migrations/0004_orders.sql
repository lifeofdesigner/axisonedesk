-- AxisOneDesk — Orders module schema
-- customers (provisional, owned by orders until crm exists), orders, order_items,
-- order_notes, order_events (timeline), plus the create_order / update_order_status /
-- add_order_note RPCs that keep inventory and the timeline consistent.
-- See ARCHITECTURE.md §4 ("Orders schema (finalized)") for the design this implements.

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index customers_org_id_idx on public.customers (org_id);
create index customers_org_name_idx on public.customers (org_id, name);

create trigger set_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create type public.order_payment_status as enum ('unpaid', 'partially_paid', 'paid', 'refunded');
create type public.order_fulfillment_status as enum ('unfulfilled', 'partially_fulfilled', 'fulfilled', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  order_number integer not null,
  customer_id uuid references public.customers (id) on delete set null,
  payment_status public.order_payment_status not null default 'unpaid',
  fulfillment_status public.order_fulfillment_status not null default 'unfulfilled',
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  discount_amount numeric(10, 2) not null default 0 check (discount_amount >= 0),
  tax_amount numeric(10, 2) not null default 0 check (tax_amount >= 0),
  shipping_amount numeric(10, 2) not null default 0 check (shipping_amount >= 0),
  total numeric(10, 2) generated always as (
    subtotal - discount_amount + tax_amount + shipping_amount
  ) stored,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (org_id, order_number)
);

create index orders_org_id_idx on public.orders (org_id, created_at desc);
create index orders_org_customer_idx on public.orders (org_id, customer_id);
create index orders_org_payment_status_idx on public.orders (org_id, payment_status);
create index orders_org_fulfillment_status_idx on public.orders (org_id, fulfillment_status);

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Per-org sequential order numbers (ORD-00001 etc, formatted client-side).
create or replace function public.assign_order_number()
returns trigger
language plpgsql
as $$
begin
  select coalesce(max(order_number), 0) + 1 into new.order_number
  from public.orders
  where org_id = new.org_id;
  return new;
end;
$$;

create trigger set_order_number
  before insert on public.orders
  for each row execute function public.assign_order_number();

-- Timeline entries for status transitions, regardless of write path.
create or replace function public.log_order_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.payment_status is distinct from new.payment_status then
    insert into public.order_events (org_id, order_id, type, description, actor_id)
    values (
      new.org_id, new.id, 'payment_status_changed',
      'Payment status changed to ' || new.payment_status, auth.uid()
    );
  end if;

  if old.fulfillment_status is distinct from new.fulfillment_status then
    insert into public.order_events (org_id, order_id, type, description, actor_id)
    values (
      new.org_id, new.id, 'fulfillment_status_changed',
      'Fulfillment status changed to ' || new.fulfillment_status, auth.uid()
    );
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- order_items — immutable once created; written only by create_order
-- ---------------------------------------------------------------------------
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  sku text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_org_product_idx on public.order_items (org_id, product_id);

-- Now that order_items exists, wire the status-change trigger.
create trigger log_order_status_change
  after update on public.orders
  for each row execute function public.log_order_status_change();

-- ---------------------------------------------------------------------------
-- order_notes — user-authored, append-only
-- ---------------------------------------------------------------------------
create table public.order_notes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  author_id uuid references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create index order_notes_order_id_idx on public.order_notes (order_id, created_at desc);

-- ---------------------------------------------------------------------------
-- order_events — append-only timeline; trigger/RPC-populated only
-- ---------------------------------------------------------------------------
create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  type text not null check (
    type in ('created', 'payment_status_changed', 'fulfillment_status_changed', 'note_added', 'cancelled')
  ),
  description text not null,
  actor_id uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index order_events_order_id_idx on public.order_events (order_id, created_at desc);

create or replace function public.log_order_note_event()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.order_events (org_id, order_id, type, description, actor_id)
  values (new.org_id, new.order_id, 'note_added', 'Note added', new.author_id);
  return new;
end;
$$;

create trigger log_order_note
  after insert on public.order_notes
  for each row execute function public.log_order_note_event();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_notes enable row level security;
alter table public.order_events enable row level security;

-- customers
create policy "customers_select_member" on public.customers
  for select using (org_id in (select public.current_org_ids()));
create policy "customers_write_editor" on public.customers
  for all using (public.has_permission(org_id, 'orders.edit'))
  with check (public.has_permission(org_id, 'orders.edit'));

-- orders: select for members; insert/update gated by orders.edit. No delete policy —
-- cancellation is a status change (fulfillment_status = 'cancelled'), not a row delete.
create policy "orders_select_member" on public.orders
  for select using (org_id in (select public.current_org_ids()));
create policy "orders_insert_editor" on public.orders
  for insert with check (public.has_permission(org_id, 'orders.edit'));
create policy "orders_update_editor" on public.orders
  for update using (public.has_permission(org_id, 'orders.edit'))
  with check (public.has_permission(org_id, 'orders.edit'));

-- order_items: select-only for clients — all writes happen inside create_order (security definer).
create policy "order_items_select_member" on public.order_items
  for select using (org_id in (select public.current_org_ids()));

-- order_notes: select + insert for members with orders.edit; append-only (no update/delete).
create policy "order_notes_select_member" on public.order_notes
  for select using (org_id in (select public.current_org_ids()));
create policy "order_notes_insert_editor" on public.order_notes
  for insert with check (public.has_permission(org_id, 'orders.edit'));

-- order_events: select-only — populated exclusively by triggers/create_order.
create policy "order_events_select_member" on public.order_events
  for select using (org_id in (select public.current_org_ids()));

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------
insert into public.permissions (key, description, module_key) values
  ('orders.view', 'View orders, customers, and order history', 'orders'),
  ('orders.edit', 'Create orders, change status, add notes', 'orders')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.is_system_role = true
  and r.name = 'Owner'
  and p.module_key = 'orders'
  and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
  );

-- ---------------------------------------------------------------------------
-- create_order — atomic: validates stock, creates the order + items, decrements
-- product quantities, and ledgers the sale (inventory_transactions, source='sale').
-- security definer: order_items/order_events accept no direct client writes, so this
-- function must bypass that RLS — it re-checks has_permission() manually since
-- security definer means RLS no longer runs for it.
-- ---------------------------------------------------------------------------
create or replace function public.create_order(
  p_org_id uuid,
  p_customer_id uuid,
  p_items jsonb, -- [{product_id, quantity}]
  p_discount_amount numeric default 0,
  p_tax_amount numeric default 0,
  p_shipping_amount numeric default 0
)
returns public.orders
language plpgsql
security definer set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_subtotal numeric(10, 2) := 0;
  v_qty integer;
begin
  if not public.has_permission(p_org_id, 'orders.edit') then
    raise exception 'Not permitted';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'An order needs at least one item';
  end if;

  -- Validate availability for every line first (lock rows), before writing anything.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for an order item';
    end if;

    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid and org_id = p_org_id and deleted_at is null
    for update;

    if not found then
      raise exception 'Product not found';
    end if;

    if v_product.quantity < v_qty then
      raise exception 'Not enough stock for %: % available, % requested',
        v_product.name, v_product.quantity, v_qty;
    end if;

    v_subtotal := v_subtotal + (v_product.selling_price * v_qty);
  end loop;

  insert into public.orders (
    org_id, customer_id, subtotal, discount_amount, tax_amount, shipping_amount, created_by
  ) values (
    p_org_id, p_customer_id, v_subtotal, p_discount_amount, p_tax_amount, p_shipping_amount, auth.uid()
  )
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;

    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid and org_id = p_org_id
    for update;

    insert into public.order_items (org_id, order_id, product_id, product_name, sku, unit_price, quantity)
    values (p_org_id, v_order.id, v_product.id, v_product.name, v_product.sku, v_product.selling_price, v_qty);

    update public.products set quantity = quantity - v_qty where id = v_product.id;

    insert into public.inventory_transactions (org_id, product_id, direction, quantity, source, source_id)
    values (p_org_id, v_product.id, 'out', v_qty, 'sale', v_order.id);
  end loop;

  insert into public.order_events (org_id, order_id, type, description, actor_id)
  values (p_org_id, v_order.id, 'created', 'Order created', auth.uid());

  return v_order;
end;
$$;

grant execute on function public.create_order(uuid, uuid, jsonb, numeric, numeric, numeric) to authenticated;

-- ---------------------------------------------------------------------------
-- update_order_status — status transitions; restocks inventory when an order
-- moves to 'cancelled' (reverses the original 'sale' ledger rows for it).
-- security definer for the same reason as create_order: writing a cancellation
-- reversal touches inventory_transactions (no client insert policy at all) and
-- products.quantity (gated by inventory.edit, a different permission than the
-- orders.edit this function checks) — both need the bypass, so the permission
-- check happens explicitly here instead of via RLS.
-- ---------------------------------------------------------------------------
create or replace function public.update_order_status(
  p_org_id uuid,
  p_order_id uuid,
  p_payment_status public.order_payment_status default null,
  p_fulfillment_status public.order_fulfillment_status default null
)
returns public.orders
language plpgsql
security definer set search_path = public
as $$
declare
  v_order public.orders;
  v_item record;
  v_was_cancelled boolean;
begin
  if not public.has_permission(p_org_id, 'orders.edit') then
    raise exception 'Not permitted';
  end if;

  select * into v_order from public.orders where id = p_order_id and org_id = p_org_id;
  if not found then
    raise exception 'Order not found';
  end if;

  v_was_cancelled := v_order.fulfillment_status = 'cancelled';

  update public.orders
  set
    payment_status = coalesce(p_payment_status, payment_status),
    fulfillment_status = coalesce(p_fulfillment_status, fulfillment_status)
  where id = p_order_id and org_id = p_org_id
  returning * into v_order;

  if p_fulfillment_status = 'cancelled' and not v_was_cancelled then
    for v_item in select * from public.order_items where order_id = p_order_id
    loop
      if v_item.product_id is not null then
        update public.products set quantity = quantity + v_item.quantity where id = v_item.product_id;

        insert into public.inventory_transactions (org_id, product_id, direction, quantity, source, source_id)
        values (p_org_id, v_item.product_id, 'in', v_item.quantity, 'sale', p_order_id);
      end if;
    end loop;
  end if;

  return v_order;
end;
$$;

grant execute on function public.update_order_status(
  uuid, uuid, public.order_payment_status, public.order_fulfillment_status
) to authenticated;
