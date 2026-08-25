---
title: Create Migration
---
# CREATE_MIGRATION

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/MIGRATION_TEMPLATE.md](../17_TEMPLATES/MIGRATION_TEMPLATE.md).

## Purpose
Ship any schema change safely, following the repo's established migration conventions.

## Workflow (delta)
1. File name: `NNNN_short_description.sql`, next sequential number, in `supabase/migrations/`.
2. Header comment stating purpose (every existing migration does this — see [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)'s migration log for the pattern).
3. One concern per migration — don't bundle unrelated schema changes.
4. Never edit a migration that has already shipped (already applied to any environment) — always add a new one, even to fix a mistake (see [0016_fix_platform_list_users.sql](../../supabase/migrations/0016_fix_platform_list_users.sql) for the established "fix via new migration" pattern).
5. Apply via Supabase CLI against the linked project; regenerate `database.types.ts` after.

## Migration Strategy
Prefer additive (new tables/columns nullable or defaulted) over breaking changes. If a breaking change is unavoidable, document the rollout/rollback plan in the migration's header comment and in [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md).

## Definition of Done
Generic DoD, plus: migration applies cleanly to a fresh database (not just incrementally to an already-migrated one) — verify if in doubt.
