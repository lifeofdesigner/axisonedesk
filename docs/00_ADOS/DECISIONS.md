---
title: Architecture Decision Records
last_updated: 2026-08-25
---

# Decisions (ADR Log)

Each entry: context, decision, consequences. Add new ADRs at the top (most recent first).

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
