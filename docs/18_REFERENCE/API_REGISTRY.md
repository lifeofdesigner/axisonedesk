---
title: API Registry
last_updated: 2026-08-25
---

# API Registry

AxisOneDesk has no custom REST/GraphQL API layer — data access is via Supabase's auto-generated PostgREST (through `@supabase/supabase-js`) plus the RPCs listed in [RPC_REGISTRY.md](RPC_REGISTRY.md), per the explicit design note in `0024_developer_tools.sql`. "API" in this codebase means each module's `api.ts` file (typed PostgREST wrapper functions), not a separate API server.

| Module | `api.ts` location |
|---|---|
| Inventory | `src/modules/inventory/api.ts` |
| Orders | `src/modules/orders/api.ts` |
| CRM | `src/modules/crm/api.ts` |
| Bookings | `src/modules/bookings/api.ts` |
| Purchasing | `src/modules/purchasing/api.ts` |
| HR & Staff | `src/modules/hr-staff/api.ts` |
| Billing | `src/modules/billing/api.ts` |
| AI Assistant | `src/modules/ai-assistant/api.ts` |
| Platform Admin (all 13 sections) | `src/core/platform-admin/<area>-api.ts` (24 files, api+hooks pairs) |
| Module Registry (metadata, see [MODULE_REGISTRY.md](MODULE_REGISTRY.md)) | `src/core/modules/api.ts` — live |
| Industry / Organization Type Registry (see [INDUSTRY_REGISTRY.md](INDUSTRY_REGISTRY.md)) | `src/core/industries/api.ts` — live |

## References
[16_PLAYBOOKS/CREATE_API.md](../16_PLAYBOOKS/CREATE_API.md) · [RPC_REGISTRY.md](RPC_REGISTRY.md)
