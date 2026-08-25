---
title: Create Tenant Feature
---
# CREATE_TENANT_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [CREATE_MODULE.md](CREATE_MODULE.md) (a tenant feature is usually a module, or an addition to one).

## Purpose
Add a feature to the tenant-facing Application (as opposed to the Platform Owner Portal or public site).

## Workflow (delta)
Same as [CREATE_MODULE.md](CREATE_MODULE.md) if it's a new module; if it's an addition to an existing module, extend that module's `api.ts`/`hooks.ts`/components/pages in place rather than creating a new module for a small feature. Route under `RequireAuth` → `RequireOrg` → `AppShell`.

## Definition of Done
Generic DoD.
