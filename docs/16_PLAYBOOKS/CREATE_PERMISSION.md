---
title: Create Permission
---
# CREATE_PERMISSION

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/PERMISSION_TEMPLATE.md](../17_TEMPLATES/PERMISSION_TEMPLATE.md).

## Purpose
Add a new permission key, consumed by `has_permission(org_id, key)` in RLS policies and RPCs.

## Naming convention (from real data — see [docs/18_REFERENCE/PERMISSIONS_MATRIX.md](../18_REFERENCE/PERMISSIONS_MATRIX.md))
`<module_key>.<action>` — e.g. `inventory.edit`, `inventory.adjust_stock`, `settings.manage_members`. Every existing module follows a `<module>.view` / `<module>.edit` pair at minimum; follow that unless the action genuinely doesn't fit (e.g. `inventory.adjust_stock` is a specific action beyond generic edit).

## Workflow (delta)
1. Insert into `public.permissions` (via migration) with `module_key` set.
2. Consume it via `has_permission(org_id, '<key>')` in the relevant RLS policy or RPC (see [CREATE_RLS_POLICY.md](CREATE_RLS_POLICY.md)).
3. Note: as of 2026-08-25, several declared permissions (`dashboard.view`, `settings.manage_roles`, and every module's `.view` key) exist in the `permissions` table but are **not actually enforced** by any `has_permission()` call in current migrations — verify whether the permission you're adding needs enforcement wired in, or is being declared for future use, and be explicit about which in your migration comment.

## Definition of Done
Generic DoD, plus: permission is either actively enforced by a policy/RPC, or explicitly noted as declared-but-not-yet-enforced (don't leave that ambiguous).
