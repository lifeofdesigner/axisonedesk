---
title: Backup Validation Runbook
---
# BACKUP_VALIDATION

No scheduled backup-validation process exists yet. Recommended minimum, not yet adopted as a cadence:

1. Periodically (e.g. quarterly) perform a test restore per [DATABASE_RESTORE.md](DATABASE_RESTORE.md) into a throwaway project.
2. Confirm the restored schema's migration count matches `supabase/migrations/` in the repo at that point in time.
3. Confirm a spot-check of real (or synthetic) tenant data is present and RLS still functions correctly against it.
4. Record the validation date and outcome — no dedicated log exists for this yet; use [docs/00_ADOS/CHANGELOG.md](../00_ADOS/CHANGELOG.md) or a future `docs/20_OPERATIONS` log until one is built.

An untested backup is not a backup — this runbook exists specifically because [DISASTER_RECOVERY.md](DISASTER_RECOVERY.md) currently rests on an unverified assumption.
