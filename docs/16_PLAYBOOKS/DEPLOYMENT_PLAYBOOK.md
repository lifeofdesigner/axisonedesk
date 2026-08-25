---
title: Deployment Playbook
---
# DEPLOYMENT_PLAYBOOK

## Purpose
Ship a change to production safely.

## Prerequisites
All quality gates pass locally ([docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md)).

## Required Documentation
[docs/12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md) — current reality: Vercel deploy, no CI, manual migration application via Supabase CLI.

## Audit Steps
Confirm any pending migrations are applied to the target Supabase project **before** deploying frontend code that depends on them (schema-first, code-second, to avoid a deploy window where the frontend expects columns/tables that don't exist yet).

## Implementation Workflow
1. `pnpm build` clean.
2. Apply any pending migrations via Supabase CLI.
3. Regenerate + commit `database.types.ts` if schema changed.
4. Push to `main` (Vercel deploys from `main` per `vercel.json`'s presence — verify actual Vercel project settings if in doubt).

## Validation
See [19_RUNBOOKS/PRODUCTION_VERIFICATION.md](../19_RUNBOOKS/PRODUCTION_VERIFICATION.md) after deploy.

## Testing
No automated test suite exists yet (see [docs/11_TESTING/INDEX.md](../11_TESTING/INDEX.md)) — manual smoke test of the golden path is currently the only gate.

## Documentation Updates
[docs/00_ADOS/PROJECT_STATE.md](../00_ADOS/PROJECT_STATE.md) "Last Build"/"Last Commit" fields.

## Definition of Done
Change is live and verified via [19_RUNBOOKS/PRODUCTION_VERIFICATION.md](../19_RUNBOOKS/PRODUCTION_VERIFICATION.md).

## Commit Requirements
Standard commit requirements per [docs/00_ADOS/WORKFLOW.md](../00_ADOS/WORKFLOW.md) — no `--no-verify`, no skipped hooks.

## Rollback
See [19_RUNBOOKS/ROLLBACK_PROCEDURE.md](../19_RUNBOOKS/ROLLBACK_PROCEDURE.md).
