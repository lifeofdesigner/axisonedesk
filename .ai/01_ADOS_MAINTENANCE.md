---
title: ADOS Maintenance Playbook
---

# 01 — ADOS Maintenance

## Purpose

Keep `docs/00_ADOS/` and the numbered subject-area folders synchronized with the actual repository, forever.

## Business Objective

Every future session can start with "Continue" and get accurate context, instead of re-deriving it from conversation history or trusting stale docs.

## Scope

Detecting and fixing documentation drift; the SESSION_START/SESSION_END discipline; keeping `PROJECT_HEALTH.md` current.

## Out of Scope

Writing brand-new subject-matter documentation from scratch (that's a one-time act, already done as of 2026-08-25 — this playbook is about upkeep after that).

## Current Implementation

ADOS exists as of 2026-08-25 (see [docs/00_ADOS/INDEX.md](../docs/00_ADOS/INDEX.md)). No automated drift-detection tooling exists — this is a manual, session-discipline process today.

## Architecture Dependencies

None — this is a documentation-only playbook.

## Required Documentation

This playbook itself is the documentation for the process; the artifacts it maintains are all of `docs/`.

## Required Database Changes

None.

## Migration Strategy

N/A.

## Implementation Phases

**Phase 1 — Manual discipline (current state)**: every session follows [docs/00_ADOS/SESSION_START.md](../docs/00_ADOS/SESSION_START.md) and [SESSION_END.md](../docs/00_ADOS/SESSION_END.md).

**Phase 2 — Drift detection aid (future)**: a script that greps for known drift patterns (e.g. a table name referenced in docs that no longer exists in `database.types.ts`, a route referenced in docs no longer in `router.tsx`) and flags mismatches for human/AI review. Not built.

## Implementation Order

Phase 1 is already in effect. Phase 2 is optional future tooling, not blocking.

## Testing Strategy

N/A — verification is "does the doc match the code," done by direct inspection each session.

## Rollback Strategy

N/A.

## Risks

Docs silently drift if a session skips SESSION_END. The mitigation is procedural (SESSION_START step 8 requires spot-checking docs against code), not technical, until Phase 2 tooling exists.

## Definition of Done

For any given session: [docs/00_ADOS/SESSION_END.md](../docs/00_ADOS/SESSION_END.md) checklist fully completed before commit.

## Future Enhancements

Automated drift-detection script (Phase 2 above); a pre-commit hook that fails if `PROJECT_STATE.md`'s `last_updated` wasn't touched in a commit that changed `src/` or `supabase/migrations/`.

## References

[docs/00_ADOS/INDEX.md](../docs/00_ADOS/INDEX.md), all of `docs/00_ADOS/`.
