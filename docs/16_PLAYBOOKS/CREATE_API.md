---
title: Create API (module api.ts)
---
# CREATE_API

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/API_TEMPLATE.md](../17_TEMPLATES/API_TEMPLATE.md).

## Purpose
Add typed Supabase data-access functions for a module — the `api.ts` half of the established module pattern (see `src/modules/inventory/api.ts` as the reference example, [docs/23_EXAMPLES/INDEX.md](../23_EXAMPLES/INDEX.md)).

## Workflow (delta)
1. One function per operation (`listX`, `getX`, `createX`, `updateX`), typed against `database.types.ts` — never `any`.
2. Never call `fetch` directly against the Supabase REST endpoint — always through `@supabase/supabase-js`'s client.
3. Multi-table atomic operations call an RPC (see [CREATE_SUPABASE_RPC.md](CREATE_SUPABASE_RPC.md)) instead of sequencing multiple `.from().insert()` calls client-side.
4. Platform-admin `api.ts` files live under `src/core/platform-admin/`, not `src/modules/` — follow that split.

## Documentation Updates (delta)
None beyond the module's own entry in [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md) or [docs/05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md).

## Definition of Done
Generic DoD.
