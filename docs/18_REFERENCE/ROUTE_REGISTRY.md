---
title: Route Registry
last_updated: 2026-08-25
---

# Route Registry

Derived directly from `src/router.tsx`, 2026-08-25. This is a literal list, not a summary — cross-check against the file if it may have changed since.

## Public / unauthenticated
`/pages/:slug` · `/login` · `/signup` · `/forgot-password`

## Authenticated, pre-org
`/onboarding`

## Tenant Application (`RequireAuth` → `RequireOrg` → `AppShell`)

| Route | moduleKey gate |
|---|---|
| `/` (Dashboard) | none |
| `/inventory` | `inventory` |
| `/inventory/products` | `inventory` |
| `/inventory/categories` | `inventory` |
| `/inventory/adjustments` | `inventory` |
| `/inventory/products/new` | `inventory` |
| `/inventory/products/:productId` | `inventory` |
| `/orders` | `orders` |
| `/orders/list` | `orders` |
| `/orders/customers` | `orders` |
| `/orders/new` | `orders` |
| `/orders/:orderId` | `orders` |
| `/crm` | `crm` |
| `/crm/customers` | `crm` |
| `/crm/customers/:customerId` | `crm` |
| `/bookings` | `bookings` |
| `/purchasing` | `purchasing` |
| `/purchasing/new` | `purchasing` |
| `/purchasing/:purchaseOrderId` | `purchasing` |
| `/hr-staff` | `hr-staff` |
| `/reports` | `reports` |
| `/billing` | none |
| `/ai-assistant` | `ai-assistant` |
| `/settings` | none |
| `/settings/members` | none |
| `/settings/support` | none |

## Platform Owner Portal (`RequireAuth` → `RequirePlatformAdmin` → `PlatformAdminShell`)

`/platform-admin` · `/platform-admin/tenants` · `/platform-admin/tenants/:orgId` · `/platform-admin/audit-log` · `/platform-admin/feature-flags` · `/platform-admin/branding` · `/platform-admin/subscriptions` · `/platform-admin/users` · `/platform-admin/roles` · `/platform-admin/tickets` · `/platform-admin/tickets/:ticketId` · `/platform-admin/media` · `/platform-admin/notifications` · `/platform-admin/ai-providers` · `/platform-admin/system-health` · `/platform-admin/security` · `/platform-admin/developer-tools` · `/platform-admin/cms`

## Module keys gating tenant routes
`inventory`, `orders`, `crm`, `bookings`, `purchasing`, `hr-staff`, `reports`, `ai-assistant` — 8 distinct modules gated by `RequireModuleEnabled`. `dashboard`, `billing`, and `settings` are not module-gated.

## References
[16_PLAYBOOKS/CREATE_PAGE.md](../16_PLAYBOOKS/CREATE_PAGE.md) · [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)
