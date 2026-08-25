---
title: Industry Module Engine Playbook
---

# 02 — Industry Module Engine

## Purpose

Define how to build a configuration-driven engine that lets the same AxisOneDesk codebase automatically adapt navigation, dashboards, roles, permissions, AI behavior, and onboarding to different business types — without per-industry code forks.

## Business Objective

A new customer signs up, picks (or the system infers) an organization type, and gets a workspace that feels purpose-built — no manual setup, no code changes for new industries.

## Scope

Module Registry, Industry Registry, Organization Type Library, template-driven onboarding, navigation/dashboard generation from config, role/permission generation per template, subscription-gated module unlocking, Platform Owner Portal "Industries" management UI, industry-aware AI prompt selection.

## Out of Scope (for this playbook)

Actually implementing AI provider calls (see [05_AI_SYSTEM.md](05_AI_SYSTEM.md)), Workspace/Collaboration (see [05_WORKSPACE_COLLABORATION.md](05_WORKSPACE_COLLABORATION.md)), payment provider wiring (see [07_INTEGRATIONS.md](07_INTEGRATIONS.md)).

## Current Implementation

Verified 2026-08-25 (see [docs/02_ARCHITECTURE/INDEX.md](../docs/02_ARCHITECTURE/INDEX.md)):

- Module gating exists but is **hardcoded**: each module route subtree in `src/router.tsx` is wrapped in `RequireModuleEnabled moduleKey="..."`, checking `feature_flags`/`org_feature_flags` (`0012_feature_flags.sql`). No central Module Registry table — module metadata (name, icon, category, dependencies, supported industries) doesn't exist anywhere.
- Onboarding (`/onboarding`) exists but is minimal — creates an org and membership; does not collect industry, company size, branches, warehouses, country, timezone, currency, language, and does not apply any template (none exist).
- Dashboard is generic (`src/modules/dashboard`) — same for every org.
- RBAC data model (`roles`, `permissions`, `role_permissions`) is per-org and dynamically editable via the Platform Owner Portal's Roles section, but there's no concept of "default roles for industry X" — new orgs don't get pre-seeded industry-appropriate roles.
- Subscription model (`plans.module_limits.modules`) exists and could gate module availability, but nothing currently reads it to enable/disable modules automatically.
- No Industry or Organization Type concept exists in the schema at all.

## Architecture Dependencies

- Builds on existing Feature Flags (`0012_feature_flags.sql`) — the Module Registry should integrate with, not replace, `feature_flags`/`org_feature_flags`.
- Builds on existing RBAC tables (`roles`, `permissions`, `role_permissions`) — template-driven role seeding creates rows in these tables, doesn't introduce a parallel role system.
- Builds on existing Subscription model (`plans`) for module gating.
- Touches `src/router.tsx` (navigation generation), `OrganizationProvider`/onboarding flow, and the Platform Owner Portal shell.

## Required Documentation

Update [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md), [docs/04_MODULES/INDEX.md](../docs/04_MODULES/INDEX.md), [docs/05_PLATFORM_OWNER/INDEX.md](../docs/05_PLATFORM_OWNER/INDEX.md), and add `docs/04_MODULES/MODULE_REGISTRY.md` + `docs/01_PRODUCT/INDUSTRY_TEMPLATES.md` once built.

## Required Database Changes (proposed, not yet built)

- `modules` (registry): key, name, description, category, icon, route, dependencies (jsonb array of module keys), required_permissions, feature_flag_key, supported_industries (jsonb), subscription_requirement, display_order, enabled (global default).
- `organization_types` (industry/org-type library): key, name, description, icon, is_system_default (bool, to distinguish shipped templates from platform-owner-created ones), archived_at.
- `organization_type_modules`: org_type_id, module_key, default_enabled (bool), is_optional (bool), is_hidden (bool).
- `organization_type_roles` / seed data: default roles + permission sets per org type (reuses `roles`/`permissions`/`role_permissions` — seeded per new org, not a new table).
- `organization_type_dashboard_config`: org_type_id, widget config (jsonb).
- `organizations` gains: `organization_type_id`, `company_size`, `employee_count`, `branch_count`, `warehouse_count`, `country`, `timezone`, `currency`, `preferred_language`.

Exact column types/constraints to be finalized at implementation time against the live schema — this is a plan, not a migration.

## Migration Strategy

Additive only. New tables, new nullable columns on `organizations`. Existing orgs get `organization_type_id = null` (treated as "generic/custom" — current behavior, unchanged) until backfilled. No existing table is altered in a breaking way. Each phase below ships as its own migration file following the existing numbering convention (see [docs/03_DATABASE/INDEX.md](../docs/03_DATABASE/INDEX.md)).

## Implementation Phases

**Phase 1 — Module Registry** (foundation, do this first)
- Migration: `modules` table, seed it with the 14 currently-shipped module keys (inventory, orders, crm, bookings, purchasing, hr-staff, reports, billing, ai-assistant, dashboard, settings — plus platform-admin sections if desired).
- Refactor `src/router.tsx`'s hardcoded `RequireModuleEnabled moduleKey="..."` list to read from the registry (still backed by `feature_flags`/`org_feature_flags` for the actual on/off state — registry adds metadata, doesn't replace the flag mechanism).
- No user-facing behavior change. Pure plumbing.
- Risk: low. Rollback: drop table, revert router changes.

**Phase 2 — Organization Type Library + Industry Registry**
- Migration: `organization_types`, `organization_type_modules`.
- Platform Owner Portal: new "Industries" section (CRUD, duplicate, archive) — extends the existing admin pattern (`security definer` RPCs, same as `0011_platform_admin_rpcs.sql`).
- Seed system-default templates: Manufacturing, Retail, Wholesale, Restaurant, Hotel, Construction, Healthcare, Pharmacy, Logistics, Agriculture, Education, Professional Services, E-commerce, Custom.
- Risk: low (additive, no gating changes yet).

**Phase 3a — `organizations` schema extension (done, 2026-08-25)**
- `supabase/migrations/0028_organization_type_columns.sql` added `organization_type_key` (FK to `organization_types`), `company_size`, `employee_count`, `branch_count`, `warehouse_count`, `country`, `preferred_language` — all nullable, no backfill. `timezone`/`currency` already existed on `organizations` since `0001_init.sql`, not duplicated.
- **Important finding, discovered while scoping this**: `organizations.business_type` already exists and is already collected by `/onboarding` today (`src/core/tenant/components/OnboardingForm.tsx`) — but as an uncontrolled free-text value from a hardcoded 11-item list (retail, fashion, supermarket, restaurant, pharmacy, warehouse, logistics, hotel, school, sme, wholesale) that has never been wired to module gating and only partially overlaps the 14 keys in `organization_types`. Phase 3b must decide the reconciliation strategy (map old values to new keys? deprecate `business_type`? run both temporarily?) — don't design that reconciliation casually, it affects every existing org's data.

**Phase 3b — Onboarding rewrite (not started)**
- Extend `/onboarding` to collect industry (now via `organization_type_key`, replacing or supplementing the free-text `business_type` picker — see the reconciliation note above) plus company size/branches/warehouses/country/preferred language (timezone/currency already collectible, columns pre-existed).
- On submit: create org with new columns populated, apply the selected `organization_type`'s module set (write `org_feature_flags` rows), seed default roles/permissions for that type, apply dashboard config, create default departments if that concept is added.
- `create_organization_with_owner()` (`0001_init.sql`/`0009_billing.sql`) will need a new signature or a companion RPC to accept and persist the new fields — extend it rather than replacing it, following the repo's existing "redefine via `create or replace function`" convention.
- Risk: medium-high — this is the highest-blast-radius phase (auth-adjacent, first-run critical path). Test the full signup→workspace flow manually before shipping. Rollback: feature-flag the new onboarding step; fall back to the old minimal flow.

**Phase 4 — Navigation & Dashboard generation from registry**
- `AppShell` navigation reads enabled modules from the registry instead of/in addition to today's hardcoded nav.
- Dashboard reads `organization_type_dashboard_config` for widget selection.
- Risk: medium (navigation is used by every route) — ship behind a flag, dogfood on one test org first.

**Phase 5 — Subscription-gated module unlocking**
- Cross-reference `modules.subscription_requirement` against the org's `plans.module_limits`; auto-enable/disable on plan change.
- Risk: low-medium.

**Phase 6 — AI behavior by industry**
- Depends on [05_AI_SYSTEM.md](05_AI_SYSTEM.md) existing first (there's no live LLM call path yet at all). Once it does, prompt selection reads `organization_types` config.

**Phase 7 — Org owner self-service module management**
- Settings UI for org owners to enable/disable optional modules within subscription limits, reorder nav, customize dashboard.

## Implementation Order

Phase 1 → 2 → 3 → 4 → 5, with 6 gated on the AI system playbook and 7 as a later self-service layer. Do not start Phase 3 (onboarding) before Phase 1-2 exist — there'd be nothing for it to apply.

## Testing Strategy

No test framework exists yet project-wide (see [docs/11_TESTING/INDEX.md](../docs/11_TESTING/INDEX.md)) — standing up at least manual QA checklists per phase is mandatory given the blast radius (onboarding, navigation, RBAC seeding all touched). Verify explicitly: different org types produce different module sets, hidden modules are genuinely inaccessible (not just hidden in nav — check RLS/route guards), existing orgs with `organization_type_id = null` continue working unchanged.

## Rollback Strategy

Each phase is additive and independently revertible: Phase 1-2 are pure new tables (drop and done). Phase 3 should be shippable behind a flag so onboarding can revert to the pre-existing flow. Phase 4 (navigation) should also ship flagged given every route depends on it.

## Risks

See phase-level risk notes above. Aggregate risk: touching onboarding + navigation + RBAC seeding in the same initiative is exactly the kind of multi-system change that benefits most from phasing and manual verification given zero automated test coverage exists today.

## Definition of Done

Matches [docs/00_ADOS/DEFINITION_OF_DONE.md](../docs/00_ADOS/DEFINITION_OF_DONE.md), plus: a new org created via onboarding with a chosen industry ends up with the correct module set, roles, and dashboard with zero manual admin steps; an existing pre-Industry-Engine org is unaffected.

## Future Enhancements

Cross-organization industry benchmarking, AI-suggested industry detection at signup, per-industry marketplace add-ons (see [08_MARKETPLACE.md](08_MARKETPLACE.md)).

## References

[docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md) · [docs/02_ARCHITECTURE/INDEX.md](../docs/02_ARCHITECTURE/INDEX.md) · [docs/04_MODULES/INDEX.md](../docs/04_MODULES/INDEX.md) · [docs/05_PLATFORM_OWNER/INDEX.md](../docs/05_PLATFORM_OWNER/INDEX.md) · [docs/03_DATABASE/INDEX.md](../docs/03_DATABASE/INDEX.md)
