---
title: Create Service
---
# CREATE_SERVICE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/SERVICE_TEMPLATE.md](../17_TEMPLATES/SERVICE_TEMPLATE.md).

## Purpose
Add cross-cutting, non-data-access logic shared across modules (formatting, calculation, validation helpers) — the repo doesn't have a formal "services" layer distinct from `api.ts`/`hooks.ts`/`src/shared/lib`, so this playbook defines where new shared logic should live rather than describing an existing convention.

## Workflow (delta)
1. Pure business logic with no React/Supabase dependency → `src/shared/lib/`.
2. Logic specific to one module but shared across that module's components → `src/modules/<name>/` (co-located, not in `src/shared/`).
3. Cross-cutting concerns used app-wide (auth, tenant, feature flags) → `src/core/` — mirror the existing structure there, don't create a new top-level folder.

## Definition of Done
Generic DoD, plus: no duplicate logic — grep for an existing equivalent in `src/shared/lib` and `src/core` before writing a new one.
