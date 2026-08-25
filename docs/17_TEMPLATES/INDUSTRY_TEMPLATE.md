---
title: Industry Template (spec, not yet implementable)
---
# INDUSTRY_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_INDUSTRY.md](../16_PLAYBOOKS/CREATE_INDUSTRY.md). **Not yet usable** — the underlying `organization_types` table doesn't exist (see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)). Shown here as the target shape so the schema, once built, matches this spec.

```yaml
key: restaurant
name: Restaurant
description: ...
icon: utensils
default_modules: [orders, inventory, crm, hr-staff, reports]
optional_modules: [purchasing, bookings]
hidden_modules: []
default_roles:
  - name: Owner   # always seeded, matches existing system role
  - name: Manager
    permissions: [orders.view, orders.edit, inventory.view]
dashboard_widgets: [daily-revenue, table-turnover, top-menu-items]
```
