-- Industry Module Engine Phase 3b, slice 1: let onboarding optionally set
-- organization_type_key, behind a feature flag defaulted OFF.
--
-- Per ADR-009 (docs/00_ADOS/DECISIONS.md) and the reconciliation note added
-- to .ai/02_INDUSTRY_ENGINE.md in Phase 3a: `business_type` (existing,
-- not-null, still read by src/core/tenant/api.ts and platform-admin tenant
-- listing) is NOT removed or replaced here. Instead, when the new flag is
-- enabled, the onboarding picker is backed by the real organization_types
-- registry instead of the old hardcoded 11-item list, and the selected key
-- is written to BOTH business_type (so every existing consumer of that
-- column keeps working unchanged) AND organization_type_key (the new,
-- correctly-typed FK). Existing organizations are not touched — no
-- backfill, per ADR-008.
--
-- This is intentionally the smallest safe slice of Phase 3b: it adds one
-- new field (industry) to onboarding, not company size/branches/
-- warehouses/country/language — those remain uncollected until a later
-- milestone, keeping this change reviewable and low-risk per the
-- Incremental Delivery Rule in docs/00_ADOS/AI_INSTRUCTIONS.md.
--
-- Feature flag defaults to OFF: until a platform admin explicitly enables
-- it (after manual QA of the new picker), onboarding behaves byte-for-byte
-- identically to before this migration — this is the "shippable behind a
-- flag, fall back to the old minimal flow" rollback strategy
-- .ai/02_INDUSTRY_ENGINE.md's Phase 3 risk note calls for.

insert into public.feature_flags (key, module_key, description, default_enabled) values
  ('onboarding.industry_registry_picker', null,
   'Use the live organization_types registry for the onboarding industry picker instead of the legacy hardcoded list. Off by default — enable only after manually verifying the new picker end-to-end.',
   false)
on conflict (key) do nothing;

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
begin
  insert into public.organizations (name, slug, business_type, organization_type_key)
  values (org_name, org_slug, org_business_type, p_organization_type_key)
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
