---
title: Webhook Registry
last_updated: 2026-08-25
---

# Webhook Registry

`platform_webhooks` and `webhook_deliveries` tables exist (`0024_developer_tools.sql`), with RLS configured — this is a **registry/catalog**, not confirmed active delivery infrastructure as of the 2026-08-25 audit (see [docs/00_ADOS/TECHNICAL_DEBT.md](../00_ADOS/TECHNICAL_DEBT.md)). No inbound webhook receivers exist (no Edge Functions deployed at all, per [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)).

No outbound webhook is currently triggered by any event in the codebase — verify against `src/core/platform-admin/developer-tools-api.ts` before assuming otherwise.

## References
[16_PLAYBOOKS/CREATE_WEBHOOK.md](../16_PLAYBOOKS/CREATE_WEBHOOK.md) · [docs/05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md) (Developer Tools)
