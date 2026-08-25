---
title: Create Role
---
# CREATE_ROLE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/ROLE_TEMPLATE.md](../17_TEMPLATES/ROLE_TEMPLATE.md).

## Purpose
Add a role (org-scoped, assignable to `organization_members`).

## Current state
Per-org roles are created two ways today: (1) automatically — every new org gets exactly one seeded system role, **"Owner"**, granted every permission (`create_organization_with_owner()`, `0001_init.sql`/`0009_billing.sql`); (2) manually — a Platform Owner or org admin creates custom roles via `platform_create_role(org_id, name, permission_ids)` (`0015_user_role_management.sql`), surfaced in the Roles UI (`/roles` in Platform Owner Portal, or org-level equivalent).

There is **no** seeded "Admin" or "Member" role — don't assume one exists.

## Workflow (delta)
1. Custom roles: use the existing `platform_create_role`/`platform_update_role_permissions` RPCs — don't insert into `roles`/`role_permissions` directly from a new code path.
2. System-seeded roles (per industry template, once the Industry Engine exists): see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 3 — seeding happens at org-creation time via the same `roles`/`role_permissions` tables, not a parallel mechanism.

## Definition of Done
Generic DoD.
