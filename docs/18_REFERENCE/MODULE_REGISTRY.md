---
title: Module Registry
last_updated: 2026-08-25
---

# Module Registry

**Schema written, not yet applied to a live database.** `supabase/migrations/0026_module_registry.sql` defines a `modules` table (key, name, description, category, icon, route, dependencies, required_permissions, feature_flag_key, supported_industries, subscription_requirement, display_order, enabled) plus `platform_list_modules()`/`platform_upsert_module(...)` RPCs, seeded with the 12 real modules from [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md), and `src/core/modules/{api.ts,hooks.ts}` to read it — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 1. This migration has **not been applied to any live Supabase project** as of 2026-08-25: this environment had no authenticated CLI access to the project `VITE_SUPABASE_URL` actually points at (not in the linked account's `supabase projects list`, and no local Docker-based Supabase instance running). Apply it and regenerate `database.types.ts` via the CLI when access is available, and verify the hand-authored type additions in this commit against the CLI's actual output.

It is purely additive metadata — `RequireModuleEnabled`/`feature_flags`/`org_feature_flags` remain the actual on/off gating mechanism, unchanged. `src/router.tsx` has **not** been refactored to consume this registry (that was Phase 1's stretch goal per the playbook, deferred here as a separate risk-bearing change from adding the foundation table — see ADR in [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md)).

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
