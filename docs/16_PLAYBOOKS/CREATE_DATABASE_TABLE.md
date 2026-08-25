---
title: Create Database Table
---
# CREATE_DATABASE_TABLE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/DATABASE_TEMPLATE.md](../17_TEMPLATES/DATABASE_TEMPLATE.md).

## Purpose
Add a new table via migration, correctly tenant-isolated from the start.

## Workflow (delta)
1. New migration file, next sequential number (see [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md) for current numbering — 25 as of 2026-08-25).
2. If the table is tenant-scoped: `org_id uuid not null references organizations(id)`, plus RLS per [CREATE_RLS_POLICY.md](CREATE_RLS_POLICY.md).
3. If the table is platform-admin-scoped (cross-tenant), no `org_id` — access goes through a `security definer` RPC instead, per [CREATE_SUPABASE_RPC.md](CREATE_SUPABASE_RPC.md).
4. `updated_at` trigger using the existing `public.set_updated_at()` function (see [docs/18_REFERENCE/RPC_REGISTRY.md](../18_REFERENCE/RPC_REGISTRY.md)) rather than writing a new trigger function.
5. Regenerate `src/core/supabase/database.types.ts` (`supabase gen types typescript --linked`) — this file is committed, don't skip it.

## Documentation Updates (delta)
Add the table to [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)'s table list and migration log.

## Definition of Done
Generic DoD, plus: table has RLS enabled (never leave RLS disabled on a new table, even temporarily) and appears in the regenerated types file.
