---
title: Refactor Playbook
---
# REFACTOR_PLAYBOOK

## Purpose
Improve code structure without changing behavior.

## Prerequisites
A concrete reason (duplication found, a pattern that's become inconsistent across modules, a genuine maintainability problem) — not refactoring for its own sake. Per repo-wide guidance, don't introduce abstractions for hypothetical future needs.

## Required Documentation
[docs/15_DEVELOPER/INDEX.md](../15_DEVELOPER/INDEX.md) coding standards; [docs/22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md](../22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md).

## Audit Steps
Confirm behavior before refactoring (manual exercise of the affected feature) so you can confirm it's unchanged after.

## Implementation Workflow
Smallest coherent change that achieves the structural improvement. If touching a pattern used across multiple modules (e.g. the `api.ts`/`hooks.ts` convention), update [docs/23_EXAMPLES/INDEX.md](../23_EXAMPLES/INDEX.md) if the reference example changes.

## Validation
Behavior is unchanged — same inputs produce the same outputs/UI. `pnpm build` + `pnpm lint` pass.

## Testing
If tests exist for the area, they must still pass unmodified (a refactor that requires rewriting tests to pass is usually a behavior change in disguise — investigate).

## Documentation Updates
Update any doc describing the old structure.

## Definition of Done
[docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md).

## Commit Requirements
Separate refactor commits from behavior-changing commits — never bundle them, so a revert of one doesn't require reverting the other.
