-- CRM module: extends the existing `customers` table (built provisionally by
-- `orders` in migration 0004) with customer_notes and deals, per
-- ARCHITECTURE.md §4 SOT reconciliation. `customers` itself is unchanged.
--
-- Deviation from the ARCHITECTURE.md sketch ("deals, pipelines"): deals.stage
-- is a fixed enum rather than a separate configurable `pipelines` table. A
-- user-configurable pipeline builder is real, speculative future scope this
-- milestone doesn't need — the same reasoning as line-item immutability in
-- the Orders milestone. If custom pipelines are needed later, `pipelines`
-- can be added and `deals.stage` migrated to reference it without touching
-- this table's other columns.

create type public.deal_stage as enum ('lead', 'qualified', 'proposal', 'won', 'lost');

create table public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  customer_id uuid not null references public.customers(id),
  author_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  value numeric(12, 2) not null default 0,
  stage public.deal_stage not null default 'lead',
  expected_close_date date,
  owner_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_deals_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

alter table public.customer_notes enable row level security;
alter table public.deals enable row level security;

create policy "customer_notes_select_member" on public.customer_notes
  for select using (org_id in (select public.current_org_ids()));

create policy "customer_notes_insert_editor" on public.customer_notes
  for insert with check (public.has_permission(org_id, 'crm.edit'));

create policy "deals_select_member" on public.deals
  for select using (org_id in (select public.current_org_ids()));

create policy "deals_write_editor" on public.deals
  for all using (public.has_permission(org_id, 'crm.edit'))
  with check (public.has_permission(org_id, 'crm.edit'));

insert into public.permissions (key, description, module_key) values
  ('crm.view', 'View customers, notes, and deals', 'crm'),
  ('crm.edit', 'Add notes, create and edit deals', 'crm')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.is_system_role = true
  and r.name = 'Owner'
  and p.module_key = 'crm'
  and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
  );
