---
title: Performance Incident Runbook
---
# PERFORMANCE_INCIDENT

1. Confirm it's real and current (not a one-off blip) — check System Health (`/platform-admin/system-health`) and, if available, Vercel/Supabase dashboards for the relevant window.
2. Identify scope: one tenant, one query pattern, or platform-wide?
3. If a specific query/table is implicated, check for a missing index (see [.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md)) before assuming a code-level fix is needed.
4. If platform-wide and sudden, check recent deploys — a regression is more likely than organic growth suddenly causing a cliff.
5. Apply [16_PLAYBOOKS/PERFORMANCE_PLAYBOOK.md](../16_PLAYBOOKS/PERFORMANCE_PLAYBOOK.md) for the actual fix.

## Definition of Done
Measured metric back within acceptable range; incident recorded.
