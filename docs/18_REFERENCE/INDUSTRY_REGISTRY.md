---
title: Industry Registry
last_updated: 2026-08-25
---

# Industry Registry

**Schema written, not yet applied to a live database.** `supabase/migrations/0027_industry_registry.sql` (Industry Engine Phase 2) creates `organization_types` + `organization_type_modules`, seeded with the 14-industry **system-default template set** (Manufacturing through Custom, below) and module-default mappings for the 9 of those with a researched proposal. The other 15 in the broader target list (Law Firm, Church, NGO, School, Gym, Car Dealership, Real Estate, Government, Insurance, Travel Agency, Veterinary, Beauty & Salon, Fitness, Media, Non-Profit) are **not seeded** — they're the "Platform Owner creates entirely new types without code changes" category, meant to be added later through the registry itself once a Platform Owner Portal UI exists (Phase 4), not pre-seeded speculatively. Same not-applied status as `0026_module_registry.sql` — see [MODULE_REGISTRY.md](MODULE_REGISTRY.md) for why (no CLI-authenticated DB access in this environment). `organizations` was **not** modified — no org can actually be assigned a type yet; that's Phase 3 (onboarding). `src/core/industries/{api.ts,hooks.ts}` provide the read/write layer once the migration is applied.

Every tenant still gets the identical generic module set and dashboard today regardless of this schema existing — nothing reads it yet.

## Full target industry list (29) vs. what's seeded (14)

**Seeded in `0027_industry_registry.sql`**: Manufacturing, Retail, Wholesale, Restaurant, Hotel, Construction, Healthcare, Pharmacy, Logistics, Agriculture, Education, Professional Services, E-commerce, Custom.

**Not seeded — future Platform Owner-created types, per the Organization Type Library design**: Law Firm, Church, NGO, School, Gym, Car Dealership, Real Estate, Government, Insurance, Travel Agency, Veterinary, Beauty & Salon, Fitness, Media, Non-Profit.

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
