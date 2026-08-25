---
title: Feature Flag Registry
last_updated: 2026-08-25
---

# Feature Flag Registry

Two-table model from `0012_feature_flags.sql`: `feature_flags` (global default) + `org_feature_flags` (per-org override). Module keys currently gated in `src/router.tsx` via `RequireModuleEnabled` (see [ROUTE_REGISTRY.md](ROUTE_REGISTRY.md)):

`inventory` · `orders` · `crm` · `bookings` · `purchasing` · `hr-staff` · `reports` · `ai-assistant`

Managed via Platform Owner Portal `/feature-flags`, backed by `platform_set_flag_default`, `platform_set_org_flag_override`, `platform_clear_org_flag_override` (`0012_feature_flags.sql`).

Not module-gated: dashboard, billing, settings (always available to any org member).

## References
[16_PLAYBOOKS/CREATE_FEATURE_FLAG.md](../16_PLAYBOOKS/CREATE_FEATURE_FLAG.md) · [docs/18_REFERENCE/MODULE_REGISTRY.md](MODULE_REGISTRY.md)
