---
title: Platform Recovery Runbook
---
# PLATFORM_RECOVERY

For a full platform outage (app unreachable, not just one feature broken).

1. Check Vercel status/deployment history — is the latest deploy the cause? If so, [ROLLBACK_PROCEDURE.md](ROLLBACK_PROCEDURE.md).
2. Check Supabase project status — is the database/auth reachable? If not, this is a Supabase-side incident; check Supabase's status page, no self-hosted fallback exists.
3. Check DNS/domain configuration if the app is unreachable but Vercel/Supabase both report healthy.
4. If root cause is a bad migration: [FAILED_MIGRATION.md](FAILED_MIGRATION.md).
5. Once root cause is identified, apply the matching specific runbook rather than improvising.

## Definition of Done
[PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) passes; incident recorded per [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md).
