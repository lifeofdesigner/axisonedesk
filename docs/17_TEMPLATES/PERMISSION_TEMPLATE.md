---
title: Permission Template
---
# PERMISSION_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_PERMISSION.md](../16_PLAYBOOKS/CREATE_PERMISSION.md). Naming: `<module_key>.<action>` (see [docs/18_REFERENCE/PERMISSIONS_MATRIX.md](../18_REFERENCE/PERMISSIONS_MATRIX.md) for the real existing set).

```sql
insert into public.permissions (module_key, key, label)
values ('<module>', '<module>.<action>', '<Human-readable label>');
```

Consume in RLS:
```sql
using (public.has_permission(org_id, '<module>.<action>'))
```
