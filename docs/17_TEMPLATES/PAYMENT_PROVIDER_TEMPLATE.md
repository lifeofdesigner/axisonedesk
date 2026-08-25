---
title: Payment Provider Config Template (target, not yet implemented)
---
# PAYMENT_PROVIDER_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_PAYMENT_PROVIDER.md](../16_PLAYBOOKS/CREATE_PAYMENT_PROVIDER.md). No payment provider table exists yet — this is the target shape per [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).

```json
{
  "key": "stripe",
  "name": "Stripe",
  "enabled": false,
  "sandbox_mode": true,
  "supported_currencies": ["USD", "EUR"],
  "supported_countries": ["US", "GB"],
  "is_default": false
}
```

Secret/publishable keys stored server-side only, never in this config document.
