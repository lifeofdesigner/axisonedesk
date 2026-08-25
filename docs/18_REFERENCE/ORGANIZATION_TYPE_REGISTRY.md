---
title: Organization Type Registry
last_updated: 2026-08-25
---

# Organization Type Registry

**Schema written (`organization_types` + `organization_type_modules`, `supabase/migrations/0027_industry_registry.sql`), not yet applied to a live database** — see [INDUSTRY_REGISTRY.md](INDUSTRY_REGISTRY.md) for full status. "Organization Type" and "Industry" share the same table — this registry is not a separate system. 14 system-default types are seeded; the Platform Owner Portal UI for creating additional types without code changes doesn't exist yet (Phase 4).

## Key design requirement
Adding a genuinely new organization type (one not in the initial 29) must require **zero application code changes** — only Platform Owner Portal configuration, once the Industry Engine exists. If that's not true in the actual implementation, it's a design defect against this requirement, not an acceptable shortcut.

## References
[.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) · [INDUSTRY_REGISTRY.md](INDUSTRY_REGISTRY.md) · [16_PLAYBOOKS/CREATE_ORGANIZATION_TYPE.md](../16_PLAYBOOKS/CREATE_ORGANIZATION_TYPE.md) · [17_TEMPLATES/ORGANIZATION_TEMPLATE.md](../17_TEMPLATES/ORGANIZATION_TEMPLATE.md)
