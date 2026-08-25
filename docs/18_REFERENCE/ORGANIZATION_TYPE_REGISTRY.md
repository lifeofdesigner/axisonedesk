---
title: Organization Type Registry (spec — not yet implemented)
last_updated: 2026-08-25
---

# Organization Type Registry

**Does not exist.** Per [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md), "Organization Type" and "Industry" share the same proposed `organization_types` table — this registry is not a separate system, it's the same one, viewed as "the full configurable list including types beyond the initial shipped set." See [INDUSTRY_REGISTRY.md](INDUSTRY_REGISTRY.md) for the initial 29-item target list.

## Key design requirement
Adding a genuinely new organization type (one not in the initial 29) must require **zero application code changes** — only Platform Owner Portal configuration, once the Industry Engine exists. If that's not true in the actual implementation, it's a design defect against this requirement, not an acceptable shortcut.

## References
[.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) · [INDUSTRY_REGISTRY.md](INDUSTRY_REGISTRY.md) · [16_PLAYBOOKS/CREATE_ORGANIZATION_TYPE.md](../16_PLAYBOOKS/CREATE_ORGANIZATION_TYPE.md) · [17_TEMPLATES/ORGANIZATION_TEMPLATE.md](../17_TEMPLATES/ORGANIZATION_TEMPLATE.md)
