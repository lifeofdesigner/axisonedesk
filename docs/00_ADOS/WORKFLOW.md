---
title: Engineering Workflow
---

# Workflow

## Day-to-day development loop

1. [SESSION_START.md](SESSION_START.md) procedure.
2. Implement incrementally — small, verifiable steps, extending existing modules/tables/APIs rather than creating parallel ones.
3. Verify locally (`pnpm dev`, `pnpm build`, `pnpm lint`; exercise the actual UI for anything user-facing).
4. [SESSION_END.md](SESSION_END.md) procedure.
5. Commit (and push only if authorized for this session).

## Adding a new module

1. Check [04_MODULES/INDEX.md](../04_MODULES/INDEX.md) and the Module Registry (once it exists, see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)) to confirm it doesn't already exist under a different name.
2. Add a migration in `supabase/migrations/` following the existing numbering + header-comment convention (see [03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)).
3. Regenerate `src/core/supabase/database.types.ts` (`supabase gen types typescript --linked`).
4. Add `src/modules/<name>/{api.ts,hooks.ts,components}` following the existing pattern (TanStack Query hooks over typed Supabase calls).
5. Add route file(s) under `src/pages/`, wire into `src/router.tsx` behind `RequireModuleEnabled moduleKey="..."`.
6. Add RLS policies using the existing `current_org_ids()` / `has_permission()` primitives — never bypass RLS from the client.
7. Document the module in [04_MODULES/INDEX.md](../04_MODULES/INDEX.md).
8. Update [ROADMAP.md](ROADMAP.md) and [PROGRESS.md](PROGRESS.md).

## Adding a new database migration

- Numbered, sequential, one concern per file, header comment stating purpose and (if applicable) which ARCHITECTURE.md section or ADR it implements.
- Never edit a migration that has already shipped — add a new one.
- Multi-table writes go through a `security definer` RPC when atomicity matters (see ADR-001 in [DECISIONS.md](DECISIONS.md)).

## Adding a new external provider integration

Follow [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) — providers are registered centrally, never hardcoded, credentials never shipped to the client.

## Working on a large/architectural initiative

Read the matching `.ai/` playbook first (see [.ai/README.md](../../.ai/README.md)), then follow its phased implementation order. Playbooks are guides, not permission to skip SESSION_START/SESSION_END.
