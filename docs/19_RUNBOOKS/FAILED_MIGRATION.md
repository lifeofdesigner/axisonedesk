---
title: Failed Migration Runbook
---
# FAILED_MIGRATION

1. **Do not** edit the failed migration file if it partially applied to production — per [16_PLAYBOOKS/CREATE_MIGRATION.md](../16_PLAYBOOKS/CREATE_MIGRATION.md), migrations are never edited post-ship, even a failed one, since the failure state itself needs to be understood, not erased.
2. Determine what actually applied vs. failed (a migration wrapped in `begin`/`commit`, per [17_TEMPLATES/MIGRATION_TEMPLATE.md](../17_TEMPLATES/MIGRATION_TEMPLATE.md), should be all-or-nothing — confirm this transaction boundary held).
3. Write a **new** migration that either completes the intended change correctly or reverts the partial change — never hand-edit production schema outside a migration file, or the migration history stops being the source of truth.
4. Regenerate `database.types.ts` after the fix migration applies.
5. Confirm the app is functional against the corrected schema.

## Definition of Done
Schema in a known-good, migration-history-consistent state; [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) passes.
