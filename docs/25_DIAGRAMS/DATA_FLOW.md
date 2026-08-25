---
title: Tenant Data Flow Diagram
last_updated: 2026-08-25
---

# Tenant Isolation Data Flow

Derived from [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md), 2026-08-25.

```mermaid
flowchart LR
  User["Authenticated user"] --> Client["React app (module api.ts)"]
  Client -->|"select"| RLS1["RLS: org_id in (select current_org_ids())"]
  Client -->|"insert/update/delete"| RLS2["RLS: has_permission(org_id, 'module.action')"]
  RLS1 --> Table["Tenant table (e.g. products, orders)"]
  RLS2 --> Table

  PlatformAdmin["Platform admin user"] --> RPC["security definer RPC"]
  RPC --> Check["is_platform_admin(auth.uid()) check"]
  Check -->|"pass"| CrossTenant["Cross-tenant read/write"]
  Check -->|"fail"| Reject["Rejected"]
```

No path exists (and none should ever exist) from a normal tenant-scoped client call to cross-tenant data — the only bypass is the explicit, audited `security definer` RPC layer.
