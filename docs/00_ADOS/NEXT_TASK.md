---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

Industry Module Engine Phase 1 (Module Registry) shipped its schema/API this session (`supabase/migrations/0026_module_registry.sql`, `src/core/modules/`) — see [ROADMAP.md](ROADMAP.md) "In Progress — Industry Module Engine" and ADR-005 in [DECISIONS.md](DECISIONS.md). Per the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), the session stopped there rather than continuing into Phase 2.

## Blocker to resolve before Phase 1 can be considered fully done

Migration `0026_module_registry.sql` has **not been applied to any live Supabase database** — this environment has no authenticated CLI access to the project `VITE_SUPABASE_URL` actually points at. Before Phase 2 starts, someone with real DB access should:
1. `supabase link` (or equivalent) to the actual project and `supabase db push` to apply `0026_module_registry.sql`.
2. Run `supabase gen types typescript --linked` and diff the output against the hand-authored `modules`/`platform_list_modules`/`platform_upsert_module` type additions already in `database.types.ts` — reconcile any difference.
3. Manually verify: `select * from modules order by display_order;` returns the 12 seeded rows, and `platform_upsert_module(...)` is callable by a platform admin and rejected for a non-admin.

## Recommended next task (awaiting go-ahead)

**Industry Module Engine, Phase 2: Industry/Org-Type Registry + Templates.**

See [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) for the full plan — `organization_types` + `organization_type_modules` tables, seeded with system-default templates (Manufacturing, Retail, Restaurant, etc. — proposed defaults in [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md)), plus a Platform Owner Portal "Industries" section. **Do not start without explicit instruction**, and resolve the migration-application blocker above first if possible.

## Other candidates, not prioritized

- Resolve the Phase 1 migration-application blocker (see above) — arguably should happen before any further Industry Engine phases.
- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md).
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md).
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
