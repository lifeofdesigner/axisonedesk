-- HR & Staff module: staff directory, scheduled shifts, and a manual
-- timesheet log, per ARCHITECTURE.md §4.
--
-- Deviation from the sketch: `timesheets` is a manual hours-worked log
-- (date + hours + notes), not a real-time clock-in/clock-out system. A live
-- clock system needs device/geolocation trust decisions this milestone
-- doesn't need to make yet — same reasoning as `availability_rules` being
-- deferred in the Bookings migration.

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  full_name text not null,
  email text,
  phone text,
  role_title text,
  hourly_rate numeric(10, 2),
  hire_date date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_staff_updated_at
  before update on public.staff
  for each row execute function public.set_updated_at();

create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  staff_id uuid not null references public.staff(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'missed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shifts_time_range check (ends_at > starts_at)
);

create trigger set_shifts_updated_at
  before update on public.shifts
  for each row execute function public.set_updated_at();

create table public.timesheets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  staff_id uuid not null references public.staff(id) on delete cascade,
  work_date date not null,
  hours_worked numeric(5, 2) not null check (hours_worked > 0),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;
alter table public.shifts enable row level security;
alter table public.timesheets enable row level security;

create policy "staff_select_member" on public.staff
  for select using (org_id in (select public.current_org_ids()));
create policy "staff_write_editor" on public.staff
  for all using (public.has_permission(org_id, 'hr.edit'))
  with check (public.has_permission(org_id, 'hr.edit'));

create policy "shifts_select_member" on public.shifts
  for select using (org_id in (select public.current_org_ids()));
create policy "shifts_write_editor" on public.shifts
  for all using (public.has_permission(org_id, 'hr.edit'))
  with check (public.has_permission(org_id, 'hr.edit'));

create policy "timesheets_select_member" on public.timesheets
  for select using (org_id in (select public.current_org_ids()));
create policy "timesheets_write_editor" on public.timesheets
  for all using (public.has_permission(org_id, 'hr.edit'))
  with check (public.has_permission(org_id, 'hr.edit'));

insert into public.permissions (key, description, module_key) values
  ('hr.view', 'View staff, shifts, and timesheets', 'hr'),
  ('hr.edit', 'Manage staff, shifts, and timesheets', 'hr')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.is_system_role = true
  and r.name = 'Owner'
  and p.module_key = 'hr'
  and not exists (
    select 1 from public.role_permissions rp
    where rp.role_id = r.id and rp.permission_id = p.id
  );
