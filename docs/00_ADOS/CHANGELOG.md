---
title: Changelog
---

# Changelog

Human-readable summary, newest first. Machine-verifiable detail is in `git log`; this file explains *why*, not just *what*.

## 2026-08-25 — Complete onboarding full-profile collection (Industry Engine Phase 3b slice 2)

`create_organization_with_owner()` now persists all 8 remaining onboarding fields requested (company size, employee count, branch count, warehouse count, country, timezone, currency, preferred language), automatically applies the selected organization type's default module configuration from the Phase 2 registry as `org_feature_flags` rows, and logs an `organization.created` audit event (`0032_onboarding_full_profile.sql`). `OnboardingForm.tsx` collects all of it, gated behind the same `onboarding.industry_registry_picker` flag as slice 1 — legacy flow (flag off, the default) is unaffected.

The exact same bug as the prior migration recurred: adding parameters via `create or replace function` created a duplicate Postgres overload instead of replacing the function, caught live and fixed in `0033_fix_create_organization_overload_2.sql`.

Explicitly NOT built, and documented in full in ADR-010 (`DECISIONS.md`) rather than silently skipped: "Workspace" as a distinct entity (organizations already is that), "Default Departments" (no such concept exists in the schema), "Dashboard Configuration" (never built, only ever proposed), "AI Configuration" (no live AI system exists to configure). Navigation generation was left untouched per explicit instruction.

**The feature flag stays OFF.** A full live end-to-end verification requires clicking through real Supabase Auth signup in a browser — not something this environment can safely do (no way to complete email confirmation, and the live database's production status is unknown). Per the user's own stated rule ("if verification fails, leave the flag OFF, document why"), that gap is treated as a failed verification, not worked around. Everything that could be verified without live signup was: the migrations apply cleanly, the module-defaults join produces exactly the expected rows for a real registry key, and the full app compiles/typechecks against the live schema. Build and lint verified passing.

## 2026-08-25 — Establish `organization_type_key` as canonical Source of Truth (Industry Engine Phase 3b slice 1)

Per an explicit architecture directive: `organization_type_key` is now the permanent, canonical identifier for organization classification across AxisOneDesk; `business_type` (existing since `0001_init.sql`) becomes legacy-compatibility only — kept working for every existing consumer, never referenced by new code, not removed (removal is a future major-version item, only after an audit proves zero usage).

Shipped in three migrations: `0029_onboarding_industry_picker.sql` (a feature flag, default OFF, plus an optional `organization_type_key` parameter on `create_organization_with_owner()`), `0030_fix_create_organization_overload.sql` (a corrective migration after discovering live that `create or replace function` with an added parameter creates a Postgres overload rather than replacing the function — both a 3-arg and 4-arg version existed simultaneously until this fix), and `0031_canonical_organization_type.sql` (a single reusable SQL mapping function from the 11 legacy `business_type` values to the 14 `organization_type` keys — full table and per-value reasoning in ADR-009 — a safe backfill of every existing organization, and a guarantee that every new organization gets `organization_type_key` populated going forward regardless of whether the new picker UI is enabled).

Also discovered live that `list_platform_organizations()` couldn't be extended via plain `create or replace` (Postgres rejects changing a `RETURNS TABLE` function's output columns that way) — required an explicit drop + recreate, done safely within the same migration transaction.

Updated `src/core/tenant/api.ts`, `src/core/platform-admin/api.ts`, and `src/modules/settings/{api.ts,types.ts}` to surface `organizationTypeKey` everywhere `businessType` was previously surfaced. Deliberately did not touch the cosmetic nav-label display components (`OrgSwitcher.tsx`, `SidebarNav.tsx`, `TenantDetailPage.tsx`) or collect the remaining onboarding fields (company size, branches, warehouses, country, language) — both tracked as Phase 3b slice 2 rather than rushed into this milestone.

All three migrations applied to the live "Axis" project and verified by direct query, including the backfill (all 3 existing organizations correctly mapped). Build and lint verified passing.

## 2026-08-25 — Industry Module Engine Phase 3a: `organizations` schema extension

Added `organization_type_key` (FK to `organization_types`), `company_size`, `employee_count`, `branch_count`, `warehouse_count`, `country`, and `preferred_language` to `organizations` (`supabase/migrations/0028_organization_type_columns.sql`) — all nullable, no backfill, zero behavior change to the current onboarding flow. Applied to the live database and verified by direct schema query. While scoping the originally-combined "Phase 3: onboarding rewrite" milestone, auditing `src/core/tenant/components/OnboardingForm.tsx` revealed `organizations.business_type` already exists and is already collected today as an uncontrolled free-text value (11 hardcoded options) that only partially overlaps the 14 keys in `organization_types` and was never wired to module gating. Rather than deciding the reconciliation strategy implicitly while adding columns, split the phase into 3a (this migration) and 3b (the actual onboarding rewrite, which must start by deciding how `business_type` and `organization_type_key` relate — see ADR-008 in `DECISIONS.md`). `.ai/02_INDUSTRY_ENGINE.md` updated with this finding so Phase 3b doesn't have to rediscover it. Build and lint verified passing.

## 2026-08-25 — Apply Module + Industry Registry migrations to the live database

DB access was restored this session (user re-authenticated the Supabase CLI to the account that owns the "Axis" project). Applied `0026_module_registry.sql` and `0027_industry_registry.sql` via `supabase db push` — `supabase migration list` now shows all 27 migrations applied both locally and remotely. Regenerated `database.types.ts` via `supabase gen types typescript --linked` and reconciled it against the hand-authored version from the prior two commits: identical in content, with one real correction — Supabase's codegen types RPC scalar `Args` as non-nullable `string`, not `string | null`, even though the underlying Postgres functions accept null; fixed with explicit casts in `src/core/modules/api.ts` and `src/core/industries/api.ts` (see ADR-007 in `DECISIONS.md`). Verified directly against the live database via `supabase db query`: 12 rows in `modules`, 14 in `organization_types`, 42 in `organization_type_modules` (exactly matching the seed data), and confirmed `platform_upsert_module` correctly rejects a call made without platform-admin auth context. No scope was added beyond applying what was already written — ADR-005/ADR-006's decisions to defer `router.tsx` and `organizations` changes stand unchanged. Build and lint verified passing.

## 2026-08-25 — Industry Module Engine Phase 2: Industry/Org-Type Registry + Templates

Added `organization_types` and `organization_type_modules` tables (`supabase/migrations/0027_industry_registry.sql`), seeded with the 14-industry system-default template set (module-default mappings only for the 9 with a researched proposal in `docs/18_REFERENCE/INDUSTRY_REGISTRY.md` — the other 5 intentionally left unmapped rather than guessed), plus `platform_list_organization_types()`, `platform_list_organization_type_modules()`, `platform_upsert_organization_type()`, `platform_archive_organization_type()`, `platform_restore_organization_type()`, `platform_set_organization_type_module()` RPCs and `src/core/industries/{api.ts,hooks.ts}`. `organizations` was deliberately not modified — no onboarding flow exists yet to populate an org-type FK (see ADR-006 in `DECISIONS.md`), matching Phase 1's precedent of keeping each milestone narrow. Same "written, not applied to any live database" status as Phase 1 — re-checked this session via `supabase link --project-ref <ref>`, which still fails with a privileges error against this CLI login. Build and lint verified passing against the hand-authored types.

## 2026-08-25 — Industry Module Engine Phase 1: Module Registry

Added `modules` table (`supabase/migrations/0026_module_registry.sql`), seeded with the 12 real shipped modules, plus `platform_list_modules()`/`platform_upsert_module()` RPCs and `src/core/modules/{api.ts,hooks.ts}`. Purely additive metadata — does not change any gating behavior (`feature_flags`/`org_feature_flags`/`RequireModuleEnabled` untouched). `src/router.tsx` was intentionally *not* refactored to consume the registry in this milestone — see ADR-005 in `DECISIONS.md` for why that was scoped out to keep this milestone small and low-risk per the Incremental Delivery Rule. **The migration has not been applied to any live database**: this session had no authenticated Supabase CLI access to the project the app's `.env` actually points at (its project ref isn't in the linked account's project list, and no local Docker-based Supabase instance is running). `database.types.ts` was updated by hand to match the migration's schema exactly and should be verified against `supabase gen types` once real DB access exists. Build and lint verified passing against the hand-authored types.

## 2026-08-25 — Enterprise Engineering Knowledge Platform (EEKP) established

Extended ADOS into a full recurring-task knowledge platform: `docs/16_PLAYBOOKS/` (63 playbooks — a generic CREATE workflow plus 53 artifact-specific playbooks and 9 process playbooks for bug fixes, releases, rollbacks, etc.), `docs/17_TEMPLATES/` (24 copy-paste skeletons), `docs/18_REFERENCE/` (23 registries — Permissions Matrix, Roles Matrix, Route Registry, RPC Registry, RLS Policy Registry, and others derived from a fresh live-code audit; Module/Industry/Organization Type/Provider registries marked Planned since those systems don't exist yet), `docs/19_RUNBOOKS/` (15 operational runbooks for deployment, incidents, recovery, and rotation), `docs/20_OPERATIONS/`, `docs/21_GOVERNANCE/` (16 standards documents), `docs/22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md` (16 governing principles), `docs/23_EXAMPLES/`, `docs/24_CHECKLISTS/` (12 actionable checklists), `docs/25_DIAGRAMS/` (2 Mermaid diagrams of the real route tree and RLS data flow). Added three permanent rules to `AI_INSTRUCTIONS.md`: Autonomous Development Rule (what "Continue" means), Incremental Delivery Rule (one milestone per session), Architectural Foundations Rule (never skip a required registry/config layer to build atop its absence). Added the Enterprise Marketing Website milestone to `ROADMAP.md`. No application code changed; build and lint verified passing.

## 2026-08-25 — ADOS established

Built the full Engineering Operating System: `docs/00_ADOS/` (state/process files), `docs/01_PRODUCT/` through `docs/15_DEVELOPER/` (subject-area reference, audited against actual code/migrations, no fabricated content), `docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md`, and `.ai/` (13 implementation playbooks for not-yet-built systems). No application code changed. Goal: future sessions can resume with "Continue" instead of re-deriving context from conversation history.

## Prior history (from `git log`, pre-ADOS)

- `6570f2e` Add Notifications: real in-app notifications, announcements, maintenance mode.
- `68ed0d1` Add Media Library: real file manager on the existing axiondesk-assets bucket.
- `4402cbd` Add Support Center: tickets with threaded conversation + platform-admin-only internal notes.
- `d655b32` Add User & Role Management: platform-wide user directory + dynamic RBAC editor.
- `eaba9b0` Add Subscription & Licensing: plans CRUD, coupons, manual invoicing, tenant subscription editor.
- `40fe11c` Add Branding / white-label.
- `80548ba` Add Feature Flags.
- `c2ceb74` Add Platform Owner Portal Phase 1 (tenants, audit log).
- `13c6436` Add CRM, Bookings, Purchasing, HR & Staff, Reports, Billing (read-only), AI Assistant shell, Dashboard.
- `494d634` Add Orders.
- `e432a57` Inventory live wiring.
- `4c74117` Add Inventory.
- `8b47a5e` Phase 0 foundation (auth, organizations, RBAC data model).
- `370889b` Add AI Provider Management (config only, no live LLM).
- `135fd8e` Add System Health & Monitoring.
- `985546e` Add Security Center.
- `ba980af` Add Developer Tools.
- `dbb4b67` Add CMS.
- `cfb9f33` Fix Vercel deep-link 404s.

(Ordering here follows the feature build sequence per `git log --oneline`; consult `git log` directly for exact commit ordering/timestamps.)
