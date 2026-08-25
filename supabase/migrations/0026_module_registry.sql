-- Module Registry: Phase 1 of the planned Industry Module Engine
-- (docs/.ai/02_INDUSTRY_ENGINE.md). Today module gating is entirely
-- implicit — a hardcoded RequireModuleEnabled moduleKey="..." per route
-- in src/router.tsx, backed only by feature_flags/org_feature_flags for
-- on/off state, with zero central metadata (name, icon, category,
-- dependencies, supported industries, etc.) describing what a module is.
--
-- This migration adds that missing metadata layer. It is purely additive
-- and does not change any gating behavior: feature_flags/org_feature_flags
-- remain the enable/disable mechanism. This table is descriptive registry
-- data that later Industry Engine phases (navigation/dashboard generation,
-- industry templates, subscription-gated unlocking) will read from — see
-- docs/18_REFERENCE/MODULE_REGISTRY.md for the target field list this
-- schema is built against.
--
-- Seeded with the actual modules shipped as of 2026-08-25 (verified
-- against src/router.tsx and src/modules/*), not a hypothetical set.
-- `pos` is included but marked enabled = false because src/modules/pos/
-- exists with no route wired in src/router.tsx (known gap, see
-- docs/00_ADOS/KNOWN_ISSUES.md) — the registry reflects that honestly
-- rather than claiming it's reachable.

create table public.modules (
  key text primary key,
  name text not null,
  description text,
  category text,
  icon text,
  route text,
  dependencies jsonb not null default '[]'::jsonb,
  required_permissions jsonb not null default '[]'::jsonb,
  feature_flag_key text,
  supported_industries jsonb not null default '[]'::jsonb,
  subscription_requirement text,
  display_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_modules_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

alter table public.modules enable row level security;

-- Reference data, not tenant-scoped — every authenticated user needs to
-- read it (mirrors the feature_flags_select_all policy established in
-- 0012_feature_flags.sql). Writes are platform-admin only via RPC below.
create policy "modules_select_all" on public.modules
  for select using (true);

insert into public.modules
  (key, name, description, category, icon, route, feature_flag_key, display_order, enabled)
values
  ('dashboard', 'Dashboard', 'Cross-module overview.', 'Analytics', 'layout-dashboard', '/', null, 0, true),
  ('inventory', 'Inventory', 'Products, variants, stock levels, categories, suppliers.', 'Operations', 'boxes', '/inventory', 'module.inventory', 10, true),
  ('orders', 'Orders', 'Order lifecycle management.', 'Operations', 'shopping-cart', '/orders', 'module.orders', 20, true),
  ('crm', 'CRM', 'Customer notes and deal tracking.', 'Sales', 'users', '/crm', 'module.crm', 30, true),
  ('bookings', 'Bookings', 'Resource booking and scheduling.', 'Operations', 'calendar', '/bookings', 'module.bookings', 40, true),
  ('purchasing', 'Purchasing', 'Purchase order management.', 'Operations', 'truck', '/purchasing', 'module.purchasing', 50, true),
  ('hr-staff', 'HR & Staff', 'Staff records and shift scheduling.', 'People', 'user-cog', '/hr-staff', 'module.hr_staff', 60, true),
  ('reports', 'Reports', 'Cross-module reporting.', 'Analytics', 'bar-chart', '/reports', 'module.reports', 70, true),
  ('billing', 'Billing', 'View current plan and subscription.', 'Finance', 'credit-card', '/billing', null, 80, true),
  ('ai-assistant', 'AI Assistant', 'In-app AI assistant (config-only shell, no live provider yet).', 'AI', 'sparkles', '/ai-assistant', 'module.ai_assistant', 90, true),
  ('settings', 'Settings', 'Organization-level settings.', 'Administration', 'settings', '/settings', null, 100, true),
  ('pos', 'Point of Sale', 'Scaffolded, not routed — see docs/00_ADOS/KNOWN_ISSUES.md.', 'Operations', 'store', null, null, 110, false)
on conflict (key) do nothing;

create or replace function public.platform_list_modules()
returns setof public.modules
language sql
stable
security definer
set search_path = public
as $$
  select * from public.modules order by display_order;
$$;

grant execute on function public.platform_list_modules() to authenticated;

create or replace function public.platform_upsert_module(
  p_key text,
  p_name text,
  p_description text,
  p_category text,
  p_icon text,
  p_route text,
  p_dependencies jsonb,
  p_required_permissions jsonb,
  p_feature_flag_key text,
  p_supported_industries jsonb,
  p_subscription_requirement text,
  p_display_order integer,
  p_enabled boolean
)
returns public.modules
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module public.modules;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  insert into public.modules (
    key, name, description, category, icon, route, dependencies,
    required_permissions, feature_flag_key, supported_industries,
    subscription_requirement, display_order, enabled
  )
  values (
    p_key, p_name, p_description, p_category, p_icon, p_route, coalesce(p_dependencies, '[]'::jsonb),
    coalesce(p_required_permissions, '[]'::jsonb), p_feature_flag_key, coalesce(p_supported_industries, '[]'::jsonb),
    p_subscription_requirement, coalesce(p_display_order, 0), coalesce(p_enabled, true)
  )
  on conflict (key) do update set
    name = excluded.name,
    description = excluded.description,
    category = excluded.category,
    icon = excluded.icon,
    route = excluded.route,
    dependencies = excluded.dependencies,
    required_permissions = excluded.required_permissions,
    feature_flag_key = excluded.feature_flag_key,
    supported_industries = excluded.supported_industries,
    subscription_requirement = excluded.subscription_requirement,
    display_order = excluded.display_order,
    enabled = excluded.enabled
  returning * into v_module;

  perform public.log_audit_event(null, 'platform.module_upserted', 'module', null,
    jsonb_build_object('key', p_key));

  return v_module;
end;
$$;

grant execute on function public.platform_upsert_module(
  text, text, text, text, text, text, jsonb, jsonb, text, jsonb, text, integer, boolean
) to authenticated;
