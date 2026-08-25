---
title: Create Platform Owner Feature
---
# CREATE_PLATFORM_OWNER_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a new section to the Platform Owner Portal (like the 13 existing ones — Tenants, Audit Log, Feature Flags, etc.; see [docs/05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md)).

## Workflow (delta)
1. Route under `RequireAuth` → `RequirePlatformAdmin` → `PlatformAdminShell`, path prefix `/platform-admin/...` (except a few legacy top-level paths like `/audit-log` — check [docs/18_REFERENCE/ROUTE_REGISTRY.md](../18_REFERENCE/ROUTE_REGISTRY.md) for the exact current convention before assuming).
2. Cross-tenant reads/writes go through new `security definer` RPCs (see [CREATE_SUPABASE_RPC.md](CREATE_SUPABASE_RPC.md)) — never relax RLS to grant platform-admin access.
3. `src/core/platform-admin/<area>-api.ts` + `<area>-hooks.ts`, matching the existing 24-file pattern.
4. Add to [docs/05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md)'s section table.

## Definition of Done
Generic DoD, plus: verified a non-platform-admin user is rejected (both UI redirect and, more importantly, at the RPC level).
