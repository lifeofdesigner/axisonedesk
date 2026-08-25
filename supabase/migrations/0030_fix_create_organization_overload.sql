-- Fix: 0029_onboarding_industry_picker.sql's `create or replace function
-- create_organization_with_owner(org_name, org_slug, org_business_type,
-- p_organization_type_key default null)` did NOT replace the original
-- 3-argument function from 0001_init.sql/0009_billing.sql — Postgres
-- treats a function with an added parameter as a distinct overload, not
-- a replacement, since function identity includes the parameter list.
-- Verified directly against the live database after 0029 applied: both
-- create_organization_with_owner(text,text,text) and
-- create_organization_with_owner(text,text,text,text) existed
-- simultaneously, both granted to `authenticated`.
--
-- The 3-arg overload is now dead code (the client always calls with 4
-- named arguments as of the same commit that added 0029) and, more
-- importantly, is a duplicate Source of Truth for org creation that could
-- silently diverge from the 4-arg version over time. Drop it. Per the
-- repo's migration convention, this is a new migration rather than an
-- edit to 0029 — 0029 already shipped.

drop function if exists public.create_organization_with_owner(text, text, text);
