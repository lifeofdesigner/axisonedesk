---
title: Supabase Recovery Runbook
---
# SUPABASE_RECOVERY

For Supabase-side outages/degradation (as opposed to AxisOneDesk-caused issues — see [PLATFORM_RECOVERY.md](PLATFORM_RECOVERY.md) to distinguish first).

1. Check Supabase's status page for the affected project's region.
2. No self-hosted fallback exists — AxisOneDesk has a hard dependency on Supabase for Postgres, Auth, and Storage as of 2026-08-25 (see [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)). There is nothing to fail over to; the honest answer during a Supabase outage is that AxisOneDesk is also down.
3. Once Supabase recovers, run [PRODUCTION_VERIFICATION.md](PRODUCTION_VERIFICATION.md) to confirm the app reconnects cleanly (check auth session handling in particular — verify a logged-in user's session survives the outage rather than being silently broken).

## Definition of Done
App confirmed functional post-recovery; consider whether this incident is evidence to revisit the single-provider dependency (a business decision, not unilaterally engineering's to make).
