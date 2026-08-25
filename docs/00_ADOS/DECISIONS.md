---
title: Architecture Decision Records
last_updated: 2026-08-25
---

# Decisions (ADR Log)

Each entry: context, decision, consequences. Add new ADRs at the top (most recent first).

## ADR-011 — 2026-08-25: Phase 4 slice 1 scope boundary — Dynamic Experience Engine foundation

**Context**: The user requested a "Dynamic Experience Engine" spanning nine areas: Dashboard layout generation, a KPI Engine, a Quick Action Engine, a Reports Engine (from the Module Registry), a Search Engine, "AI Experience" (industry-aware prompts), an Empty State Engine, a Demo Data Engine, and Help & Onboarding task generation — plus a full Platform Owner admin UI to configure all of it without code changes, plus a live end-to-end test proving every piece changes when organization type changes.

**Decision — single registry column, not new tables**: Per the explicit "do not introduce duplicate registries" instruction, all Phase 4 config lives in one new `organization_types.experience_config jsonb` column (`supabase/migrations/0034_experience_config.sql`), not a proliferation of new tables — extensible for every config shape this phase and future ones need.

**Decision — content only for what's real, not invented**: The user gave concrete, complete KPI/quick-action/empty-state examples for 6 industries: restaurant, hotel, retail, "warehouse" (mapped to the existing `wholesale` registry key, same reasoning as ADR-009's `business_type` mapping), manufacturing, healthcare. Those 6 are seeded with that exact content. The other 8 organization types (construction, pharmacy, logistics, agriculture, education, professional-services, e-commerce, custom) get `experience_config = null` — not a guessed default, not an empty-but-present config that implies "we checked and there's nothing." Every consumer of this data must treat null as the normal, expected case for 8 of 14 industries, not an error state.

**Decision — what was actually built and wired into real UI** (verified against the live database, not assumed):
- **Quick Actions**: `DashboardOverview.tsx` renders a dynamic action row from `experience_config.quickActions` — real navigation links to existing routes, zero fabricated functionality, renders nothing (not a fake generic set) when the active org's type has no configured actions.
- **Empty States**: `ProductsTable.tsx`'s "no products yet" empty state now reads `experience_config.emptyStates.inventory` when present, falls back to the existing generic copy otherwise. This is a single proof-of-pattern instance, not a sweep across every module's empty state — see "what wasn't built" below.
- **KPI definitions**: stored (key/label pairs), retrievable, but **not rendered anywhere**. See reasoning below.

**Decision — what was explicitly NOT built, and why** (per the no-fabrication rule):
- **KPI value computation / KPI cards on the Dashboard**: the user's examples (Kitchen Orders, Food Cost, Occupancy Rate, Machine Utilization, etc.) each require real backing queries against data the relevant modules don't currently expose in that shape — Orders has no "kitchen status" concept, Bookings has no occupancy-percentage calculation, Inventory has no "food cost" concept. Rendering a KPI card with no real number behind it, or inventing a plausible-looking calculation, would be exactly the kind of fabrication ADOS exists to prevent. KPI *definitions* are real and stored; KPI *values* are a follow-up milestone requiring real per-module query work, one industry at a time.
- **Dashboard layout/widget/section generation**: the request describes a generic widget-placement/sizing system. Building a real one (not a hardcoded facsimile) is a substantial UI engineering project on its own — out of scope for one slice.
- **Reports Engine**: "Reports should come from the Module Registry" — but the Module Registry has no per-report definition concept today (no `reports` field on `modules`, no report catalog anywhere). Would need new schema design, not just wiring existing data.
- **Search Engine**: no search feature exists anywhere in the app today (confirmed by repo audit — only the unused `cmdk` UI primitive is present). "Global search must adapt" presupposes a global search that doesn't exist yet.
- **AI Experience**: identical blocker to every prior AI-related decision this session — there is no live LLM call path anywhere in the codebase (see `docs/06_AI/INDEX.md`). "The AI must automatically understand the tenant's industry" cannot be built when there's no AI to configure.
- **Demo Data Engine**: generating "realistic sample data appropriate to their industry" per vertical is itself a significant, industry-specific content-creation project (what does realistic restaurant demo data actually look like vs. realistic hotel demo data) — not something to improvise inline.
- **Help & Onboarding task generation**: same reasoning as Quick Actions in principle, but not built this slice — bounding scope was necessary somewhere, and this was judged lower-priority than proving the Quick Action / Empty State pattern first.
- **Platform Owner config UI**: a full CRUD UI for dashboard layouts, KPI definitions, quick actions, search categories, reports, empty states, onboarding tasks, demo data, and AI behavior is, on its own, comparable in size to the entire existing Platform Owner Portal (13 sections, built across many prior sessions). Not attempted in one pass. `experience_config` can be edited directly via SQL/the Supabase dashboard until a UI exists.

**Decision — testing**: the user's requested validation ("verify changing organization type changes Dashboard/KPI/Quick Actions/Search/Reports/Empty States/AI/Onboarding") cannot be fully satisfied because most of those systems don't exist to change. What *was* verified directly against the live database: the migration applies cleanly, `experience_config` contains exactly the seeded JSON for all 6 configured industries (spot-checked `retail`), and the app compiles/typechecks against the live schema. The two real, wired paths (Quick Actions, one Empty State instance) are ready for a human to verify visually against the 3 existing live `retail`-type organizations — no new test org or live signup is needed for this verification, unlike Phase 3b's flag rollout.

**Consequences**: This is genuinely "slice 1 of Phase 4," not "Phase 4 complete." Six of nine requested engines have no rendering logic yet; the Platform Owner admin UI doesn't exist; two engines (AI, Search, arguably Reports) are blocked on other unbuilt systems entirely. Naming this precisely, rather than either overclaiming completion or silently doing a fraction of the ask, is the same discipline applied in ADR-010 and is being applied consistently for the same reason: a future session (or the user) reading ADOS should never have to guess what's real.

## ADR-010 — 2026-08-25: Phase 3b slice 2 scope boundary — what's real, what isn't, and why the flag stays OFF

**Context**: The user requested a complete onboarding rewrite that automatically creates, on org signup: Organization, Workspace, Owner, Organization Settings, Branding, Trial Subscription, Audit Log, Default Roles, Default Permissions, Default Departments, Industry Template, Module Configuration, Dashboard Configuration, and AI Configuration — then a full end-to-end verification through the real onboarding flow, with the feature flag flipped to default-on only if every check passes.

**Decision — what was built** (all real, backed by existing or newly-live tables, verified by direct query against the live database, not assumed):
- `organizations` row now persists all 11 requested fields: name, organization type (canonical `organization_type_key`), company size, employee count, branch count, warehouse count, country, timezone, currency, preferred language (`0032_onboarding_full_profile.sql`).
- Owner role + all permissions granted, org membership, trial subscription via the `starter` plan — all pre-existing, confirmed still correct.
- **Module Configuration**: the selected `organization_type`'s default module set (`organization_type_modules`, Phase 2's registry) is now automatically applied as `org_feature_flags` rows on org creation — real, registry-driven, verified by direct query for `retail` (inventory/orders/crm/reports enabled, purchasing correctly left disabled as optional).
- **Audit Log**: org creation is now logged via the existing `log_audit_event`, which it never was before this slice.

**Decision — what was NOT built, and why**:
- **"Workspace"** as a distinct entity: doesn't exist and isn't needed — `organizations` already *is* the tenant/workspace concept in this codebase's architecture (see [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)). Treating it as a separate thing to fabricate would create a duplicate Source of Truth.
- **"Default Departments"**: no `departments` table or concept exists anywhere in the schema. `.ai/02_INDUSTRY_ENGINE.md` itself only ever mentioned this conditionally ("if that concept is added"). Not fabricated.
- **"Dashboard Configuration"**: no `organization_type_dashboard_config` table exists — it was only ever a *proposed* column in the Industry Engine playbook's "Required Database Changes" section, never built. Applying config that doesn't exist would be fabrication.
- **"AI Configuration"**: no live AI system exists to configure at all (see [docs/06_AI/INDEX.md](../06_AI/INDEX.md) — the AI Assistant is still a disabled shell with no LLM call path). Nothing to apply.
- **Navigation generation**: explicitly out of scope per the user's own instruction ("do not begin Navigation Generation") and Phase 4's not-started status.
- **"Branding"**: no per-org action needed — `platform_settings`' branding defaults already apply to every org until customized via Settings; there's no separate "create branding" step in the current architecture to replicate.

**Decision — verification and the flag**: the user's own instruction states "if any verification fails, leave the feature flag OFF, fix the issue, and document why." A full, real, end-to-end signup through the actual browser UI is required to validate the complete flow, and this environment cannot safely perform one: there's no way to complete Supabase Auth's signup/confirmation flow from here, and "Axis" (the live database) is of unknown production status — creating a real test account without that certainty is not a call to make unilaterally. Treating "cannot perform the required verification" as equivalent to "verification did not pass": **`onboarding.industry_registry_picker` remains OFF.** What *was* verified without live signup: the migration applies cleanly, the module-defaults join produces exactly the expected rows for a real registry key (tested directly via `supabase db query`), the RPC signature and types compile and typecheck end-to-end, and — twice this session — a real bug (`create or replace function` silently creating a duplicate overload when parameters are added) was caught and fixed against the live database before it could cause a production issue.

**Consequences**: Everything shippable without fabrication or unauthorized live testing is built and live. The remaining gap — a human clicking through the actual signup flow in a browser, then flipping the flag — is a five-minute task for someone with legitimate access to a test account, not a multi-day engineering task. It's the one thing this session genuinely cannot do itself, and rather than skip it silently or fake it, it's named explicitly here and in `NEXT_TASK.md`.

## ADR-009 — 2026-08-25: `organization_type_key` is the canonical Source of Truth for organization classification; `business_type` is legacy-compatibility only

**Context**: ADR-008 flagged, but deliberately deferred, the question of how `business_type` (existing, not-null, still actively read by five files: `src/core/tenant/api.ts`, `src/core/platform-admin/api.ts`, `src/modules/platform-admin/TenantDetailPage.tsx`, `src/modules/settings/api.ts`, and displayed in `src/shared/components/layout/OrgSwitcher.tsx`/`SidebarNav.tsx`) relates to `organization_type_key`. The user then gave an explicit architecture directive: `organization_type_key` becomes the only canonical identifier going forward; `business_type` becomes legacy-compatibility only; no new code should depend on it; existing organizations must be safely backfilled, not left null; nothing about `business_type` may be destructively removed without first auditing that it's fully unused.

**Decision**:
1. **Mapping** (single Source of Truth: `public.map_business_type_to_organization_type_key(text) returns text`, `supabase/migrations/0031_canonical_organization_type.sql`), applied consistently everywhere the mapping is needed rather than duplicated inline:

   | Legacy `business_type` | Canonical `organization_type_key` | Reasoning |
   |---|---|---|
   | `retail` | `retail` | direct match |
   | `fashion` | `retail` | fashion retail is a retail subtype; no dedicated registry entry |
   | `supermarket` | `retail` | same reasoning |
   | `restaurant` | `restaurant` | direct match |
   | `pharmacy` | `pharmacy` | direct match |
   | `warehouse` | `wholesale` | warehousing/distribution operations map to the wholesale registry entry |
   | `wholesale` | `wholesale` | direct match |
   | `logistics` | `logistics` | direct match |
   | `hotel` | `hotel` | direct match |
   | `school` | `education` | direct match by concept, different key spelling |
   | `sme` | `custom` | **deliberate deviation** from the user-suggested default of "Professional Services": `sme` was the picker's explicit generic/fallback option ("General SME"), not a services-industry signal — forcing it into Professional Services would misclassify e.g. a small manufacturer or retailer who picked the generic option. `custom` (the registry's explicit "no preset defaults" entry) is the honest mapping for an uncontrolled catch-all. |
   | *(any other/unforeseen value)* | `custom` | defensive fallback — `business_type` has no DB check constraint, so a value outside the 11-item picker is theoretically possible even though unreachable via the current UI |

2. **Backfill**: every existing organization with `organization_type_key is null` gets it set via the mapping (`update ... where organization_type_key is null`) — additive only, `business_type` untouched, reversible (nulling `organization_type_key` back out loses nothing since `business_type` still holds the original value). Verified against the live database: all 3 existing orgs (all `business_type = 'retail'`) correctly backfilled to `organization_type_key = 'retail'`.
3. **Every new organization, from this migration forward, always gets `organization_type_key` populated** — `create_organization_with_owner` now resolves it via `coalesce(p_organization_type_key, map_business_type_to_organization_type_key(org_business_type))`, so this holds true whether the caller explicitly passes a key (the flagged registry picker from `0029_onboarding_industry_picker.sql`) or not (today's default, unflagged path). This means `organization_type_key` is reliably non-null for every org, old and new, without requiring the still-unverified new onboarding UI to be turned on first.
4. **API/type layer updated to surface `organization_type_key` everywhere `business_type` is currently surfaced** (`src/core/tenant/api.ts`, `src/core/platform-admin/api.ts`, `src/modules/settings/api.ts`/`types.ts`, plus `list_platform_organizations()` extended with a trailing column — `get_platform_organization()` needed no change since it already returns `to_jsonb(o.*)`), each marked with a comment pointing at this ADR and instructing new code to prefer it.
5. **Display components deliberately NOT changed this pass**: `OrgSwitcher.tsx`, `SidebarNav.tsx`, `TenantDetailPage.tsx` still render `businessType` as their label text. This is cosmetic-only (a lowercase capitalized string in the nav), not a data-correctness or architecture concern, and real Industry Engine-driven navigation is Phase 4's job — restyling these labels now, before Phase 4 exists, would likely be thrown away and redone. Tracked as a follow-up in `docs/00_ADOS/NEXT_TASK.md`, not silently skipped.
6. **`business_type` is not removed, deprecated in the schema, or stopped being written** — it remains a required column, still populated on every insert (unchanged), still read by existing platform-admin RPCs. Per the user's explicit instruction, removal is a future major-version roadmap item, only after an audit proves zero remaining usage — not attempted now.

**Consequences**: `organization_type_key` is now reliably populated and available end-to-end (DB, RPCs, API layer) for every organization, satisfying "every new feature must reference `organization_type_key`" for anything built from this point forward (Module Registry gating, dashboards, permissions, AI behavior, navigation, etc. — none of which are built yet, but none of them will need to invent their own mapping when they are). `business_type` keeps working exactly as before for every existing consumer — zero breaking changes. The one open follow-up is the cosmetic nav-label sweep (item 5), explicitly deferred rather than rushed.

## ADR-008 — 2026-08-25: Split Industry Engine Phase 3 into 3a (schema) and 3b (onboarding rewrite); don't touch onboarding or `business_type` yet

**Context**: [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 3 originally described one combined step: extend `organizations`' schema *and* rewrite `/onboarding` to use it, in one milestone. While scoping this, auditing the actual onboarding code revealed `organizations.business_type` already exists and is already collected by `OnboardingForm.tsx` as an uncontrolled free-text value (11 hardcoded options) that only partially overlaps the 14 keys seeded into `organization_types` by `0027_industry_registry.sql` — and was never wired to module gating at all.

**Decision**: Split Phase 3 into 3a (this milestone: add `organization_type_key` + 6 other nullable columns to `organizations`, no backfill, no UI change) and 3b (a future milestone: the actual onboarding rewrite, including deciding how to reconcile `business_type` with `organization_type_key`). Do not attempt the `business_type` reconciliation as a quick aside inside a schema migration — it affects every existing org's data and deserves its own deliberate design pass, not a decision made in passing while adding columns.

**Consequences**: Consistent with ADR-005/ADR-006's precedent of keeping each milestone narrow. `organizations` now has the columns Phase 3b needs, verified live, with zero behavior change to onboarding — a user signing up today still goes through the exact same flow as before this migration. Phase 3b inherits a known, documented complication (the `business_type` overlap) instead of discovering it under time pressure mid-rewrite.

## ADR-007 — 2026-08-25: Apply migrations 0026-0027 once DB access was restored, without expanding scope

**Context**: ADR-005 and ADR-006 both scoped their milestones narrowly partly *because* this environment had no authenticated Supabase CLI access to the "Axis" project — deferring `router.tsx`/`organizations` changes reduced risk on unverifiable code. Later the same day, the user re-authenticated the CLI to the correct account, and `supabase link`/`db push` succeeded.

**Decision**: Apply exactly the two already-written, already-reviewed migrations (`0026`, `0027`) as-is — no scope was added just because verification became possible. Regenerated `database.types.ts` via CLI and reconciled it against the hand-authored version (found byte-identical in content; one real correction taken: RPC scalar `Args` are non-nullable `string`, fixed with explicit casts in `src/core/modules/api.ts` and `src/core/industries/api.ts`, since the underlying SQL functions do accept null).

**Consequences**: ADR-005's and ADR-006's scoping reasoning (defer `router.tsx` and `organizations` changes to their own later milestones) stands independent of DB access — that was a risk-management choice about blast radius, not a workaround for missing credentials, so it wasn't revisited just because the blocker cleared. The Module and Industry/Org-Type Registries are now genuinely live and independently verified (12 modules, 14 org types, 42 mappings, admin-only RPC write access confirmed by direct query) rather than merely reviewed-on-paper.

## ADR-006 — 2026-08-25: Seed only the 14 system-default industry templates, not the full 29-item target list; don't touch `organizations`

**Context**: [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 2 calls for an Industry/Org-Type Registry with a target list that includes both a "system-default" set (Manufacturing, Retail, etc. — 14 industries) and a broader "Platform Owner can create entirely new types" set (Law Firm, Church, NGO, etc. — 15 more, per the Organization Type Library concept). The 9 industries with the highest-confidence module mapping were already documented with proposed defaults in [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md); the other 20 either lack a researched mapping or belong to the "created later without code changes" category by design.

**Decision**: Migration `0027_industry_registry.sql` seeds only the 14 system-default templates, with module-default mappings only for the 9 already researched. It does not seed the remaining 15 org types (those are meant to be added later through the registry itself, once a Platform Owner Portal UI exists — that's the whole point of the Organization Type Library being code-change-free). It also does not add an `organization_type_key` column to `organizations` — no onboarding flow exists yet to populate it (that's Phase 3), so adding it now would be an unconsumed schema change.

**Consequences**: Phase 2 stays scoped to "the registry and its seed data," matching Phase 1's precedent (ADR-005) of keeping each milestone narrow and independently revertible. Nothing outside this migration and `src/core/industries/` is affected. The registry has no consumers yet (same latent-value tradeoff as ADR-005) until Phase 3/4 build on it.

## ADR-005 — 2026-08-25: Scope Module Registry Phase 1 to schema + read API only, defer `router.tsx` refactor

**Context**: [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 1 describes both adding a `modules` table and refactoring `src/router.tsx`'s hardcoded `RequireModuleEnabled moduleKey="..."` calls to read from it, calling the combination "pure plumbing" with "no user-facing behavior change." With zero automated test coverage in the repo (see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md)), a router refactor touching every tenant route's gating logic is a real-behavior-change risk that can't be verified except by hand, one route at a time.

**Decision**: Ship the `modules` table, seed data, RPCs, and `src/core/modules/{api.ts,hooks.ts}` as one milestone. Explicitly do **not** touch `src/router.tsx` in this milestone — the registry exists as additive metadata only; gating continues to work exactly as before via `feature_flags`/`org_feature_flags`. Router consumption is deferred to Phase 4 (Navigation & Dashboard generation), where it was already scoped as its own phase.

**Consequences**: Phase 1 is now lower-risk and independently shippable/revertible (drop the table, delete two files). The registry is not yet consumed by anything, so its value is latent until a later phase reads it — that's an acceptable tradeoff against the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), which prioritizes one small verifiable milestone over a larger combined one.

## ADR-004 — 2026-08-25: Establish ADOS as the permanent engineering brain

**Context**: Repository had grown to 20 shipped modules with no persistent documentation system; continuity across Claude sessions depended entirely on conversation history.

**Decision**: Build `docs/00_ADOS/` (state/process) + numbered subject-area folders (`01_PRODUCT` … `15_DEVELOPER`) + `.ai/` (implementation playbooks). ADOS documents verified reality only; `.ai/` playbooks document how to build not-yet-built systems. Every future session must read `AI_INSTRUCTIONS.md` → `PROJECT_STATE.md` → `ROADMAP.md` → `PROGRESS.md` → `NEXT_TASK.md` → `KNOWN_ISSUES.md` → `DECISIONS.md` before implementing.

**Consequences**: Adds a documentation-maintenance obligation to every session (see [SESSION_END.md](SESSION_END.md)). In exchange, sessions can resume with "Continue" instead of re-deriving context.

## ADR-003 — pre-2026-08-25 (inferred from migration comments): Platform-admin cross-tenant access via `security definer` RPCs, not RLS bypass

**Context**: Platform Owner Portal needs to read/write across all tenants; standard RLS scopes to the caller's `organization_members` rows.

**Decision**: Cross-tenant operations go through dedicated `security definer` Postgres functions gated by an explicit `is_platform_admin(auth.uid())` check inside the function body (see `0011_platform_admin_rpcs.sql`), rather than relaxing RLS policies.

**Consequences**: Tenant isolation via RLS remains intact for all standard queries; platform-admin capability is an explicit, auditable, narrow surface (one function per capability) instead of a blanket bypass.

## ADR-002 — pre-2026-08-25 (inferred): No live third-party integrations until MVP core is complete

**Context**: ARCHITECTURE.md describes Stripe billing, live LLM AI Assistant, and Edge Functions; none were built during the MVP module build-out (Inventory → CMS).

**Decision**: Ship all modules with DB-backed CRUD and config-only integration tables first (billing plans/subscriptions, ai_providers, platform_webhooks); defer wiring real external providers.

**Consequences**: MVP is demoable and internally consistent without secrets/credentials, but billing, AI, and webhooks are non-functional for end users until Provider Management (see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)) is implemented.

## ADR-001 — pre-2026-08-25 (inferred from `0003_adjust_stock_rpc.sql`): Atomic stock adjustment via RPC, not client-orchestrated multi-step writes

**Context**: Initial inventory design required 5 client round-trips to adjust stock (read, compute, write product, write transaction, write adjustment), risking partial writes under network failure.

**Decision**: Replace with a single Postgres RPC (`adjust_stock`) that performs the adjustment atomically server-side.

**Consequences**: Establishes the pattern used later for `create_order`/`update_order` and platform-admin RPCs — multi-table writes go through RPCs, not client-side transaction emulation.
