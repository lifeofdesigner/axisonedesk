---
title: Create CMS Component
---
# CREATE_CMS_COMPONENT

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a reusable content block/component the CMS page editor can compose (e.g. a pricing table block, an FAQ accordion).

## Current state
`cms_pages` (`0025_cms.sql`) is a single-content-field page model as of 2026-08-25 — verify whether a block/component system exists in the actual editor UI before assuming one does; if `cms_pages` stores a single body field, "components" today means React components used *inside* `PublicPageViewPage.tsx`'s rendering, not a user-composable block system.

## Workflow (delta)
1. If adding a rendering component: place in `src/modules/cms/components/` (or `src/shared/components` if genuinely reusable outside CMS), consumed by `PublicPageViewPage.tsx`.
2. A true composable block-editor system is a larger feature — if that's the actual need, scope it as its own initiative rather than a single "component," and check [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md) first.

## Definition of Done
Generic DoD.
