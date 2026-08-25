---
title: Create Report
---
# CREATE_REPORT

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/REPORT_TEMPLATE.md](../17_TEMPLATES/REPORT_TEMPLATE.md).

## Purpose
Add a report to the Reports module (`src/modules/reports`, route `/reports`).

## Workflow (delta)
1. Data query scoped by `org_id` as always — reports are a common place to accidentally leak cross-tenant data via a careless aggregate query, so double-check the RLS/`current_org_ids()` scoping applies to whatever query the report runs.
2. Use `TanStack Table` for tabular reports (with virtualization for large result sets — see [.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md)) and `recharts` for visual reports.
3. Export functionality (CSV/PDF), if added, should not require a new dependency without checking if an existing one already covers it.

## Definition of Done
Generic DoD, plus: verified the report's query is org-scoped (see [CREATE_RLS_POLICY.md](CREATE_RLS_POLICY.md) validation approach).
