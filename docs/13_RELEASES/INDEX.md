---
title: Release Process & Notes
last_updated: 2026-08-25
---

# 13_RELEASES

## Current state

No formal release process exists — `package.json` version is `0.1.0` and has not been bumped per feature (per `git log`, features ship as direct commits to `main`, not tagged releases). No CHANGELOG-driven release notes distinct from [00_ADOS/CHANGELOG.md](../00_ADOS/CHANGELOG.md) exist.

## Recommended minimum (not yet adopted)

Semantic version bump + git tag + release notes entry per user-visible feature or breaking change, once the product has external users depending on stability. Until then, [00_ADOS/CHANGELOG.md](../00_ADOS/CHANGELOG.md) and [00_ADOS/PROGRESS.md](../00_ADOS/PROGRESS.md) are the authoritative history.
