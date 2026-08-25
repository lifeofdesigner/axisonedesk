---
title: Performance Playbook
---
# PERFORMANCE_PLAYBOOK

## Purpose
Improve a measured performance problem — see [.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md) for the broader strategy this playbook operationalizes per-incident.

## Prerequisites
A measurement, not a guess — profile before optimizing (per repo-wide guidance against premature optimization).

## Required Documentation
[.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md).

## Audit Steps
1. Measure current performance (build size via `vite build` output, query timing, render timing).
2. Identify the actual bottleneck — not the first suspicious-looking code.

## Implementation Workflow
Targeted fix (index, memoization, virtualization, code-split) matching the measured bottleneck. No speculative optimization of unmeasured code paths.

## Validation
Re-measure — confirm the specific metric improved.

## Testing
Confirm no functional regression from the optimization (e.g. memoization introducing stale data).

## Documentation Updates
[.ai/09_PERFORMANCE.md](../../.ai/09_PERFORMANCE.md) if the fix reveals a systemic pattern worth generalizing.

## Definition of Done
[docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md), plus the specific metric is documented as before/after in the commit message.

## Commit Requirements
Include the before/after measurement in the commit message.
