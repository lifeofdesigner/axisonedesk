---
title: Feature Flag Template
---
# FEATURE_FLAG_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_FEATURE_FLAG.md](../16_PLAYBOOKS/CREATE_FEATURE_FLAG.md).

```sql
insert into public.feature_flags (key, label, default_enabled)
values ('<module-key>', '<Human Label>', false);
```

Consume in a route:
```tsx
<Route element={<RequireModuleEnabled moduleKey="<module-key>" />}>
  ...
</Route>
```
