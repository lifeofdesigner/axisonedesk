---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

Industry Module Engine Phases 1, 2, and 3a are shipped and live: Module Registry (`0026`), Industry/Org-Type Registry (`0027`), and `organizations`' new nullable columns (`0028_organization_type_columns.sql`, including `organization_type_key`). All three migrations applied to the "Axis" project and verified by direct query. See [ROADMAP.md](ROADMAP.md) and ADR-005/006/007/008 in [DECISIONS.md](DECISIONS.md). Per the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), the session stopped there.

## Recommended next task (awaiting go-ahead)

**Industry Module Engine, Phase 3b: Onboarding wizard rewrite.**

See [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 3b for the full scope. This is the **highest-blast-radius phase in the whole plan** (auth-adjacent, first-run critical path) — build behind a feature flag with the current onboarding as fallback, not a hard cutover.

**Read this before starting**: `organizations.business_type` already exists and is already collected by the current `/onboarding` flow (`src/core/tenant/components/OnboardingForm.tsx`) as a free-text value from a hardcoded 11-item list (retail, fashion, supermarket, restaurant, pharmacy, warehouse, logistics, hotel, school, sme, wholesale) — it was never wired to module gating and only partially overlaps the 14 keys in `organization_types`. Phase 3b's first real decision is how to reconcile the two: map old values 1:1 where they match (retail, restaurant, pharmacy, hotel, wholesale) and treat the rest as `custom` or unset? Deprecate `business_type` entirely in favor of `organization_type_key`? Run both temporarily? This needs a deliberate decision recorded as an ADR before writing code, not something decided implicitly by whatever the first implementation happens to do.

**Do not start without explicit instruction.**

## Other candidates, not prioritized

- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md).
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md).
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
