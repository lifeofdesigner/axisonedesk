---
title: Create Supabase RPC
---
# CREATE_SUPABASE_RPC

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/RPC_TEMPLATE.md](../17_TEMPLATES/RPC_TEMPLATE.md).

## Purpose
Add a Postgres function for atomic multi-table writes or cross-tenant platform-admin operations — the repo's established pattern for both (see ADR-001 in [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md)).

## When to use this vs. plain table access
Use an RPC when: (a) a single logical operation writes to more than one table and must be atomic (e.g. `adjust_stock`), or (b) the operation is platform-admin cross-tenant (must be `security definer`). Simple single-table CRUD should go through PostgREST directly via the module's `api.ts`, not a needless RPC wrapper.

## Workflow (delta)
1. `create or replace function public.<name>(...)` in a new migration, per [CREATE_MIGRATION.md](CREATE_MIGRATION.md).
2. Tenant-scoped RPCs: rely on the caller's session + RLS as normal (no `security definer` needed unless doing genuinely privileged writes).
3. Platform-admin cross-tenant RPCs: `security definer`, and the **first line of the function body** must check `is_platform_admin(auth.uid())` and raise/return an error if false — see `supabase/migrations/0011_platform_admin_rpcs.sql` for the real pattern.
4. Grant execute to `authenticated` (not `anon`) unless there's a specific public-access reason.

## Documentation Updates (delta)
Add to [docs/18_REFERENCE/RPC_REGISTRY.md](../18_REFERENCE/RPC_REGISTRY.md).

## Definition of Done
Generic DoD, plus: if `security definer`, the admin check is verified to actually reject a non-admin caller (test it, don't just read the code).
