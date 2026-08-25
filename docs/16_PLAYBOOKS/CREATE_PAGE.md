---
title: Create Page
---
# CREATE_PAGE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/PAGE_TEMPLATE.md](../17_TEMPLATES/PAGE_TEMPLATE.md).

## Purpose
Add a new route-level page — the thin `src/pages/*.tsx` layer that composes a module's components.

## Workflow (delta)
1. `src/pages/<Name>Page.tsx` — thin, a lazy-imported composition of module components, not where business logic lives (see any existing page file, e.g. `src/pages/DashboardPage.tsx`, for the established thinness).
2. Register in `src/router.tsx` as a lazy route, under the correct guard subtree (tenant app vs. platform admin vs. public — see [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)'s route segment breakdown).
3. Add module gating (`RequireModuleEnabled`) if it belongs to a gated module.
4. Add to [docs/18_REFERENCE/ROUTE_REGISTRY.md](../18_REFERENCE/ROUTE_REGISTRY.md).

## Definition of Done
Generic DoD, plus: route is reachable via direct URL entry (not just in-app navigation) — verifies the lazy-loading and guard chain work standalone.
