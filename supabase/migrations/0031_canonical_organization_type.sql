-- Architecture decision (ADR-009, docs/00_ADOS/DECISIONS.md): organization_
-- type_key is the canonical, permanent Source of Truth for organization
-- classification going forward. business_type (0001_init.sql) becomes a
-- legacy compatibility field only — kept for existing consumers, not
-- referenced by new code, not removed (removal is a future major-version
-- roadmap item, only after an audit proves it's fully unused; see
-- .ai/02_INDUSTRY_ENGINE.md).
--
-- This migration:
--  1. Defines the business_type -> organization_type_key mapping as a
--     single reusable SQL function (not duplicated inline in multiple
--     places) — the mapping itself is documented with reasoning in ADR-009.
--  2. Backfills every existing organization's organization_type_key from
--     its business_type, via that mapping — additive only (only fills
--     currently-null values), non-destructive (business_type is untouched),
--     reversible (organization_type_key can be nulled back out; no data is
--     deleted).
--  3. Updates create_organization_with_owner so every NEW organization
--     always gets organization_type_key populated — either the caller's
--     explicit choice (from the flagged registry picker, see
--     0029_onboarding_industry_picker.sql) or, if none was passed, derived
--     from business_type via the same mapping. This guarantees
--     organization_type_key is never null for a new org from this point on,
--     regardless of whether the new picker UI is enabled — satisfying "no
--     new org should depend on business_type being the only classification"
--     without requiring the (still-flagged, still-unverified) UI change to
--     be turned on first.
--  4. Extends list_platform_organizations() with a trailing
--     organization_type_key column. Postgres does NOT allow changing the
--     OUT-parameter row type of a RETURNS TABLE function via CREATE OR
--     REPLACE (confirmed by trial against the live database — SQLSTATE
--     42P13 "cannot change return type of existing function"), so this
--     drops and recreates it rather than replacing in place; the function
--     is still granted to `authenticated` immediately after, so there's no
--     window where it's callable-but-broken beyond the single migration
--     transaction. get_platform_organization() needs no change — it
--     already returns to_jsonb(o.*), which includes every organizations
--     column including organization_type_key automatically.

create or replace function public.map_business_type_to_organization_type_key(p_business_type text)
returns text
language sql
immutable
as $$
  select case p_business_type
    when 'retail' then 'retail'
    when 'fashion' then 'retail'
    when 'supermarket' then 'retail'
    when 'restaurant' then 'restaurant'
    when 'pharmacy' then 'pharmacy'
    when 'warehouse' then 'wholesale'
    when 'wholesale' then 'wholesale'
    when 'logistics' then 'logistics'
    when 'hotel' then 'hotel'
    when 'school' then 'education'
    when 'sme' then 'custom'
    else 'custom'
  end;
$$;

update public.organizations
set organization_type_key = public.map_business_type_to_organization_type_key(business_type)
where organization_type_key is null;

create or replace function public.create_organization_with_owner(
  org_name text,
  org_slug text,
  org_business_type text,
  p_organization_type_key text default null
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

  insert into public.organizations (name, slug, business_type, organization_type_key)
  values (org_name, org_slug, org_business_type, resolved_organization_type_key)
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

  return new_org_id;
end;
$$;

drop function if exists public.list_platform_organizations();

create function public.list_platform_organizations()
returns table (
  id uuid,
  name text,
  slug text,
  business_type text,
  status public.organization_status,
  created_at timestamptz,
  deleted_at timestamptz,
  plan_name text,
  member_count bigint,
  organization_type_key text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  return query
    select
      o.id, o.name, o.slug, o.business_type, o.status, o.created_at, o.deleted_at,
      p.name as plan_name,
      (select count(*) from public.organization_members om where om.org_id = o.id) as member_count,
      o.organization_type_key
    from public.organizations o
    left join public.subscriptions s on s.org_id = o.id
    left join public.plans p on p.id = s.plan_id
    order by o.created_at desc;
end;
$$;

grant execute on function public.list_platform_organizations() to authenticated;
