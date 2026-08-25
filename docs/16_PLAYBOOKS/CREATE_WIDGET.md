---
title: Create Widget
---
# CREATE_WIDGET

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a dashboard widget (stat tile, chart, list) — see [CREATE_DASHBOARD.md](CREATE_DASHBOARD.md) for placement.

## Workflow (delta)
1. Data via a dedicated hook (see [CREATE_HOOK.md](CREATE_HOOK.md)), not inline fetching in the widget component.
2. Charts use `recharts`, the only charting library in the dependency tree — don't add a second one.
3. Widget should degrade gracefully with zero data (new org, empty state) — this is a real case, not an edge case, since every new tenant starts empty.
4. If the widget is meant to vary by industry once the Industry Engine exists, don't hardcode that branching now — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 4.

## Definition of Done
Generic DoD, plus: verified with an empty-data org, not just a seeded one.
