-- Industry / Organization Type Registry: Industry Module Engine Phase 2
-- (docs/.ai/02_INDUSTRY_ENGINE.md), building on the Module Registry from
-- Phase 1 (0026_module_registry.sql).
--
-- Scope is intentionally narrow, matching the Incremental Delivery Rule in
-- docs/00_ADOS/AI_INSTRUCTIONS.md: this migration adds the registry tables
-- and platform-admin RPCs only. It does NOT touch `organizations` (no
-- organization_type_key column yet) and does NOT build any onboarding flow
-- or Platform Owner Portal UI — those are Phase 3 and Phase 4 respectively,
-- per the phase breakdown already documented in the playbook. Adding the
-- FK to `organizations` belongs with Phase 3, where it's actually consumed;
-- adding it here with nothing reading it yet would be exactly the kind of
-- premature coupling the Architectural Foundations Rule warns against in
-- the other direction (building the registry before something needs it is
-- fine — modifying a live tenant table before anything consumes the change
-- is not).
--
-- "Organization Type" and "Industry" are the same concept (per
-- docs/18_REFERENCE/ORGANIZATION_TYPE_REGISTRY.md) — one table serves both;
-- there is no separate organization-type-specific table.
--
-- Seeded with the 14 target industries from
-- docs/18_REFERENCE/INDUSTRY_REGISTRY.md. Module mappings
-- (organization_type_modules) are only seeded for the 9 industries that
-- doc already gave a researched proposed-default mapping for (Manufacturing,
-- Retail, Wholesale, Restaurant, Hotel, Construction, Healthcare,
-- Professional Services, E-commerce) — the other 5 (Pharmacy, Logistics,
-- Agriculture, Education, Custom) are seeded with zero module mappings
-- rather than a guessed one, per the no-fabrication rule: that doc was
-- explicit that guessing defaults for those requires real product research
-- not available in this session.

create table public.organization_types (
  key text primary key,
  name text not null,
  description text,
  icon text,
  is_system_default boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_organization_types_updated_at
  before update on public.organization_types
  for each row execute function public.set_updated_at();

create table public.organization_type_modules (
  organization_type_key text not null references public.organization_types(key) on delete cascade,
  module_key text not null references public.modules(key) on delete cascade,
  default_enabled boolean not null default true,
  is_optional boolean not null default false,
  is_hidden boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (organization_type_key, module_key)
);

create trigger set_organization_type_modules_updated_at
  before update on public.organization_type_modules
  for each row execute function public.set_updated_at();

alter table public.organization_types enable row level security;
alter table public.organization_type_modules enable row level security;

-- Reference data, not tenant-scoped — same rationale as modules_select_all
-- in 0026_module_registry.sql. Writes are platform-admin only via RPCs.
create policy "organization_types_select_all" on public.organization_types
  for select using (true);

create policy "organization_type_modules_select_all" on public.organization_type_modules
  for select using (true);

insert into public.organization_types (key, name, description, icon) values
  ('manufacturing', 'Manufacturing', 'Production, inventory, purchasing, and order-driven manufacturing businesses.', 'factory'),
  ('retail', 'Retail', 'Single or multi-location retail selling direct to consumers.', 'store'),
  ('wholesale', 'Wholesale', 'Bulk selling to other businesses.', 'package'),
  ('restaurant', 'Restaurant', 'Food service with orders, inventory, and staff scheduling.', 'utensils'),
  ('hotel', 'Hotel', 'Hospitality with room/resource bookings and guest relationships.', 'bed'),
  ('construction', 'Construction', 'Project-based work with purchasing and staff scheduling.', 'hard-hat'),
  ('healthcare', 'Healthcare', 'Appointment- and relationship-driven care providers.', 'stethoscope'),
  ('pharmacy', 'Pharmacy', 'Regulated retail with inventory tracking.', 'pill'),
  ('logistics', 'Logistics', 'Delivery, fleet, and fulfillment operations.', 'truck'),
  ('agriculture', 'Agriculture', 'Farm and agribusiness operations.', 'sprout'),
  ('education', 'Education', 'Schools and training organizations.', 'graduation-cap'),
  ('professional-services', 'Professional Services', 'Client- and booking-driven service firms.', 'briefcase'),
  ('e-commerce', 'E-commerce', 'Online-first retail with inventory and order fulfillment.', 'shopping-bag'),
  ('custom', 'Custom', 'No preset defaults — organization configures modules manually.', 'sliders')
on conflict (key) do nothing;

insert into public.organization_type_modules (organization_type_key, module_key, default_enabled, is_optional) values
  ('manufacturing', 'inventory', true, false),
  ('manufacturing', 'purchasing', true, false),
  ('manufacturing', 'orders', true, false),
  ('manufacturing', 'reports', true, false),
  ('manufacturing', 'hr-staff', false, true),
  ('manufacturing', 'bookings', false, true),

  ('retail', 'inventory', true, false),
  ('retail', 'orders', true, false),
  ('retail', 'crm', true, false),
  ('retail', 'reports', true, false),
  ('retail', 'purchasing', false, true),

  ('wholesale', 'inventory', true, false),
  ('wholesale', 'orders', true, false),
  ('wholesale', 'purchasing', true, false),
  ('wholesale', 'crm', true, false),
  ('wholesale', 'reports', true, false),

  ('restaurant', 'orders', true, false),
  ('restaurant', 'inventory', true, false),
  ('restaurant', 'hr-staff', true, false),
  ('restaurant', 'reports', true, false),
  ('restaurant', 'bookings', false, true),

  ('hotel', 'bookings', true, false),
  ('hotel', 'crm', true, false),
  ('hotel', 'reports', true, false),
  ('hotel', 'inventory', false, true),

  ('construction', 'purchasing', true, false),
  ('construction', 'hr-staff', true, false),
  ('construction', 'reports', true, false),
  ('construction', 'inventory', false, true),
  ('construction', 'orders', false, true),

  ('healthcare', 'bookings', true, false),
  ('healthcare', 'crm', true, false),
  ('healthcare', 'reports', true, false),

  ('professional-services', 'crm', true, false),
  ('professional-services', 'bookings', true, false),
  ('professional-services', 'reports', true, false),
  ('professional-services', 'billing', true, false),

  ('e-commerce', 'inventory', true, false),
  ('e-commerce', 'orders', true, false),
  ('e-commerce', 'crm', true, false),
  ('e-commerce', 'reports', true, false),
  ('e-commerce', 'purchasing', false, true)
on conflict (organization_type_key, module_key) do nothing;

create or replace function public.platform_list_organization_types()
returns setof public.organization_types
language sql
stable
security definer
set search_path = public
as $$
  select * from public.organization_types order by name;
$$;

grant execute on function public.platform_list_organization_types() to authenticated;

create or replace function public.platform_list_organization_type_modules(p_organization_type_key text)
returns setof public.organization_type_modules
language sql
stable
security definer
set search_path = public
as $$
  select * from public.organization_type_modules
  where organization_type_key = p_organization_type_key
  order by module_key;
$$;

grant execute on function public.platform_list_organization_type_modules(text) to authenticated;

create or replace function public.platform_upsert_organization_type(
  p_key text,
  p_name text,
  p_description text,
  p_icon text,
  p_is_system_default boolean
)
returns public.organization_types
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.organization_types;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  insert into public.organization_types (key, name, description, icon, is_system_default)
  values (p_key, p_name, p_description, p_icon, coalesce(p_is_system_default, false))
  on conflict (key) do update set
    name = excluded.name,
    description = excluded.description,
    icon = excluded.icon,
    is_system_default = excluded.is_system_default
  returning * into v_row;

  perform public.log_audit_event(null, 'platform.organization_type_upserted', 'organization_type', null,
    jsonb_build_object('key', p_key));

  return v_row;
end;
$$;

grant execute on function public.platform_upsert_organization_type(text, text, text, text, boolean) to authenticated;

create or replace function public.platform_archive_organization_type(p_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.organization_types set archived_at = now() where key = p_key;

  perform public.log_audit_event(null, 'platform.organization_type_archived', 'organization_type', null,
    jsonb_build_object('key', p_key));
end;
$$;

grant execute on function public.platform_archive_organization_type(text) to authenticated;

create or replace function public.platform_restore_organization_type(p_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.organization_types set archived_at = null where key = p_key;

  perform public.log_audit_event(null, 'platform.organization_type_restored', 'organization_type', null,
    jsonb_build_object('key', p_key));
end;
$$;

grant execute on function public.platform_restore_organization_type(text) to authenticated;

create or replace function public.platform_set_organization_type_module(
  p_organization_type_key text,
  p_module_key text,
  p_default_enabled boolean,
  p_is_optional boolean,
  p_is_hidden boolean
)
returns public.organization_type_modules
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.organization_type_modules;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  insert into public.organization_type_modules (organization_type_key, module_key, default_enabled, is_optional, is_hidden)
  values (p_organization_type_key, p_module_key, coalesce(p_default_enabled, true), coalesce(p_is_optional, false), coalesce(p_is_hidden, false))
  on conflict (organization_type_key, module_key) do update set
    default_enabled = excluded.default_enabled,
    is_optional = excluded.is_optional,
    is_hidden = excluded.is_hidden
  returning * into v_row;

  perform public.log_audit_event(null, 'platform.organization_type_module_set', 'organization_type', null,
    jsonb_build_object('organization_type_key', p_organization_type_key, 'module_key', p_module_key));

  return v_row;
end;
$$;

grant execute on function public.platform_set_organization_type_module(text, text, boolean, boolean, boolean) to authenticated;
