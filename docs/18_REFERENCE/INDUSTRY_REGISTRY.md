---
title: Industry Registry (spec — not yet implemented)
last_updated: 2026-08-25
---

# Industry Registry

**Does not exist as a system.** Every tenant gets the identical generic module set and dashboard today — no industry concept exists anywhere in the schema or code. This document specifies the **target** industry list and proposed defaults for [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 2 to implement — it is a design proposal, not a record of built functionality. "Proposed" defaults below are starting points for product decisions, not commitments.

## Target industry list (29)

Manufacturing, Retail, Wholesale, Restaurant, Hotel, Construction, Healthcare, Pharmacy, Education, Agriculture, Logistics, Professional Services, E-commerce, Custom, Law Firm, Church, NGO, School, Gym, Car Dealership, Real Estate, Government, Insurance, Travel Agency, Veterinary, Beauty & Salon, Fitness, Media, Non-Profit.

## Per-industry definition (each needs, once built)

Enabled Modules, Optional Modules, Hidden Modules, KPIs, Dashboards, Navigation, AI Behaviour, Reports, Permissions, Default Roles, Onboarding, Branding, Feature Flags, Subscription Defaults.

## Proposed defaults for the first tier (highest-confidence mapping to existing modules)

| Industry | Proposed default modules (from today's actual 11 modules) | Proposed optional |
|---|---|---|
| Manufacturing | inventory, purchasing, orders, reports | hr-staff, bookings |
| Retail | inventory, orders, crm, reports | purchasing |
| Wholesale | inventory, orders, purchasing, crm, reports | — |
| Restaurant | orders, inventory, hr-staff, reports | bookings |
| Hotel | bookings, crm, reports | inventory |
| Construction | purchasing, hr-staff, reports | inventory, orders |
| Healthcare | bookings, crm, reports | — |
| Professional Services | crm, bookings, reports, billing | — |
| E-commerce | inventory, orders, crm, reports | purchasing |

For industries with no natural mapping to today's module set (Law Firm, Church, NGO, School, Gym, Car Dealership, Real Estate, Government, Insurance, Travel Agency, Veterinary, Beauty & Salon, Fitness, Media, Non-Profit, Pharmacy, Agriculture, Logistics), no default module proposal is given here — mapping these correctly requires product research into what those business types actually need, not a guess extrapolated from the current generic ERP module set. Do not fabricate a plausible-sounding default for these; do that research at implementation time.

## References
[.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) · [17_TEMPLATES/INDUSTRY_TEMPLATE.md](../17_TEMPLATES/INDUSTRY_TEMPLATE.md) · [16_PLAYBOOKS/CREATE_INDUSTRY.md](../16_PLAYBOOKS/CREATE_INDUSTRY.md) · [MODULE_REGISTRY.md](MODULE_REGISTRY.md)
