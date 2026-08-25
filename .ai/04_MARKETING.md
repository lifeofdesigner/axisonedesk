---
title: Marketing Playbook
---

# 04 — Marketing

## Purpose
Guide for content/campaign strategy execution on top of the public website track.

## Business Objective
Drive qualified signups and support industry-specific go-to-market once the Industry Module Engine exists.

## Scope
Content calendar strategy, CMS-driven campaign pages, lead nurture, industry-specific messaging once Organization Type Library exists.

## Out of Scope
Building the website mechanics themselves (see [03_PUBLIC_WEBSITE.md](03_PUBLIC_WEBSITE.md)).

## Current Implementation
No marketing automation, campaign tracking, or nurture sequence exists in the codebase. `marketing-assets/` at repo root (untracked as of 2026-08-25) holds screenshots/video/shot-script assets for external use — not application functionality.

## Architecture Dependencies
Depends on [03_PUBLIC_WEBSITE.md](03_PUBLIC_WEBSITE.md) for page infrastructure and eventually on the Industry Module Engine ([02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md)) for industry-specific landing pages/messaging.

## Required Documentation
[docs/09_MARKETING/INDEX.md](../docs/09_MARKETING/INDEX.md).

## Required Database Changes
None initially; a `leads`/`campaign_sources` table if attribution tracking is built.

## Migration Strategy
Additive.

## Implementation Phases
1. Basic UTM/source tracking on signup.
2. CMS-driven campaign landing pages (reuse `cms_pages`).
3. Industry-specific landing pages once Organization Type Library exists.
4. Email nurture (depends on a Communication Provider — see [07_INTEGRATIONS.md](07_INTEGRATIONS.md)).

## Implementation Order
1 → 2, then 3 (gated on Industry Engine) and 4 (gated on Provider Management) in parallel once their dependencies ship.

## Testing Strategy
Manual verification of tracking/attribution; no automated suite.

## Rollback Strategy
Campaign pages are CMS content — removable without code changes.

## Risks
Low.

## Definition of Done
Matches [docs/00_ADOS/DEFINITION_OF_DONE.md](../docs/00_ADOS/DEFINITION_OF_DONE.md).

## Future Enhancements
Marketing attribution dashboard in the Platform Owner Portal.

## References
[docs/09_MARKETING/INDEX.md](../docs/09_MARKETING/INDEX.md) · [02_INDUSTRY_ENGINE.md](02_INDUSTRY_ENGINE.md) · [07_INTEGRATIONS.md](07_INTEGRATIONS.md)
