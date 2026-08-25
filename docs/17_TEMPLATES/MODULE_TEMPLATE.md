---
title: Module Template
---
# MODULE_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_MODULE.md](../16_PLAYBOOKS/CREATE_MODULE.md). Structure mirrors `src/modules/inventory/`.

```
src/modules/<name>/
  api.ts          # typed Supabase calls — see API_TEMPLATE.md
  hooks.ts        # TanStack Query hooks — see HOOK_TEMPLATE.md
  components/
    <Name>Table.tsx
    <Name>Form.tsx
src/pages/
  <Name>Page.tsx  # see PAGE_TEMPLATE.md
```

Router registration (`src/router.tsx`):
```tsx
{
  path: "<name>",
  lazy: () => import("../pages/<Name>Page"),
  element: <RequireModuleEnabled moduleKey="<name>" />,
}
```
