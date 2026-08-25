---
title: Create Public Website Feature
---
# CREATE_PUBLIC_WEBSITE_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md).

## Purpose
Add a feature to the unauthenticated public surface (beyond a single CMS page — see [CREATE_CMS_PAGE.md](CREATE_CMS_PAGE.md) for that simpler case).

## Workflow (delta)
1. Route under the public segment (no `RequireAuth`) in `src/router.tsx`.
2. Follow [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md)'s phased plan for anything beyond a static page (SEO, analytics, lead capture).
3. No secrets/tenant data should ever be reachable from this segment — treat it as a hostile-network-exposed surface.

## Definition of Done
Generic DoD, plus: verified no authenticated-only data leaks through this route when accessed logged out.
