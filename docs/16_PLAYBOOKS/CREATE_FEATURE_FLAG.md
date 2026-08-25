---
title: Create Feature Flag
---
# CREATE_FEATURE_FLAG

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/FEATURE_FLAG_TEMPLATE.md](../17_TEMPLATES/FEATURE_FLAG_TEMPLATE.md).

## Purpose
Gate a module or feature behind a togglable flag, using the existing two-table model: `feature_flags` (global default) + `org_feature_flags` (per-org override), from `0012_feature_flags.sql`.

## Workflow (delta)
1. Insert a row into `feature_flags` with a stable key matching the `moduleKey` used in `RequireModuleEnabled` (see [docs/18_REFERENCE/FEATURE_FLAG_REGISTRY.md](../18_REFERENCE/FEATURE_FLAG_REGISTRY.md) for the current key list).
2. Manage default/override via the existing Platform Owner Portal RPCs: `platform_set_flag_default`, `platform_set_org_flag_override`, `platform_clear_org_flag_override` (`0012_feature_flags.sql`) — don't write new ones for a simple toggle.
3. Consume via `RequireModuleEnabled moduleKey="..."` for route-level gating, or a direct flag-read hook for finer-grained UI gating.

## Definition of Done
Generic DoD, plus: flag entry added to [docs/18_REFERENCE/FEATURE_FLAG_REGISTRY.md](../18_REFERENCE/FEATURE_FLAG_REGISTRY.md).
