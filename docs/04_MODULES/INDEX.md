---
title: Modules
last_updated: 2026-08-25
---

# 04_MODULES

Tenant-facing modules live under `src/modules/<name>/` (`api.ts` + `hooks.ts` + components) with route files in `src/pages/`, gated by `RequireModuleEnabled moduleKey="..."` in `src/router.tsx`. Platform-facing modules are documented in [05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md) instead.

## Inventory

- **Purpose**: track products, variants, stock levels across categories/suppliers.
- **Tables**: categories, suppliers, products, product_images, product_variants, stock_adjustments, inventory_transactions.
- **Key RPC**: `adjust_stock` (atomic).
- **Routes**: `/inventory*`.
- **Status**: Complete. No automated tests.

## Orders

- **Purpose**: order lifecycle management.
- **Tables**: customers, orders, order_items, order_notes, order_events.
- **Key RPCs**: create/update order.
- **Routes**: `/orders*`.
- **Status**: Complete. No automated tests.

## CRM

- **Purpose**: customer notes and deal tracking on top of Orders' `customers` table.
- **Tables**: customer_notes, deals.
- **Routes**: `/crm*`.
- **Status**: Complete. No automated tests.

## Bookings

- **Purpose**: resource booking/scheduling.
- **Tables**: bookings, booking_resources.
- **Routes**: `/bookings`.
- **Status**: Complete. No automated tests.

## Purchasing

- **Purpose**: purchase order management.
- **Tables**: purchase_orders, purchase_order_items.
- **Routes**: `/purchasing*`.
- **Status**: Complete. No automated tests.

## HR & Staff

- **Purpose**: staff records and shift scheduling.
- **Tables**: staff, shifts.
- **Routes**: `/hr-staff`.
- **Status**: Complete but manual-only — no automated scheduling/timesheet clock-in.

## Reports

- **Purpose**: cross-module reporting.
- **Routes**: `/reports`.
- **Status**: Complete for what exists; no report builder or export pipeline beyond what's in the UI.

## Billing (tenant-facing, read-only)

- **Purpose**: view current plan and subscription.
- **Tables**: plans, subscriptions (reads only from tenant side; writes are platform-admin only, see [08_BILLING/INDEX.md](../08_BILLING/INDEX.md)).
- **Routes**: `/billing`.
- **Status**: Complete for display; no self-serve upgrade/downgrade/checkout.

## AI Assistant

- **Purpose**: in-app AI assistant.
- **Status**: **Shell only** — `src/modules/ai-assistant/AiAssistantOverview.tsx` explicitly disables the input/Ask button; no LLM provider wired, no Edge Function backing it. See [06_AI/INDEX.md](../06_AI/INDEX.md).
- **Routes**: `/ai-assistant`.

## Dashboard

- **Purpose**: cross-module overview.
- **Routes**: `/` (tenant home).
- **Status**: Complete; generic (not industry-tailored) — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) for planned per-industry dashboards.

## Settings

- **Routes**: `/settings*`.
- **Status**: Complete for org-level settings management.

## POS

- **Status**: Scaffolded only — `src/modules/pos/` exists but has **no route** in `src/router.tsx` and no page in `src/pages/`. Not reachable in the app. Tracked in [00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md).

## Module gating today

`RequireModuleEnabled` (`src/core/feature-flags/RequireModuleEnabled.tsx`) checks per-org feature flags (`feature_flags`/`org_feature_flags` tables), not subscription plan or RBAC permission. There is no Module Registry yet — module metadata (name, icon, route, dependencies) is not centralized; it's implicit in `router.tsx` + each module's own code. Building that registry is Phase 1 of the planned Industry Module Engine (see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)).
