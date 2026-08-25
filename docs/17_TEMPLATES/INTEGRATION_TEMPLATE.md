---
title: Generic Integration Template (target, not yet implemented)
---
# INTEGRATION_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_INTEGRATION.md](../16_PLAYBOOKS/CREATE_INTEGRATION.md). Target Provider Registry entry shape (see [.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md)):

```json
{
  "key": "<provider-key>",
  "category": "<ai|payment|communication|auth|storage|analytics|maps|video|file|search|other>",
  "name": "<Provider Name>",
  "enabled": false,
  "environment": "sandbox",
  "health_status": "unknown",
  "last_tested_at": null
}
```
