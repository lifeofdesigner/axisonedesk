---
title: Next Task
last_updated: 2026-08-25
---

# Next Task

> Whoever finishes a task updates this file to point at the next one before ending the session.

## Immediate: none in progress

Industry Module Engine Phases 1, 2, 3a, and 3b-slice-1 are shipped and live. Most importantly: **`organization_type_key` is now the canonical, permanent Source of Truth for organization classification** — `business_type` is legacy-compatibility only, per ADR-009 in [DECISIONS.md](DECISIONS.md). Every existing org was safely backfilled; every new org (regardless of onboarding-picker-flag state) is guaranteed to get `organization_type_key` populated. See [ROADMAP.md](ROADMAP.md) for the full migration list (`0026`-`0031`, all applied and verified live).

## Recommended next task (awaiting go-ahead)

**Industry Module Engine, Phase 3b slice 2: remaining onboarding fields + picker flag rollout.**

Two independent pieces, either can go first:

1. **Collect the remaining Phase 3a columns in `/onboarding`**: `company_size`, `employee_count`, `branch_count`, `warehouse_count`, `country`, `preferred_language` (timezone/currency already collectible via existing columns, not yet exposed in the UI either). Requires extending `create_organization_with_owner()` again and the `OnboardingForm.tsx` UI.
2. **Decide when to flip `onboarding.industry_registry_picker` to default-on** — requires a real manual QA pass of the new registry-backed picker (create a test org through the actual browser UI, confirm both `business_type` and `organization_type_key` land correctly) before flipping the flag, since this environment has no way to click through the UI itself. **This manual QA step should happen before slice 2 is considered complete, and it needs a human, not just automated checks.**

**Not yet decided, worth resolving before or during slice 2**: apply the selected organization type's default module set (`org_feature_flags` rows from `organization_type_modules`), seed default roles, apply dashboard config — this is where Phase 3b actually starts delivering the "tailored workspace" product value, not just data-model correctness. Still the highest-blast-radius phase in the plan (auth-adjacent, first-run critical path) — keep behind the flag.

## Also worth doing, not yet prioritized

- Cosmetic follow-up: `OrgSwitcher.tsx`, `SidebarNav.tsx`, `TenantDetailPage.tsx` still display the legacy `businessType` label — low-risk, deliberately deferred to avoid restyling twice once Phase 4 navigation exists (see ADR-009 item 5).
- Stand up automated testing (currently zero coverage) — see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md).
- Stand up CI (currently none) — see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
- Build the client-side RBAC layer described in ARCHITECTURE.md but never implemented (`src/core/rbac/`).
- Wire a real payment provider — see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).
- Wire a real LLM provider for the AI Assistant shell — see [docs/06_AI/INDEX.md](../06_AI/INDEX.md).
- Enterprise Marketing Website — see [ROADMAP.md](ROADMAP.md), sequenced after Industry Module Engine Foundation.
