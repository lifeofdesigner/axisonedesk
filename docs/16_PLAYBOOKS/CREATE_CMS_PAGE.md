---
title: Create CMS Page
---
# CREATE_CMS_PAGE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a public page (legal, help, marketing) via the CMS.

## Workflow (delta)
1. Use the Platform Owner Portal's CMS section (`/cms`), backed by `platform_upsert_cms_page(...)` (`0025_cms.sql`) — don't add a static route for content that belongs in the CMS.
2. Page becomes reachable at `/pages/:slug` automatically via `PublicPageViewPage.tsx` — no router change needed.
3. See [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md) for SEO metadata considerations (not yet built into `cms_pages`).

## Definition of Done
Generic DoD, plus: page renders correctly unauthenticated (verify in an incognito/logged-out browser session).
