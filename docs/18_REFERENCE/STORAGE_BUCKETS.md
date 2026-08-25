---
title: Storage Buckets
last_updated: 2026-08-25
---

# Storage Buckets

| Bucket | Purpose | Source |
|---|---|---|
| `axiondesk-assets` | General file storage, indexed by the `files` table | `0018_media_library.sql` |
| Branding assets bucket | Logo/branding uploads | `0013_branding.sql` (exact bucket name not confirmed in this audit pass — check `storage.objects` RLS policies in `0013_branding.sql` for the literal name before referencing it elsewhere) |

Both use Supabase Storage exclusively — no external storage provider is wired (see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Storage Providers).

## References
[16_PLAYBOOKS/CREATE_STORAGE_PROVIDER.md](../16_PLAYBOOKS/CREATE_STORAGE_PROVIDER.md) · [docs/05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md) (Media Library)
