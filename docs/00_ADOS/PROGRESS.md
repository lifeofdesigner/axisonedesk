---
title: Progress Log
last_updated: 2026-08-25
---

# Progress

Chronological build order, from `git log --oneline` (oldest → newest). This is the authoritative build history; see [CHANGELOG.md](CHANGELOG.md) for a human-readable per-release summary.

1. `8b47a5e` Phase 0 foundation — auth, organizations, RBAC data model, tenant provider.
2. `4c74117` Inventory (schema + UI).
3. `e432a57` Inventory live wiring.
4. `494d634` Orders.
5. `13c6436` CRM, Bookings, Purchasing, HR, Reports, Billing (read-only), AI Assistant shell, Dashboard.
6. `c2ceb74` Platform Owner Portal Phase 1 (tenants, audit log).
7. `80548ba` Feature Flags.
8. `40fe11c` Branding / white-label.
9. `eaba9b0` Subscription & Licensing (plans, coupons, manual invoicing, tenant subscription editor).
10. `d655b32` User & Role Management (platform-wide directory + dynamic RBAC editor).
11. `4402cbd` Support Center (tickets, threaded conversation, internal notes).
12. `68ed0d1` Media Library (file manager on `axiondesk-assets` bucket).
13. `6570f2e` Notifications (in-app notifications, announcements, maintenance mode).
14. `370889b` AI Provider Management (config only, no live LLM).
15. `135fd8e` System Health & Monitoring.
16. `985546e` Security Center.
17. `ba980af` Developer Tools (API keys / webhooks / edge functions registry).
18. `dbb4b67` CMS (public pages).
19. `cfb9f33` Vercel deep-link routing fix.
20. ADOS documentation system established (`docs/00_ADOS/` through `docs/15_DEVELOPER/`, `.ai/`).
21. Enterprise Engineering Knowledge Platform (EEKP) established: `docs/16_PLAYBOOKS/` (63 playbooks), `docs/17_TEMPLATES/` (24 templates), `docs/18_REFERENCE/` (23 registries, several derived from live-code audit of permissions/roles/routes/RPCs/RLS policies), `docs/19_RUNBOOKS/` (15 operational runbooks), `docs/20_OPERATIONS/`, `docs/21_GOVERNANCE/` (16 standards docs), `docs/22_PATTERNS/` (16 architectural principles), `docs/23_EXAMPLES/`, `docs/24_CHECKLISTS/` (12 checklists), `docs/25_DIAGRAMS/` (2 Mermaid diagrams). Added Autonomous Development Rule, Incremental Delivery Rule, and Architectural Foundations Rule to `AI_INSTRUCTIONS.md`. Added Enterprise Marketing Website milestone to `ROADMAP.md`. No application code changed.
22. Industry Module Engine Phase 1 (Module Registry): `supabase/migrations/0026_module_registry.sql` (`modules` table, seeded with 12 real modules, `platform_list_modules()`/`platform_upsert_module()` RPCs), `src/core/modules/{api.ts,hooks.ts}`, hand-authored type additions to `database.types.ts`. Purely additive metadata — `RequireModuleEnabled`/`feature_flags` gating unchanged, `src/router.tsx` intentionally not touched (see ADR-005). **Migration not yet applied to any live database** — no authenticated Supabase CLI access to the project this app actually points at in this environment; see [KNOWN_ISSUES.md](KNOWN_ISSUES.md) and [NEXT_TASK.md](NEXT_TASK.md).
23. Industry Module Engine Phase 2 (Industry/Org-Type Registry + Templates): `supabase/migrations/0027_industry_registry.sql` (`organization_types` + `organization_type_modules` tables, seeded with the 14-industry system-default template set, module mappings for the 9 with a researched proposal, `platform_list_organization_types()`/`platform_list_organization_type_modules()`/`platform_upsert_organization_type()`/`platform_archive_organization_type()`/`platform_restore_organization_type()`/`platform_set_organization_type_module()` RPCs), `src/core/industries/{api.ts,hooks.ts}`, hand-authored type additions to `database.types.ts`. `organizations` intentionally not modified (see ADR-006) — deferred to Phase 3.
24. Applied migrations 0026 + 0027 to the live "Axis" project: user re-authenticated the Supabase CLI to the correct account; `supabase link` and `supabase db push` succeeded; `supabase migration list` confirmed all 27 migrations applied on both sides. Regenerated `database.types.ts` via `supabase gen types typescript --linked` and diffed against the hand-authored version — content identical except RPC scalar `Args` are correctly non-nullable `string` (not `string | null`), fixed in `src/core/modules/api.ts` and `src/core/industries/api.ts` with explicit casts (see ADR-007). Verified live data via `supabase db query`: 12 rows in `modules`, 14 rows in `organization_types`, 42 rows in `organization_type_modules`, and confirmed `platform_upsert_module` rejects a call without platform-admin auth context. Build and lint pass against the live-verified types.
25. Industry Module Engine Phase 3a (`organizations` schema extension): `supabase/migrations/0028_organization_type_columns.sql` adds `organization_type_key` (FK to `organization_types`), `company_size`, `employee_count`, `branch_count`, `warehouse_count`, `country`, `preferred_language` — all nullable, no backfill. Applied to the live database and verified by direct schema query (7 new columns present, correct nullability). While scoping this, discovered `organizations.business_type` already exists and is already collected by `/onboarding` today as an uncontrolled free-text value that doesn't map cleanly onto `organization_type_key` — documented as a required decision for Phase 3b rather than resolved inline (see ADR-008). No application code changed; `database.types.ts` regenerated via CLI (had to strip CLI banner noise that leaked into stdout redirection — a one-off tooling snag, not a data issue). Build and lint verified passing.
26. Industry Module Engine Phase 3b slice 1 (canonical Source of Truth): per explicit user architecture directive, `organization_type_key` established as the permanent canonical classification, `business_type` demoted to legacy-compatibility only — full mapping table and reasoning in ADR-009. `supabase/migrations/0029_onboarding_industry_picker.sql` added a flagged (default-OFF) registry-backed onboarding picker and extended `create_organization_with_owner()`. Discovered live that `create or replace function` with an added parameter creates a Postgres overload rather than replacing the function — `0030_fix_create_organization_overload.sql` dropped the stale 3-arg version once caught. `0031_canonical_organization_type.sql` added a single-Source-of-Truth mapping function, backfilled all 3 existing organizations (verified: all `business_type='retail'` correctly mapped to `organization_type_key='retail'`), guaranteed every new org gets `organization_type_key` populated regardless of the picker flag's state, and extended `list_platform_organizations()` (required drop+recreate, `create or replace` doesn't allow changing a `RETURNS TABLE` function's output columns — also caught live). Updated `src/core/tenant/api.ts`, `src/core/platform-admin/api.ts`, `src/modules/settings/{api,types}.ts` to surface `organizationTypeKey` everywhere `businessType` was surfaced. Deliberately did not restyle the cosmetic nav labels (`OrgSwitcher`/`SidebarNav`/`TenantDetailPage`) or collect the remaining onboarding fields (company size, branches, etc.) — both tracked as Phase 3b slice 2. All 3 migrations applied to the live "Axis" project and verified by direct query. Build and lint verified passing.
27. `[this session]` Industry Module Engine Phase 3b slice 2 (full profile + module defaults + audit log): `supabase/migrations/0032_onboarding_full_profile.sql` extended `create_organization_with_owner()` to persist company_size/employee_count/branch_count/warehouse_count/country/timezone/currency/preferred_language, apply the selected organization type's default module set as `org_feature_flags` rows (verified live for `retail`: inventory/orders/crm/reports enabled, purchasing correctly left disabled), and log an `organization.created` audit event. The exact same overload bug as `0030` recurred (`0033_fix_create_organization_overload_2.sql` fixed it) — the lesson from slice 1 wasn't applied proactively this time, caught and fixed live regardless. `OnboardingForm.tsx` extended with all 8 new fields, gated behind the same flag. **Deliberately not built**: "Workspace" as a separate entity, "Default Departments," "Dashboard Configuration," "AI Configuration" — none of these systems exist; fabricating them was rejected (full reasoning in ADR-010). **Flag remains OFF**: could not perform the requested real end-to-end browser signup verification from this environment (no way to complete Supabase Auth confirmation, "Axis"'s production status unknown) — treated as a failed verification per the user's own stated rule, documented rather than skipped or faked. Build and lint verified passing.

## What's NOT yet started

- Industry Module Engine (Module Registry, Industry/Org-Type templates, template-driven onboarding).
- Workspace & Collaboration (channels, messaging, calls).
- Live third-party integrations of any kind (payments, LLM, email/SMS, maps, analytics, video, storage beyond Supabase).
- Automated tests (unit/integration/e2e) — zero exist.
- CI/CD pipeline — none exists.
- Client-side RBAC hook/component layer (`src/core/rbac/` is empty).

Update this file at the end of every session with what was actually shipped, not what was attempted.
