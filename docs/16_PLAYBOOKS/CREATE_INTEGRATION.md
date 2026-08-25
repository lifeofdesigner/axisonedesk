---
title: Create Integration
---
# CREATE_INTEGRATION

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md).

## Purpose
General entry point for "connect AxisOneDesk to an external system" — if the integration fits one of the specific provider categories (AI, Payment, Storage, Email, SMS, Push, Maps, Video, File, Search), use that specific `CREATE_*_PROVIDER.md` playbook instead; this one is for integrations that don't fit an existing category (CRM sync, ERP sync, shipping, tax, accounting — see [docs/18_REFERENCE/INDEX.md](../18_REFERENCE/INDEX.md) Provider Registry planned categories).

## Workflow (delta)
1. Register in the Provider Registry once it exists ([.ai/07_INTEGRATIONS.md](../../.ai/07_INTEGRATIONS.md)) rather than a bespoke config table.
2. Server-only credentials, same security bar as every other provider category ([docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)).
3. If the integration is genuinely novel enough to need its own category, propose adding it to [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)'s category list rather than leaving it uncategorized.

## Definition of Done
Generic DoD.
