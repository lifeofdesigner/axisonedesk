---
title: Marketplace Playbook
---

# 08 — Marketplace

## Purpose
Guide for a future module marketplace (first/third-party module installation, partner apps).

## Business Objective
Let AxisOneDesk and eventually third parties extend the platform without core engineering involvement per add-on.

## Scope
Marketplace architecture, module installation flow, partner apps, billing for paid modules, licensing, version compatibility, module reviews, publishing workflow.

## Out of Scope
The Module Registry itself, which is a prerequisite built as part of [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) Phase 1 — the marketplace is a distribution layer on top of that registry, not a replacement for it.

## Current Implementation: none
No marketplace concept exists. This is explicitly the furthest-out item in [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md), marked Deferred.

## Architecture Dependencies
Hard dependency on the Module Registry (`02_INDUSTRY_ENGINE.md` Phase 1) existing and being stable — a marketplace without a registry has nothing to list.

## Required Documentation
New `docs/` allocation when this starts.

## Required Database Changes
`marketplace_listings`, `marketplace_installations` (org_id, module_key, installed_version, installed_at), version compatibility metadata on the Module Registry itself.

## Migration Strategy
Additive, and only after the Module Registry has been in production use long enough to trust its schema.

## Implementation Phases
1. Internal-only "marketplace" UI that just lists AxisOneDesk's own modules from the registry with install/enable toggles — proves the concept without third-party risk.
2. Versioning + compatibility checks.
3. Paid module billing (depends on [07_INTEGRATIONS.md](07_INTEGRATIONS.md) payment provider work).
4. Third-party publishing workflow + review process — highest trust/security bar, do last.

## Implementation Order
1 → 2 → 3 → 4, with 4 requiring a dedicated security review before any external code execution is allowed in a multi-tenant environment.

## Testing Strategy
Not applicable yet — planning-stage only.

## Rollback Strategy
N/A yet.

## Risks
Third-party module code running in a multi-tenant environment is a significant security surface — do not underscope the review needed for Phase 4.

## Definition of Done
Not applicable until Phase 1 scope is committed.

## Future Enhancements
Revenue share model for third-party developers.

## References
[02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) · [docs/00_ADOS/ROADMAP.md](../docs/00_ADOS/ROADMAP.md)
