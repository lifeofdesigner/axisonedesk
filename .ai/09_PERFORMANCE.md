---
title: Performance Playbook
---

# 09 — Performance

## Purpose
Guide for keeping the app fast as data volume and tenant count grow.

## Business Objective
Multi-tenant SaaS performance problems compound silently until they're customer-visible — get ahead of it.

## Scope
Caching, lazy loading, virtualization, database optimization, indexing, background jobs, realtime optimization, monitoring, scaling.

## Out of Scope
Feature-specific performance work already implicit in each module's own implementation.

## Current Implementation
- Lazy loading: `src/router.tsx` already lazy-loads route modules (React Router 7 data router pattern) — this is real and in place.
- TanStack Query provides client-side caching by default for all data fetching.
- TanStack Table is used for tabular data (`src/shared/components/data`), which has built-in virtualization support, but it's not confirmed whether virtualization is actually enabled for large lists — verify per-table before assuming.
- No background job system exists (no queue, no cron, no Supabase scheduled functions observed).
- No monitoring/APM exists (see [docs/00_ADOS/KNOWN_ISSUES.md](../docs/00_ADOS/KNOWN_ISSUES.md) — no Sentry, no analytics).
- No documented database indexing review has been done beyond whatever indexes migrations create implicitly (primary keys, foreign keys) — no explicit index-tuning pass found in migration comments.

## Architecture Dependencies
None blocking — this is cross-cutting hardening work applicable at any time.

## Required Documentation
New `docs/` allocation if this becomes an active track (not yet numbered).

## Required Database Changes
Likely additive indexes on frequently-filtered columns (`org_id` on every tenant table is the obvious first candidate — verify these exist already since RLS filters on it constantly).

## Migration Strategy
Additive index migrations; measure before adding (don't guess-optimize).

## Implementation Phases
1. Verify `org_id` (and other RLS-filter columns) are indexed on every tenant table — likely already true via FK constraints, but confirm rather than assume.
2. Confirm/enable virtualization on any table expected to render large tenant datasets (Inventory products, Orders).
3. Add basic monitoring (error tracking + slow-query logging) before optimizing blindly.
4. Background job system (Supabase scheduled functions or equivalent) once a real async-work need exists (e.g. digest notifications, scheduled reports).
5. Realtime scaling review once Workspace/Collaboration (see [05_WORKSPACE_COLLABORATION.md](05_WORKSPACE_COLLABORATION.md)) introduces sustained realtime load.

## Implementation Order
1 → 3 (measure first) → 2 → 4 → 5, driven by actual bottlenecks rather than speculative optimization.

## Testing Strategy
Load testing before any major scaling claim; no automated performance test suite exists.

## Rollback Strategy
Index additions are low-risk and reversible; caching changes should be feature-flaggable.

## Risks
Premature optimization without monitoring data to justify it — Phase 3 (monitoring) should come before most other phases despite being numbered later above, if resources allow doing it first.

## Definition of Done
Not applicable as a single checklist — this is an ongoing practice, not a one-time project.

## Future Enhancements
CDN for static assets, edge caching for public CMS pages.

## References
[docs/02_ARCHITECTURE/INDEX.md](../docs/02_ARCHITECTURE/INDEX.md) · [docs/03_DATABASE/INDEX.md](../docs/03_DATABASE/INDEX.md)
