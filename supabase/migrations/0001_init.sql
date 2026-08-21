-- AxisOneDesk — Phase 0 foundation schema
-- organizations, membership, RBAC primitives, profiles.
-- See ARCHITECTURE.md §4/§5 for the full schema plan this implements.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
create type public.organization_status as enum ('active', 'trialing', 'past_due', 'canceled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  business_type text not null,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  status public.organization_status not null default 'trialing',
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- roles, permissions, role_permissions
-- ---------------------------------------------------------------------------
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  module_key text not null
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade,
  name text not null,
  is_system_role boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, name)
);

create trigger set_roles_updated_at
  before update on public.roles
  for each row execute function public.set_updated_at();

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

-- ---------------------------------------------------------------------------
-- organization_members
-- ---------------------------------------------------------------------------
create type public.member_status as enum ('invited', 'active', 'suspended');

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id uuid not null references public.roles (id),
  status public.member_status not null default 'active',
  invited_by uuid references auth.users (id),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create trigger set_organization_members_updated_at
  before update on public.organization_members
  for each row execute function public.set_updated_at();

create index organization_members_user_id_idx on public.organization_members (user_id);
create index organization_members_org_id_idx on public.organization_members (org_id);

-- ---------------------------------------------------------------------------
-- RLS helper functions
-- ---------------------------------------------------------------------------
create or replace function public.current_org_ids()
returns setof uuid
language sql
stable
security definer set search_path = public
as $$
  select org_id from public.organization_members
  where user_id = auth.uid() and status = 'active';
$$;

create or replace function public.has_permission(target_org_id uuid, permission_key text)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.role_permissions rp on rp.role_id = om.role_id
    join public.permissions p on p.id = rp.permission_id
    where om.org_id = target_org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and p.key = permission_key
  );
$$;

alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organization_members enable row level security;

create policy "organizations_select_member" on public.organizations
  for select using (id in (select public.current_org_ids()));

create policy "organizations_update_admin" on public.organizations
  for update using (public.has_permission(id, 'settings.manage_organization'));

create policy "roles_select_member" on public.roles
  for select using (org_id is null or org_id in (select public.current_org_ids()));

create policy "permissions_select_all" on public.permissions
  for select using (true);

create policy "role_permissions_select_member" on public.role_permissions
  for select using (
    role_id in (
      select id from public.roles
      where org_id is null or org_id in (select public.current_org_ids())
    )
  );

create policy "organization_members_select_member" on public.organization_members
  for select using (org_id in (select public.current_org_ids()));

create policy "organization_members_manage_admin" on public.organization_members
  for all using (public.has_permission(org_id, 'settings.manage_members'));

-- ---------------------------------------------------------------------------
-- seed: system permissions + default role templates (global, org_id null)
-- ---------------------------------------------------------------------------
insert into public.permissions (key, description, module_key) values
  ('dashboard.view', 'View the dashboard', 'dashboard'),
  ('settings.manage_organization', 'Edit organization profile and preferences', 'settings'),
  ('settings.manage_members', 'Invite, remove, and manage member roles', 'settings'),
  ('settings.manage_roles', 'Create and edit custom roles', 'settings'),
  ('billing.manage', 'Manage subscription and billing', 'billing');

-- ---------------------------------------------------------------------------
-- create_organization_with_owner: transactional org bootstrap called from
-- the onboarding flow (src/core/tenant). Creates the org, a default Owner
-- role with full permissions, and adds the calling user as an active member.
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_with_owner(
  org_name text,
  org_slug text,
  org_business_type text
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
  owner_role_id uuid;
begin
  insert into public.organizations (name, slug, business_type)
  values (org_name, org_slug, org_business_type)
  returning id into new_org_id;

  insert into public.roles (org_id, name, is_system_role)
  values (new_org_id, 'Owner', true)
  returning id into owner_role_id;

  insert into public.role_permissions (role_id, permission_id)
  select owner_role_id, id from public.permissions;

  insert into public.organization_members (org_id, user_id, role_id, status, joined_at)
  values (new_org_id, auth.uid(), owner_role_id, 'active', now());

  return new_org_id;
end;
$$;
