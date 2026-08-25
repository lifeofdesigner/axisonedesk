---
title: Marketing & Public Website
last_updated: 2026-08-25
---

# 09_MARKETING

## Current state

Public surface is CMS-driven: `/pages/:slug` (`src/pages/PublicPageViewPage.tsx`) renders rows from the `cms_pages` table (`0025_cms.sql`), managed via the Platform Owner Portal's CMS section (`/cms`). This covers legal/help/marketing static pages. Auth pages (`/login`, `/signup`, `/forgot-password`) are separate, gated by `RedirectIfAuthed`.

`marketing-assets/` at repo root (untracked in git as of 2026-08-25) contains screenshots, videos, and shot scripts for external marketing use — not application code, not part of the deployed app.

## Not implemented

No dedicated marketing landing pages beyond CMS pages, no blog, no SEO tooling, no analytics integration (see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Analytics Providers — none wired), no lead capture forms, no documentation portal, no i18n. Implementation guidance for building these out: [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md) and [.ai/04_MARKETING.md](../../.ai/04_MARKETING.md).
