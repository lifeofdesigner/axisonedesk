---
title: Role Template
---
# ROLE_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_ROLE.md](../16_PLAYBOOKS/CREATE_ROLE.md). Custom roles are created via RPC, not raw SQL insert:

```ts
await supabase.rpc("platform_create_role", {
  p_org_id: orgId,
  p_name: "<Role Name>",
  p_permission_ids: [/* permission uuids from platform_list_permissions() */],
});
```
