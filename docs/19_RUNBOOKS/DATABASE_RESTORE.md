---
title: Database Restore Runbook
---
# DATABASE_RESTORE

**Not drill-tested as of 2026-08-25** — run this as a tabletop exercise against a non-production project before trusting it in a real incident.

1. Identify the restore point (point-in-time recovery, if enabled on the Supabase plan in use — verify).
2. Restore via Supabase dashboard/CLI to a **new** project first if possible, not directly over production, so you can verify integrity before cutover.
3. Verify row counts / spot-check key tables (`organizations`, `organization_members`) against expectations.
4. Regenerate `database.types.ts` from the restored schema and confirm it matches what's committed in the repo — a mismatch indicates the restore point predates a migration that's expected to be present.
5. Cut over (repoint the app's Supabase URL/keys) only after verification.

## Definition of Done
Data verified consistent, app functional against restored database, [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) passes.
