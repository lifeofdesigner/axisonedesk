---
title: Create Industry
---
# CREATE_INDUSTRY

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md).

## Purpose
Add a new industry template (e.g. "Restaurant") to the Industry Registry.

## Current state
The Industry Registry **does not exist** — see [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md) (spec only) and [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 2. This playbook becomes actionable once that phase ships.

## Workflow (delta, once the system exists)
1. Insert into `organization_types` with the industry's key/name/description/icon.
2. Populate `organization_type_modules` (default/optional/hidden module sets) — reference [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md)'s proposed defaults per industry as a starting point, not gospel — validate against actual product need.
3. Seed default roles/permissions, dashboard config, per [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 2-3.
4. Do this via the Platform Owner Portal's "Industries" UI once built — not a raw SQL insert in production.

## Definition of Done
N/A until [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 2 ships.
