---
title: Permissions Matrix
last_updated: 2026-08-25
---

# Permissions Matrix

Derived directly from `supabase/migrations/*.sql` (grep for `insert into public.permissions` and `has_permission(` calls), 2026-08-25.

## Declared permissions (rows in `public.permissions`)

| Permission key | module_key | Source migration | Actively enforced via `has_permission()`? |
|---|---|---|---|
| `dashboard.view` | dashboard | `0001_init.sql` | No |
| `settings.manage_organization` | settings | `0001_init.sql` | Yes |
| `settings.manage_members` | settings | `0001_init.sql` | Yes |
| `settings.manage_roles` | settings | `0001_init.sql` | No |
| `billing.manage` | billing | `0001_init.sql` | Yes |
| `inventory.view` | inventory | `0002_inventory.sql` | No |
| `inventory.edit` | inventory | `0002_inventory.sql` | Yes |
| `inventory.adjust_stock` | inventory | `0002_inventory.sql` | Yes |
| `orders.view` | orders | `0004_orders.sql` | No |
| `orders.edit` | orders | `0004_orders.sql` | Yes |
| `crm.view` | crm | `0005_crm.sql` | No |
| `crm.edit` | crm | `0005_crm.sql` | Yes |
| `bookings.view` | bookings | `0006_bookings.sql` | No |
| `bookings.edit` | bookings | `0006_bookings.sql` | Yes |
| `purchasing.view` | purchasing | `0007_purchasing.sql` | No |
| `purchasing.edit` | purchasing | `0007_purchasing.sql` | Yes |
| `hr.view` | hr | `0008_hr_staff.sql` | No |
| `hr.edit` | hr | `0008_hr_staff.sql` | Yes |

**Note the gap**: every `.view` permission and `settings.manage_roles` is declared but not currently consumed by any `has_permission()` call in RLS policies or RPCs as of 2026-08-25 — `select` access is likely governed purely by `current_org_ids()` (any org member can view) rather than a finer-grained view permission. Verify current behavior before assuming `.view` permissions have any effect; see [16_PLAYBOOKS/CREATE_PERMISSION.md](../16_PLAYBOOKS/CREATE_PERMISSION.md) for how to close this gap if a permission needs enforcement added.

## Naming convention
`<module_key>.<action>` — every module follows `.view`/`.edit` at minimum, with occasional specific actions (`inventory.adjust_stock`).

## References
[16_PLAYBOOKS/CREATE_PERMISSION.md](../16_PLAYBOOKS/CREATE_PERMISSION.md) · [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md) · [docs/10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md)
