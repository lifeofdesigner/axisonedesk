-- Industry Module Engine Phase 3a: organizations schema extension.
--
-- This is the narrow, schema-only foundation for Phase 3 ("Onboarding
-- wizard rewrite") in .ai/02_INDUSTRY_ENGINE.md — it deliberately does NOT
-- rewrite onboarding itself. That's Phase 3b, scoped separately because it
-- touches the auth-adjacent, first-run critical path (see the risk note in
-- docs/00_ADOS/NEXT_TASK.md and .ai/02_INDUSTRY_ENGINE.md's own Phase 3
-- risk callout: "should be shippable behind a flag, fall back to the old
-- minimal flow"). Same reasoning as ADR-005 (Module Registry) and ADR-006
-- (Industry Registry) — see ADR-008 in docs/00_ADOS/DECISIONS.md.
--
-- Important finding from auditing the current onboarding flow before
-- writing this: `organizations.business_type` already exists (0001_init.sql)
-- and is already collected by the onboarding form today — but as an
-- uncontrolled free-text value from a hardcoded 11-item list in
-- src/core/tenant/components/OnboardingForm.tsx (retail, fashion,
-- supermarket, restaurant, pharmacy, warehouse, logistics, hotel, school,
-- sme, wholesale) that has never been wired to module gating and only
-- partially overlaps the 14 keys seeded into organization_types by
-- 0027_industry_registry.sql. Reconciling business_type with
-- organization_type_key (migration/backfill strategy, form rewrite) is
-- explicitly Phase 3b's job, not this migration's — adding
-- organization_type_key here without a backfill plan is intentional; it
-- stays null for all existing and newly-created orgs until Phase 3b wires
-- it up.
--
-- timezone and currency already exist on organizations (with defaults)
-- from 0001_init.sql — not duplicated here.

alter table public.organizations
  add column organization_type_key text references public.organization_types(key),
  add column company_size text,
  add column employee_count integer,
  add column branch_count integer,
  add column warehouse_count integer,
  add column country text,
  add column preferred_language text;
