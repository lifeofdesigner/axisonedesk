---
title: Dashboard Template
---
# DASHBOARD_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_DASHBOARD.md](../16_PLAYBOOKS/CREATE_DASHBOARD.md).

```tsx
export function <Name>Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* widgets — see WIDGET pattern in CREATE_WIDGET.md */}
    </div>
  );
}
```

Handle the empty-state case explicitly (new org, zero data) — don't assume seeded data.
