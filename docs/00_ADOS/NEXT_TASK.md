---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

No implementation task is currently open. The active session established ADOS + the `.ai/` playbook system per explicit instruction, and was told to **stop after that commit and wait for further instructions** before starting the Industry Module Engine.

## Recommended next task (awaiting go-ahead)

**Industry Module Engine, Phase 1: Module Registry.**

Rationale: every later phase (Industry Templates, Organization Type Library, template-driven onboarding, Platform Owner "Industries" management UI, navigation/dashboard generation) depends on a Module Registry existing first, since templates need something concrete to reference. Building the registry first also lets the existing hardcoded module list (currently just the `RequireModuleEnabled moduleKey="..."` calls in `src/router.tsx` + `feature_flags`/`org_feature_flags` tables) be migrated onto it without a second parallel system.

See [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) for the full phased plan, migration strategy, and risks before starting.

**Do not start this without explicit user instruction** — the user's directive for this session was audit + document + plan only.

## Other candidates, not prioritized

- Stand up automated testing (currently zero coverage) — see [11_TESTING/INDEX.md](../11_TESTING/INDEX.md).
- Stand up CI (currently none) — see [12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider (Stripe is referenced in ARCHITECTURE.md, not implemented) — see [08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [06_AI/INDEX.md](../06_AI/INDEX.md).
