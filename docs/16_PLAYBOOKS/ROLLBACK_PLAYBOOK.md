---
title: Rollback Playbook
---
# ROLLBACK_PLAYBOOK

## Purpose
Revert a bad deployment safely.

## Prerequisites
Confirm the specific problem and that rollback (vs. a forward-fix) is actually the right call — a schema migration that's already been applied often can't be cleanly rolled back if data has been written against it; a forward-fix migration may be safer (see [19_RUNBOOKS/FAILED_MIGRATION.md](../19_RUNBOOKS/FAILED_MIGRATION.md)).

## Required Documentation
[19_RUNBOOKS/ROLLBACK_PROCEDURE.md](../19_RUNBOOKS/ROLLBACK_PROCEDURE.md).

## Audit Steps
Determine what changed: frontend only (safe to revert via Vercel), or database schema too (requires the migration-specific plan in [19_RUNBOOKS/FAILED_MIGRATION.md](../19_RUNBOOKS/FAILED_MIGRATION.md)).

## Implementation Workflow
Frontend-only: revert via Vercel's deployment history (redeploy the prior build) — this doesn't require a code revert commit if done at the platform level, but follow up with one so `main` reflects reality. Schema-involved: see [19_RUNBOOKS/FAILED_MIGRATION.md](../19_RUNBOOKS/FAILED_MIGRATION.md) — never `DROP` a column/table that already has production data without a verified backup.

## Validation
[19_RUNBOOKS/PRODUCTION_VERIFICATION.md](../19_RUNBOOKS/PRODUCTION_VERIFICATION.md) after rollback.

## Testing
Confirm the specific issue that triggered rollback is gone.

## Documentation Updates
[docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md) and [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md) if the rollback reveals an architectural lesson worth recording.

## Definition of Done
System confirmed stable at the prior known-good state.

## Commit Requirements
A revert commit on `main` even if the platform-level rollback already took effect, so history stays accurate.
