---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

Industry Module Engine Phase 1 (Module Registry) and Phase 2 (Industry/Org-Type Registry + Templates) are both **shipped and live**: `supabase/migrations/0026_module_registry.sql` and `0027_industry_registry.sql` are applied to the "Axis" project, `database.types.ts` is CLI-regenerated and verified, and the seeded data/RPC admin-checks were confirmed by direct query. See [ROADMAP.md](ROADMAP.md) "In Progress — Industry Module Engine" and ADR-005/ADR-006 in [DECISIONS.md](DECISIONS.md). Per the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), the session stopped there rather than continuing into Phase 3.

## Recommended next task (awaiting go-ahead)

**Industry Module Engine, Phase 3: Onboarding wizard rewrite.**

See [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) — extend `/onboarding` to collect industry/company size/branches/warehouses/country/timezone/currency/language, add `organization_type_key` (+ the other new columns) to `organizations`, and apply the selected type's module/role/dashboard defaults on org creation. This is explicitly the **highest-blast-radius** phase in the whole Industry Engine plan (auth-adjacent, first-run critical path) — per [docs/00_ADOS/RISK_REGISTER.md](../00_ADOS/RISK_REGISTER.md) and [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)'s own risk note, it should be built behind a flag with the old minimal onboarding as a fallback, not a hard cutover. **Do not start without explicit instruction.** Unlike the last two milestones, DB access is now confirmed working — verify with `supabase migration list` at the start of that session rather than assuming, since CLI auth state could change again between sessions.

## Other candidates, not prioritized

- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md).
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md).
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
