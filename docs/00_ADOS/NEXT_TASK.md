---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

Industry Module Engine Phase 1 (Module Registry) and Phase 2 (Industry/Org-Type Registry + Templates) both shipped their schema/API this session (`supabase/migrations/0026_module_registry.sql`, `0027_industry_registry.sql`, `src/core/modules/`, `src/core/industries/`) — see [ROADMAP.md](ROADMAP.md) "In Progress — Industry Module Engine" and ADR-005/ADR-006 in [DECISIONS.md](DECISIONS.md). Per the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), the session stopped there rather than continuing into Phase 3.

## Standing blocker (checked again this session, still unresolved)

Neither `0026_module_registry.sql` nor `0027_industry_registry.sql` has been applied to any live Supabase database. This environment has no authenticated CLI access to the project `VITE_SUPABASE_URL` actually points at — re-verified this session via `supabase link --project-ref yscvwtcrtbcfpkwtinvv`, which fails with "Your account does not have the necessary privileges to access this endpoint." Before Phase 3 starts, someone with real DB access should:
1. Link/authenticate to the actual project and `supabase db push` both migrations (0026 then 0027, in order).
2. Run `supabase gen types typescript --linked` and diff against the hand-authored type additions already in `database.types.ts` (for `modules`, `organization_types`, `organization_type_modules`, and their RPCs) — reconcile any difference.
3. Manually verify: `modules` has 12 rows, `organization_types` has 14 rows, `organization_type_modules` has mappings for the 9 industries listed in [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md); all `platform_*` RPCs are callable by a platform admin and rejected for a non-admin.

## Recommended next task (awaiting go-ahead)

**Industry Module Engine, Phase 3: Onboarding wizard rewrite.**

See [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) — extend `/onboarding` to collect industry/company size/branches/warehouses/country/timezone/currency/language, add `organization_type_key` (+ the other new columns) to `organizations`, and apply the selected type's module/role/dashboard defaults on org creation. This is explicitly the **highest-blast-radius** phase in the whole Industry Engine plan (auth-adjacent, first-run critical path) — per [docs/00_ADOS/RISK_REGISTER.md](../00_ADOS/RISK_REGISTER.md) and [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)'s own risk note, it should be built behind a flag with the old minimal onboarding as a fallback, not a hard cutover. **Do not start without explicit instruction**, and resolve the migration-application blocker above first if at all possible — testing an onboarding rewrite against a database that was never actually verified to have Phases 1-2 applied correctly is much riskier than testing it against a confirmed-good schema.

## Other candidates, not prioritized

- Resolve the Phase 1/2 migration-application blocker (see above) — arguably should happen before Phase 3.
- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md).
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md).
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
