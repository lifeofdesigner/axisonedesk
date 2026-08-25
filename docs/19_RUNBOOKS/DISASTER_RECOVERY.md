---
title: Disaster Recovery Runbook
---
# DISASTER_RECOVERY

**Not drill-tested as of 2026-08-25.** Supabase provides automated backups for the underlying Postgres database — verify the actual backup retention/frequency configured for this specific project in the Supabase dashboard before relying on any assumed default.

1. Determine scope: database only, or also application/hosting (Vercel)?
2. Database: see [DATABASE_RESTORE.md](DATABASE_RESTORE.md).
3. Hosting: Vercel redeploys from `main` — if Vercel itself is down, this is outside AxisOneDesk's control; no alternate hosting exists.
4. Auth: Supabase Auth data is part of the same Postgres instance — recovering the database recovers auth state.
5. Storage (`axiondesk-assets`, branding bucket): confirm whether Supabase Storage is included in the same backup/restore scope as the database, or requires separate handling — verify against Supabase's current documentation for this project, don't assume.

## Definition of Done
Service restored, [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) passes, incident recorded per [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md).
