---
title: Billing & Licensing
last_updated: 2026-08-25
---

# 08_BILLING

## Current state

Real, DB-backed CRUD; **no live payment provider integrated**.

- `plans` table: id, key, name, price_monthly/yearly, seat_limit, module_limits.modules. Read via `src/modules/billing/api.ts` `listPlans()`.
- `subscriptions` table: plan_id, status, seats, current_period_end per org. Read via `getSubscription(orgId)`.
- Platform-admin side (`0014_subscription_licensing.sql`): plans CRUD, coupons, a manual invoice ledger (`invoices` table), tenant subscription editing — all operated by hand from the Platform Owner Portal's Subscriptions section. Migration comment explicitly states: no live Stripe integration exists.
- ARCHITECTURE.md's planned folder tree mentions a `stripe-webhook` Edge Function; it is **not present** in `supabase/functions/` (which contains only an empty `_shared/`).

## Tenant-facing

`/billing` route shows the current plan/subscription read-only. No self-serve checkout, upgrade, downgrade, or payment method management exists.

## Gap / next step

Wiring a real payment provider (Stripe or otherwise) is the highest-leverage step toward being able to actually charge customers. See [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (Payment Providers section) for the target multi-provider architecture and [00_ADOS/ROADMAP.md](../00_ADOS/ROADMAP.md).
