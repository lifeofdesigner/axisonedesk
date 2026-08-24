-- Bookings module: appointment/reservation scheduling for hotels, schools,
-- and appointment-style verticals, per ARCHITECTURE.md §4.
--
-- Deviation from the sketch ("bookings, booking_resources,
-- availability_rules"): `availability_rules` (recurring open-hours/blackout
-- rules) is not built this pass — a real recurrence-rule engine is
-- speculative scope nothing in this milestone's requirements needs yet.
-- Bookings today are validated only for basic time-range sanity
-- (ends_at > starts_at); double-booking prevention and recurring
-- availability are documented as a real future milestone, not silently
-- skipped.

create table public.booking_resources (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  name text not null,
  resource_type text not null default 'room',
  capacity int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_booking_resources_updated_at
  before update on public.booking_resources
  for each row execute function public.set_updated_at();

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  resource_id uuid references public.booking_resources(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'pending', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint bookings_time_range check (ends_at > starts_at)
);

create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.booking_resources enable row level security;
alter table public.bookings enable row level security;

create policy "booking_resources_select_member" on public.booking_resources
  for select using (org_id in (select public.current_org_ids()));

create policy "booking_resources_write_editor" on public.booking_resources
  for all using (public.has_permission(org_id, 'bookings.edit'))
  with check (public.has_permission(org_id, 'bookings.edit'));

create policy "bookings_select_member" on public.bookings
  for select using (org_id in (select public.current_org_ids()));

create policy "bookings_write_editor" on public.bookings
  for all using (public.has_permission(org_id, 'bookings.edit'))
  with check (public.has_permission(org_id, 'bookings.edit'));

insert into public.permissions (key, description, module_key) values
  ('bookings.view', 'View bookings and resources', 'bookings'),
  ('bookings.edit', 'Create and edit bookings and resources', 'bookings')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.is_system_role = true
  and r.name = 'Owner'
  and p.module_key = 'bookings'
  and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
  );
