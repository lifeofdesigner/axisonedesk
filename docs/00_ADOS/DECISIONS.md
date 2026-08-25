---
title: Architecture Decision Records
last_updated: 2026-08-25
---

# Decisions (ADR Log)

Each entry: context, decision, consequences. Add new ADRs at the top (most recent first).

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
