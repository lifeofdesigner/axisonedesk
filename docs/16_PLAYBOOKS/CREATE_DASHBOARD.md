---
title: Create Dashboard
---
# CREATE_DASHBOARD

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/DASHBOARD_TEMPLATE.md](../17_TEMPLATES/DASHBOARD_TEMPLATE.md).

## Purpose
Add or extend a dashboard view composed of widgets (see [CREATE_WIDGET.md](CREATE_WIDGET.md)).

## Current state
One generic tenant Dashboard exists (`src/modules/dashboard`), same for every org. Per-industry dashboards are **planned, not built** — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 4. Don't hardcode industry-specific dashboard branching into the existing generic dashboard; that's explicitly the job of the future registry-driven system.

## Workflow (delta)
1. Compose from existing widgets where possible; only build a new widget if genuinely needed (see [CREATE_WIDGET.md](CREATE_WIDGET.md)).
2. Layout via existing grid/flex patterns in `src/shared/components/layout` — don't introduce a new layout system.

## Definition of Done
Generic DoD.
