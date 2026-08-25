---
title: Architecture Decision Records
last_updated: 2026-08-25
---

# Decisions (ADR Log)

Each entry: context, decision, consequences. Add new ADRs at the top (most recent first).

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
