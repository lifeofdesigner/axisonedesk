---
title: API Standards
last_updated: 2026-08-25
---

# API Standards

AxisOneDesk has no custom REST/GraphQL API — see [docs/18_REFERENCE/API_REGISTRY.md](../18_REFERENCE/API_REGISTRY.md). "API" here means the `api.ts` convention.

- One function per operation, typed against `database.types.ts`.
- Never `any` for request/response shapes.
- Multi-table atomic writes go through an RPC (see [16_PLAYBOOKS/CREATE_SUPABASE_RPC.md](../16_PLAYBOOKS/CREATE_SUPABASE_RPC.md)), not sequenced client calls.
- Errors thrown, not silently swallowed — let TanStack Query's error state surface them to the UI.

## References
[16_PLAYBOOKS/CREATE_API.md](../16_PLAYBOOKS/CREATE_API.md) · [docs/18_REFERENCE/API_REGISTRY.md](../18_REFERENCE/API_REGISTRY.md)
