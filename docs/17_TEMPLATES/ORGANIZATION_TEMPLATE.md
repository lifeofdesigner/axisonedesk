---
title: Organization Template (spec, not yet implementable)
---
# ORGANIZATION_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_ORGANIZATION_TYPE.md](../16_PLAYBOOKS/CREATE_ORGANIZATION_TYPE.md). Same status as [INDUSTRY_TEMPLATE.md](INDUSTRY_TEMPLATE.md) — not yet buildable, shown as target shape.

```yaml
key: law-firm
name: Law Firm
description: ...
icon: gavel
default_modules: [crm, bookings, reports, billing]
default_roles:
  - name: Owner
  - name: Attorney
  - name: Paralegal
onboarding_fields_shown: [company_size, country, timezone]
```
