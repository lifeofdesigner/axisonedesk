-- Industry Module Engine Phase 3b, slice 2: complete the fields
-- create_organization_with_owner persists, and make it apply the selected
-- organization_type's default module configuration automatically.
--
-- Scope, deliberately bounded (see docs/00_ADOS/NEXT_TASK.md and ADR-010,
-- docs/00_ADOS/DECISIONS.md): this covers what's REAL and buildable from
-- existing registries. It does NOT create a "Workspace" as a distinct
-- entity (organizations already is that, functionally), does NOT create
-- "Default Departments" (no such table/concept exists anywhere in the
-- schema), does NOT apply "Dashboard Configuration" (no
-- organization_type_dashboard_config table exists — only ever proposed,
-- never built, per .ai/02_INDUSTRY_ENGINE.md), and does NOT apply "AI
-- Configuration" (no live AI system exists to configure — see
-- docs/06_AI/INDEX.md). Navigation generation is explicitly out of scope
-- per current instruction and Phase 4's own not-started status.
--
-- What this migration adds to org creation, all backed by real,
-- already-live tables:
--  - Persists company_size, employee_count, branch_count, warehouse_count,
--    country, timezone, preferred_language (columns added in
--    0028_organization_type_columns.sql, previously unused by the RPC).
--  - Applies the organization_type's default module configuration
--    (organization_type_modules, from 0027_industry_registry.sql) as
--    org_feature_flags rows — this is registry-driven module ENABLEMENT
--    (data), not navigation/UI rendering (explicitly out of scope).
--  - Logs an audit_logs entry for organization creation (log_audit_event
--    already exists and is used for every other platform-admin action;
--    org creation itself was never logged until now).

create or replace function public.create_organization_with_owner(
  org_name text,
  org_slug text,
  org_business_type text,
  p_organization_type_key text default null,
  p_company_size text default null,
  p_employee_count integer default null,
  p_branch_count integer default null,
  p_warehouse_count integer default null,
  p_country text default null,
  p_timezone text default null,
  p_currency text default null,
  p_preferred_language text default null
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
  owner_role_id uuid;
  starter_plan_id uuid;
  resolved_organization_type_key text;
begin
  resolved_organization_type_key := coalesce(
    p_organization_type_key,
    public.map_business_type_to_organization_type_key(org_business_type)
  );

  insert into public.organizations (
    name, slug, business_type, organization_type_key,
    company_size, employee_count, branch_count, warehouse_count,
    country, timezone, currency, preferred_language
  )
  values (
    org_name, org_slug, org_business_type, resolved_organization_type_key,
    p_company_size, p_employee_count, p_branch_count, p_warehouse_count,
    p_country, coalesce(p_timezone, 'UTC'), coalesce(p_currency, 'USD'), p_preferred_language
  )
  returning id into new_org_id;

  insert into public.roles (org_id, name, is_system_role)
  values (new_org_id, 'Owner', true)
  returning id into owner_role_id;

  insert into public.role_permissions (role_id, permission_id)
  select owner_role_id, id from public.permissions;

  insert into public.organization_members (org_id, user_id, role_id, status, joined_at)
  values (new_org_id, auth.uid(), owner_role_id, 'active', now());

  select id into starter_plan_id from public.plans where key = 'starter' limit 1;
  if starter_plan_id is not null then
    insert into public.subscriptions (org_id, plan_id, status)
    values (new_org_id, starter_plan_id, 'trialing');
  end if;

  -- Registry-driven module enablement (data), not navigation rendering.
  insert into public.org_feature_flags (org_id, flag_id, enabled)
  select new_org_id, ff.id, otm.default_enabled
  from public.organization_type_modules otm
  join public.feature_flags ff on ff.module_key = otm.module_key
  where otm.organization_type_key = resolved_organization_type_key
  on conflict (org_id, flag_id) do nothing;

  perform public.log_audit_event(
    new_org_id, 'organization.created', 'organization', new_org_id,
    jsonb_build_object(
      'organization_type_key', resolved_organization_type_key,
      'business_type', org_business_type
    )
  );

  return new_org_id;
end;
$$;
