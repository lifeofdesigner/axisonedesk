---
title: Public Website Playbook
---

# 03 — Public Website

## Purpose
Guide building out the marketing/public website beyond today's minimal CMS page rendering.

## Business Objective
A credible public-facing site for acquisition (landing pages, pricing, docs) that converts visitors into signups.

## Scope
Landing pages, pricing page, blog, documentation portal, SEO, analytics, lead capture, CMS integration, performance, accessibility, i18n.

## Out of Scope
The tenant application and Platform Owner Portal (see other ADOS docs); paid marketing campaign execution (see [04_MARKETING.md](04_MARKETING.md)).

## Current Implementation
Verified 2026-08-25: `/pages/:slug` renders rows from the `cms_pages` table (`0025_cms.sql`), managed via the Platform Owner Portal's `/cms` section. This is the entire public surface today — no dedicated landing page templates, no blog, no docs portal, no SEO meta-tag system, no analytics (no GA/PostHog/etc. dependency in `package.json`), no lead-capture forms. See [docs/09_MARKETING/INDEX.md](../docs/09_MARKETING/INDEX.md).

## Architecture Dependencies
Builds on the existing `cms_pages` table and public route (`src/pages/PublicPageViewPage.tsx`) rather than introducing a second CMS.

## Required Documentation
Update [docs/09_MARKETING/INDEX.md](../docs/09_MARKETING/INDEX.md) as pieces ship.

## Required Database Changes
Likely additive fields on `cms_pages` (SEO meta title/description, OG image) rather than a new table; a `leads` table if lead capture is built server-side.

## Migration Strategy
Additive only, following existing migration numbering.

## Implementation Phases
1. SEO fundamentals on existing CMS pages (meta tags, sitemap, robots.txt).
2. Analytics provider wiring (pick one from [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Analytics Providers).
3. Dedicated marketing landing page templates (pricing, features) distinct from generic CMS pages.
4. Lead capture forms wired to CRM (`customers`/`deals` tables already exist — reuse, don't duplicate).
5. Blog / docs portal (only if product need justifies the investment).
6. i18n once the app targets non-English markets.

## Implementation Order
1 → 2 → 3, then 4-6 as product priority dictates.

## Testing Strategy
Manual QA against Lighthouse/axe for performance and accessibility once pages ship; no automated test suite exists yet project-wide.

## Rollback Strategy
Each page/feature is additive and independently removable via the CMS admin UI.

## Risks
Low — this track doesn't touch tenant data or auth.

## Definition of Done
Matches [docs/00_ADOS/DEFINITION_OF_DONE.md](../docs/00_ADOS/DEFINITION_OF_DONE.md).

## Future Enhancements
Headless CMS migration if `cms_pages` outgrows a single-table model; A/B testing infrastructure.

## References
[docs/09_MARKETING/INDEX.md](../docs/09_MARKETING/INDEX.md) · [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md)
