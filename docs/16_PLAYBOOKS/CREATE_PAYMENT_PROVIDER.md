---
title: Create Payment Provider
---
# CREATE_PAYMENT_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/PAYMENT_PROVIDER_TEMPLATE.md](../17_TEMPLATES/PAYMENT_PROVIDER_TEMPLATE.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (Payment Providers section).

## Purpose
Wire a real payment provider (Stripe, Paystack, etc.) — currently **none exist**; see [docs/08_BILLING/INDEX.md](../08_BILLING/INDEX.md).

## Workflow (delta)
1. Register the provider in the Provider Registry once built ([.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md) Phase 1) — do not hardcode Stripe-specific (or any provider-specific) logic directly into `src/modules/billing`.
2. Secret key server-only, via an Edge Function (see [CREATE_EDGE_FUNCTION.md](CREATE_EDGE_FUNCTION.md)) — checkout session creation and webhook handling both need server-side code that doesn't exist yet.
3. Webhook receiver verifies the provider's signature before updating `subscriptions`/`invoices` (see [CREATE_WEBHOOK.md](CREATE_WEBHOOK.md)).
4. Sandbox/test-mode credentials required before any live-mode testing, per [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).

## Definition of Done
Generic DoD, plus: a real subscription can be created end-to-end (checkout → webhook → `subscriptions` row updated) in sandbox mode.
