---
title: Module Registry (spec — not yet implemented)
last_updated: 2026-08-25
---

# Module Registry

**Does not exist as a table/system.** Today, "module" is an implicit concept spread across `src/router.tsx` (route + `RequireModuleEnabled moduleKey`), `feature_flags` (enable/disable), and each module's own `api.ts`/`hooks.ts`/components — there's no single table describing a module's metadata. Building this is [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 1.

## Current modules, described as the registry would once it exists

| Module key | Category | Route | Feature flag key | Dependencies | Real today? |
|---|---|---|---|---|---|
| inventory | Operations | `/inventory` | `inventory` | none | Yes |
| orders | Operations | `/orders` | `orders` | customers (shared w/ CRM) | Yes |
| crm | Sales | `/crm` | `crm` | customers table | Yes |
| bookings | Operations | `/bookings` | `bookings` | none | Yes |
| purchasing | Operations | `/purchasing` | `purchasing` | suppliers (inventory) | Yes |
| hr-staff | People | `/hr-staff` | `hr-staff` | none | Yes |
| reports | Analytics | `/reports` | `reports` | reads across modules | Yes |
| billing | Finance | `/billing` | none (always on) | plans/subscriptions | Yes (read-only) |
| ai-assistant | AI | `/ai-assistant` | `ai-assistant` | none | Shell only, disabled |
| dashboard | Analytics | `/` | none (always on) | reads across modules | Yes |
| pos | Operations | none — unrouted | n/a | inventory | Scaffolded, not reachable |

## Target registry fields (once built)
Name, Description, Category, Icon, Route, Dependencies, Feature Flag, Permissions, Subscription Requirement, Supported Industries, Dashboard Widgets, Reports, Notifications, AI Features, Database Tables, Services, APIs, Sidebar Position, Display Order, Owner, Status, Future Roadmap — per [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md).

## References
[.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) · [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md) · [ROUTE_REGISTRY.md](ROUTE_REGISTRY.md) · [FEATURE_FLAG_REGISTRY.md](FEATURE_FLAG_REGISTRY.md)
