---
title: Page Template
---
# PAGE_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_PAGE.md](../16_PLAYBOOKS/CREATE_PAGE.md).

```tsx
// src/pages/<Name>Page.tsx
import { <Name>Overview } from "@/modules/<name>/components/<Name>Overview";

export default function <Name>Page() {
  return <<Name>Overview />;
}
```

Router registration in `src/router.tsx`:
```tsx
{
  path: "<name>",
  lazy: () => import("../pages/<Name>Page"),
}
```
