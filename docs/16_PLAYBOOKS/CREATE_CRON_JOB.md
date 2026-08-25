---
title: Create Cron Job
---
# CREATE_CRON_JOB

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [CREATE_BACKGROUND_JOB.md](CREATE_BACKGROUND_JOB.md) (a cron job is a time-triggered background job — read that playbook first, this one only covers the scheduling delta).

## Purpose
Run work on a fixed schedule (daily digest, nightly cleanup).

## Current state
No cron infrastructure exists yet — see [CREATE_BACKGROUND_JOB.md](CREATE_BACKGROUND_JOB.md) Current state.

## Workflow (delta)
1. Schedule via `pg_cron` (Supabase-native) calling either a Postgres function directly or invoking an Edge Function via `pg_net` — prefer the simplest option that meets the job's needs.
2. Document the schedule (cron expression + timezone) alongside the job definition, not just in the Supabase dashboard, so it survives a dashboard-access-only person leaving.

## Definition of Done
Generic DoD, plus: schedule is documented in [docs/18_REFERENCE](../18_REFERENCE/INDEX.md) or the owning module's doc.
