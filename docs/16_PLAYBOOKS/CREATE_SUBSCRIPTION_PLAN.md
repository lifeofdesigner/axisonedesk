---
title: Create Subscription Plan
---
# CREATE_SUBSCRIPTION_PLAN

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a new plan tier to the `plans` table (`0009_billing.sql`).

## Workflow (delta)
1. Use `platform_upsert_plan(...)` RPC (`0014_subscription_licensing.sql`) via the Platform Owner Portal's Subscriptions UI — don't insert into `plans` directly from a new code path.
2. Set `seat_limit` and `module_limits.modules` appropriately — the latter is intended to gate module availability but note that as of 2026-08-25 nothing in the app actually reads `module_limits` to enforce it yet (see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md) and [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 5) — a new plan's limits are descriptive/future-facing until that enforcement ships.
3. No live payment provider exists, so a new plan cannot yet be self-serve purchased — it's manually assignable via `platform_update_subscription(...)` only.

## Definition of Done
Generic DoD.

## References
[docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md) · [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)
