-- AxisOneDesk — Inventory module schema
-- categories, suppliers, products, product_images, product_variants,
-- stock_adjustments, inventory_transactions.
-- See ARCHITECTURE.md §4 ("Inventory schema (finalized)") for the design this implements.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  color text not null default 'chart-1',
  icon text not null default 'Package',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index categories_org_name_unique_idx
  on public.categories (org_id, lower(name))
  where deleted_at is null;

create index categories_org_id_idx on public.categories (org_id);

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- suppliers
-- ---------------------------------------------------------------------------
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  contact_name text not null default '',
  email text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index suppliers_org_id_idx on public.suppliers (org_id);

create trigger set_suppliers_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  supplier_id uuid references public.suppliers (id) on delete set null,
  name text not null,
  sku text not null,
  barcode text not null default '',
  description text not null default '',
  cost_price numeric(10, 2) not null default 0 check (cost_price >= 0),
  selling_price numeric(10, 2) not null default 0 check (selling_price >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  reorder_point integer not null default 0 check (reorder_point >= 0),
  unit text not null default 'unit',
  location text not null default '',
  stock_status text generated always as (
    case
      when quantity <= 0 then 'out_of_stock'
      when quantity <= reorder_point then 'low_stock'
      else 'in_stock'
    end
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index products_org_sku_unique_idx
  on public.products (org_id, lower(sku))
  where deleted_at is null;

create index products_org_id_idx on public.products (org_id);
create index products_org_category_idx on public.products (org_id, category_id);
create index products_org_supplier_idx on public.products (org_id, supplier_id);
create index products_org_name_idx on public.products (org_id, name);
create index products_org_status_idx on public.products (org_id, stock_status);

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_images_product_id_idx on public.product_images (product_id, sort_order);

create trigger set_product_images_updated_at
  before update on public.product_images
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_variants
-- ---------------------------------------------------------------------------
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  sku text not null,
  price_delta numeric(10, 2) not null default 0,
  quantity integer not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_product_id_idx on public.product_variants (product_id);

create trigger set_product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- stock_adjustments — append-only manual action log
-- ---------------------------------------------------------------------------
create type public.stock_adjustment_type as enum ('increase', 'decrease', 'transfer');

create table public.stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  type public.stock_adjustment_type not null,
  quantity integer not null check (quantity > 0),
  reason text not null,
  notes text not null default '',
  performed_by uuid references public.profiles (id),
  resulting_quantity integer not null check (resulting_quantity >= 0),
  from_location text,
  to_location text,
  created_at timestamptz not null default now()
);

create index stock_adjustments_product_created_idx
  on public.stock_adjustments (product_id, created_at desc);
create index stock_adjustments_org_id_idx on public.stock_adjustments (org_id);

-- ---------------------------------------------------------------------------
-- inventory_transactions — append-only ledger, trigger-populated only
-- ---------------------------------------------------------------------------
create type public.inventory_transaction_direction as enum ('in', 'out');
create type public.inventory_transaction_source as enum ('adjustment', 'transfer', 'sale', 'purchase_receipt');

create table public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  direction public.inventory_transaction_direction not null,
  quantity integer not null check (quantity > 0),
  source public.inventory_transaction_source not null default 'adjustment',
  source_id uuid,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index inventory_transactions_org_occurred_idx
  on public.inventory_transactions (org_id, occurred_at);
create index inventory_transactions_product_occurred_idx
  on public.inventory_transactions (product_id, occurred_at);

-- Populates inventory_transactions from stock_adjustments. security definer so it can write
-- to the ledger even though clients hold no direct insert grant on inventory_transactions —
-- the ledger is only ever written through this trigger.
create or replace function public.log_inventory_transaction_from_adjustment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.type = 'increase' then
    insert into public.inventory_transactions (org_id, product_id, direction, quantity, source, source_id, occurred_at)
    values (new.org_id, new.product_id, 'in', new.quantity, 'adjustment', new.id, new.created_at);
  elsif new.type = 'decrease' then
    insert into public.inventory_transactions (org_id, product_id, direction, quantity, source, source_id, occurred_at)
    values (new.org_id, new.product_id, 'out', new.quantity, 'adjustment', new.id, new.created_at);
  end if;
  -- 'transfer' changes location, not total quantity — not ledgered.
  return new;
end;
$$;

create trigger log_inventory_transaction
  after insert on public.stock_adjustments
  for each row execute function public.log_inventory_transaction_from_adjustment();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.stock_adjustments enable row level security;
alter table public.inventory_transactions enable row level security;

-- categories
create policy "categories_select_member" on public.categories
  for select using (org_id in (select public.current_org_ids()));
create policy "categories_write_editor" on public.categories
  for all using (public.has_permission(org_id, 'inventory.edit'))
  with check (public.has_permission(org_id, 'inventory.edit'));

-- suppliers
create policy "suppliers_select_member" on public.suppliers
  for select using (org_id in (select public.current_org_ids()));
create policy "suppliers_write_editor" on public.suppliers
  for all using (public.has_permission(org_id, 'inventory.edit'))
  with check (public.has_permission(org_id, 'inventory.edit'));

-- products
create policy "products_select_member" on public.products
  for select using (org_id in (select public.current_org_ids()));
create policy "products_write_editor" on public.products
  for all using (public.has_permission(org_id, 'inventory.edit'))
  with check (public.has_permission(org_id, 'inventory.edit'));

-- product_images
create policy "product_images_select_member" on public.product_images
  for select using (org_id in (select public.current_org_ids()));
create policy "product_images_write_editor" on public.product_images
  for all using (public.has_permission(org_id, 'inventory.edit'))
  with check (public.has_permission(org_id, 'inventory.edit'));

-- product_variants
create policy "product_variants_select_member" on public.product_variants
  for select using (org_id in (select public.current_org_ids()));
create policy "product_variants_write_editor" on public.product_variants
  for all using (public.has_permission(org_id, 'inventory.edit'))
  with check (public.has_permission(org_id, 'inventory.edit'));

-- stock_adjustments: append-only — select for members, insert for those with adjust permission,
-- no update/delete policy at all (immutable, like audit_logs).
create policy "stock_adjustments_select_member" on public.stock_adjustments
  for select using (org_id in (select public.current_org_ids()));
create policy "stock_adjustments_insert_adjuster" on public.stock_adjustments
  for insert with check (public.has_permission(org_id, 'inventory.adjust_stock'));

-- inventory_transactions: select-only for members; no insert/update/delete policy for any
-- client role — the ledger is populated exclusively by the security-definer trigger above.
create policy "inventory_transactions_select_member" on public.inventory_transactions
  for select using (org_id in (select public.current_org_ids()));

-- ---------------------------------------------------------------------------
-- Permissions: seed inventory keys and grant them to every org's Owner role,
-- including orgs created before this migration.
-- ---------------------------------------------------------------------------
insert into public.permissions (key, description, module_key) values
  ('inventory.view', 'View products, categories, suppliers, and stock', 'inventory'),
  ('inventory.edit', 'Create, edit, and delete products, categories, and suppliers', 'inventory'),
  ('inventory.adjust_stock', 'Increase, decrease, or transfer stock', 'inventory')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.is_system_role = true
  and r.name = 'Owner'
  and p.module_key = 'inventory'
  and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
  );
