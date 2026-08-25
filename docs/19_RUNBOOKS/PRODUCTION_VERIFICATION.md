---
title: Production Verification Runbook
---
# PRODUCTION_VERIFICATION

Run after any deploy, rollback, or recovery procedure.

1. App loads at the production URL, unauthenticated pages render (`/login`, a `/pages/:slug` CMS page).
2. Log in as a test tenant user — dashboard loads, no console errors.
3. Exercise one write path (e.g. create an inventory adjustment) — confirms DB connectivity and RLS are functioning, not just reads.
4. Log in as a platform admin — `/platform-admin` loads, tenant list renders (confirms `security definer` RPCs are functioning).
5. Check `error_logs` / System Health for any new errors correlated with the deploy time.
6. If schema changed: confirm `database.types.ts` in the deployed build matches the live schema (a mismatch here is a silent-failure risk — TypeScript won't catch a runtime column mismatch).

## Definition of Done
All six checks pass. If any fails, treat as an active incident — see [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md).
