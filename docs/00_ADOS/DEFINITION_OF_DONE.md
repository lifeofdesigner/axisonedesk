---
title: Definition of Done
---

# Definition of Done

A change is **done**, not just "written", when all of the following are true:

- [ ] `pnpm build` passes (typecheck + production build).
- [ ] `pnpm lint` passes.
- [ ] No hardcoded values that should be configurable (secrets, provider config, industry-specific business rules) — see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) for the provider rule specifically.
- [ ] RLS policies exist and use the established primitives (`current_org_ids()`, `has_permission()`) for any new tenant table — no client-side-only tenant filtering.
- [ ] No duplicate Source of Truth created (no parallel table, no parallel API, no parallel doc covering the same subject as an existing one).
- [ ] Feature is reachable through the actual UI (route wired, gated correctly by `RequireAuth`/`RequireOrg`/`RequirePlatformAdmin`/`RequireModuleEnabled` as appropriate) — not just backend/API complete.
- [ ] For anything user-facing: manually exercised in the browser (golden path + at least one edge case), not just typechecked.
- [ ] Documentation updated per [SESSION_END.md](SESSION_END.md) — the relevant `docs/0X_*` file(s), `PROJECT_STATE.md`, `PROGRESS.md`, `ROADMAP.md`, `CHANGELOG.md`.
- [ ] No placeholder code or placeholder documentation left behind.
- [ ] If tests exist for the touched area, they pass. If they should exist and don't, it's logged in [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md), not silently skipped.

If any box can't be checked, the work is not done — either finish it or explicitly mark it Planned/In Progress in [ROADMAP.md](ROADMAP.md) and say so to the user.
