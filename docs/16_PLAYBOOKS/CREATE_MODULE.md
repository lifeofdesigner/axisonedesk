---
title: Create Module
---
# CREATE_MODULE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a new tenant-facing feature module (e.g. a hypothetical "Projects" module).

## Prerequisites
Confirm it doesn't already exist under a different name — check [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md). Confirm required tables don't already exist.

## Workflow (delta from generic)
1. Migration(s) for new tables, following [CREATE_MIGRATION.md](CREATE_MIGRATION.md) + [CREATE_RLS_POLICY.md](CREATE_RLS_POLICY.md).
2. `src/modules/<name>/{api.ts,hooks.ts,components}` — mirror `src/modules/inventory/`'s structure exactly (see [docs/23_EXAMPLES/INDEX.md](../23_EXAMPLES/INDEX.md)).
3. Route file(s) in `src/pages/`, registered in `src/router.tsx` under the tenant-app subtree, wrapped in `RequireModuleEnabled moduleKey="<name>"`.
4. Feature flag row (`feature_flags` table) for the new `moduleKey` — see [CREATE_FEATURE_FLAG.md](CREATE_FEATURE_FLAG.md).
5. Permission rows if the module needs edit/view distinction (see [CREATE_PERMISSION.md](CREATE_PERMISSION.md)) — follow the `<module>.view` / `<module>.edit` naming convention already used by every existing module (see [docs/18_REFERENCE/PERMISSIONS_MATRIX.md](../18_REFERENCE/PERMISSIONS_MATRIX.md)).
6. Add to navigation in `AppShell`.

## Documentation Updates (delta)
[docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md) gets a new section for the module, matching the format of existing entries.

## Definition of Done
Generic DoD, plus: module is reachable from navigation, gated correctly, and documented in `docs/04_MODULES/INDEX.md`.
