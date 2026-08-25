---
title: Create Background Job
---
# CREATE_BACKGROUND_JOB

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Run async, non-request-triggered work (digest emails, scheduled reports, cleanup tasks).

## Current state
No background job system exists in the repo as of 2026-08-25 — see [.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md) Phase 4. This playbook is the intended process once one exists; don't build a bespoke one-off job runner for a single job.

## Workflow (delta)
1. Confirm the job genuinely needs to be async/scheduled, not just a slow synchronous request — most CRUD doesn't need this.
2. Use Supabase's scheduled Edge Functions (`pg_cron` + Edge Function, or Supabase's built-in cron support) as the default mechanism rather than standing up separate job infrastructure.
3. Idempotency: a job that partially fails and re-runs should not double-apply its effect — design for at-least-once execution.

## Definition of Done
Generic DoD, plus: job is idempotent and its failure mode (what happens if it errors mid-run) is documented.

## References
[.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md)
