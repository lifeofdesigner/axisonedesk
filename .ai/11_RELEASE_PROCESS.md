---
title: Release Process Playbook
---

# 11 — Release Process

## Purpose
Guide for standing up CI/CD and a real release process, both currently absent.

## Business Objective
Reduce risk of shipping broken builds; enable confident, frequent releases as the team/customer base grows.

## Scope
CI pipeline, versioning, release notes, deployment automation.

## Out of Scope
Testing strategy itself (see the recommendation in [docs/11_TESTING/INDEX.md](../docs/11_TESTING/INDEX.md) — this playbook assumes tests will exist to run, it doesn't define them).

## Current Implementation
No CI (`.github/workflows` doesn't exist), no formal versioning/tagging, no release notes distinct from [docs/00_ADOS/CHANGELOG.md](../docs/00_ADOS/CHANGELOG.md). Deploy target is Vercel via `vercel.json` (SPA rewrite only). See [docs/12_DEPLOYMENT/INDEX.md](../docs/12_DEPLOYMENT/INDEX.md) and [docs/13_RELEASES/INDEX.md](../docs/13_RELEASES/INDEX.md).

## Architecture Dependencies
None blocking.

## Required Documentation
[docs/12_DEPLOYMENT/INDEX.md](../docs/12_DEPLOYMENT/INDEX.md), [docs/13_RELEASES/INDEX.md](../docs/13_RELEASES/INDEX.md).

## Required Database Changes
None.

## Migration Strategy
N/A.

## Implementation Phases
1. GitHub Actions workflow: `pnpm build` + `pnpm lint` on every PR — the minimum bar, achievable immediately.
2. Add test execution to the same workflow once [docs/11_TESTING/INDEX.md](../docs/11_TESTING/INDEX.md)'s recommendations are acted on.
3. Semantic versioning + git tags per release; bump `package.json` version per feature/breaking change instead of leaving it at `0.1.0` indefinitely.
4. Automated Supabase migration deployment as part of the release pipeline (currently manual via CLI).
5. Staging environment / preview deploys before production, if not already covered by Vercel's default PR preview behavior — verify Vercel project settings.

## Implementation Order
1 → 2 → 3, then 4-5 as the team's release cadence justifies the added process.

## Testing Strategy
The workflow itself should be tested by deliberately introducing a lint/type failure on a throwaway branch and confirming it's caught.

## Rollback Strategy
CI failures block merge, not deploy — reverting a bad deploy is a Vercel rollback, unaffected by this playbook.

## Risks
Low — this is pure tooling addition, not touching application behavior.

## Definition of Done
A PR with a deliberate type error or lint violation is blocked from merging by CI.

## Future Enhancements
Automated changelog generation from conventional commits.

## References
[docs/12_DEPLOYMENT/INDEX.md](../docs/12_DEPLOYMENT/INDEX.md) · [docs/13_RELEASES/INDEX.md](../docs/13_RELEASES/INDEX.md) · [docs/11_TESTING/INDEX.md](../docs/11_TESTING/INDEX.md)
