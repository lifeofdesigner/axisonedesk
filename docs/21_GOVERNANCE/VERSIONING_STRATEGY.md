---
title: Versioning Strategy
last_updated: 2026-08-25
---

# Versioning Strategy

Current reality: `package.json` has stayed at `0.1.0` (verified 2026-08-25) — no semantic versioning practice is in effect; releases are tracked by commit + [docs/00_ADOS/CHANGELOG.md](../00_ADOS/CHANGELOG.md) entry, not version bumps.

**Recommended, not yet mandated**: adopt semver once the product has external consumers who need to reason about breaking changes (API consumers, if any ever exist) — see [.ai/11_RELEASE_PROCESS.md](../../.ai/11_RELEASE_PROCESS.md) Phase 3. Internally, database migration numbering (`NNNN_*.sql`) already serves as AxisOneDesk's real, working version counter for schema state — that convention should not be disturbed by adopting app-level semver.

## References
[.ai/11_RELEASE_PROCESS.md](../../.ai/11_RELEASE_PROCESS.md) · [docs/13_RELEASES/INDEX.md](../13_RELEASES/INDEX.md)
