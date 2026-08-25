---
title: Roles Matrix
last_updated: 2026-08-25
---

# Roles Matrix

Derived from `supabase/migrations/*.sql`, 2026-08-25.

## Seeded system role

Only **one** system role is seeded automatically, by `create_organization_with_owner()` (`0001_init.sql`, redefined in `0009_billing.sql` to also attach a subscription):

| Role | `is_system_role` | Permissions granted | Source |
|---|---|---|---|
| Owner | true | Every row in `public.permissions` (all of them, no exceptions) | `0001_init.sql` / `0009_billing.sql` |

**There is no seeded "Admin" or "Member" role** — every organization starts with exactly one role (Owner, held by its creator) until an Owner creates additional custom roles.

## Custom roles

Created ad hoc via `platform_create_role(org_id, name, permission_ids)` (`0015_user_role_management.sql`) — arbitrary name, arbitrary permission subset, no naming convention enforced by the schema. Managed via `platform_update_role_permissions(role_id, permission_ids)` and surfaced in the Roles UI (`/roles`).

## Planned: role seeding per Industry/Org Type

Not implemented — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 3, which proposes seeding template-appropriate default roles (beyond just Owner) at org-creation time.

## References
[16_PLAYBOOKS/CREATE_ROLE.md](../16_PLAYBOOKS/CREATE_ROLE.md) · [docs/18_REFERENCE/PERMISSIONS_MATRIX.md](PERMISSIONS_MATRIX.md)
