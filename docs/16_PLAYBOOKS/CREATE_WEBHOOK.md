---
title: Create Webhook
---
# CREATE_WEBHOOK

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add either (a) an outbound webhook AxisOneDesk sends to a tenant's configured URL, or (b) an inbound webhook receiver for a third-party provider (e.g. a future Stripe webhook).

## Current state
`platform_webhooks` table exists (`0024_developer_tools.sql`) as a registry of outbound webhook configuration — no actual outbound delivery code or inbound receiver exists yet.

## Workflow (delta)
**Outbound**: triggered by a domain event (see [CREATE_EVENT.md](CREATE_EVENT.md)), delivered via an Edge Function (see [CREATE_EDGE_FUNCTION.md](CREATE_EDGE_FUNCTION.md)) with retry/backoff, signed payload (HMAC) so receivers can verify authenticity, logged to a delivery-attempts table (`webhook_deliveries` — referenced in `0024_developer_tools.sql`'s RLS but verify the table's actual write path before assuming it's populated).

**Inbound**: an Edge Function that verifies the provider's signature **before** trusting the payload, following [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)'s security requirements — never process an unverified inbound webhook.

## Definition of Done
Generic DoD, plus: for inbound, a deliberately-forged/unsigned request is verified to be rejected.

## References
[docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) · [.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md)
