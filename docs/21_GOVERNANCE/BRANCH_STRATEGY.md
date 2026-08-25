---
title: Branch Strategy
last_updated: 2026-08-25
---

# Branch Strategy

Current reality (verified via `git log`/`git status`, 2026-08-25): all history is direct commits to `main` — no feature-branch workflow observed, no CI to gate merges (see [docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md)).

**Recommended, not yet mandated**: feature branches for anything beyond a trivial fix, merged via PR once CI exists ([.ai/11_RELEASE_PROCESS.md](../../.ai/11_RELEASE_PROCESS.md) Phase 1) to give the quality gate something to run against before merge. Until CI exists, direct-to-`main` with local `pnpm build`/`pnpm lint` verification (per [docs/00_ADOS/SESSION_END.md](../00_ADOS/SESSION_END.md)) is the working substitute.

## References
[.ai/11_RELEASE_PROCESS.md](../../.ai/11_RELEASE_PROCESS.md)
