---
title: Create Billing Feature
---
# CREATE_BILLING_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).

## Purpose
Extend billing/subscription functionality.

## Workflow (delta)
1. Tenant-facing reads (`/billing`) vs. platform-admin writes (`/platform-admin/subscriptions`) — preserve this split; don't give tenants direct write access to `plans`/`subscriptions`.
2. Anything involving real money requires a payment provider that doesn't exist yet — see [CREATE_PAYMENT_PROVIDER.md](CREATE_PAYMENT_PROVIDER.md) before building a feature that assumes live billing.
3. Extend existing tables (`plans`, `subscriptions`, `coupons`, `invoices`) rather than creating parallel billing structures.

## Definition of Done
Generic DoD.
