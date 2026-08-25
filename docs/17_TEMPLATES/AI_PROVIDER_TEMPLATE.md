---
title: AI Provider Config Template
---
# AI_PROVIDER_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_AI_PROVIDER.md](../16_PLAYBOOKS/CREATE_AI_PROVIDER.md). Real fields per `ai_providers` table (`0021_ai_provider_management.sql`) and target field list in [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).

```json
{
  "key": "anthropic",
  "name": "Anthropic",
  "enabled": false,
  "base_url": "https://api.anthropic.com",
  "default_model": "claude-sonnet-5",
  "max_tokens": 4096,
  "temperature": 0.7,
  "is_connected": false
}
```

API key is stored/set via the Platform Owner Portal UI, never committed to this file or any source file.
