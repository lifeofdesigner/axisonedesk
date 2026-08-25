---
title: Storage Provider Config Template (target, not yet implemented)
---
# STORAGE_PROVIDER_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_STORAGE_PROVIDER.md](../16_PLAYBOOKS/CREATE_STORAGE_PROVIDER.md). Only Supabase Storage exists today (default, no config needed). Target shape for an alternative:

```json
{
  "key": "s3",
  "name": "AWS S3",
  "enabled": false,
  "bucket": "<bucket-name>",
  "region": "<region>",
  "is_default": false
}
```
