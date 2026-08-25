---
title: Code Review Playbook
---
# CODE_REVIEW_PLAYBOOK

## Purpose
Consistent review standard for any change, human or AI-authored.

## Prerequisites
Reviewer (or self-review pass, in a single-contributor/AI-paired workflow) reads the actual diff, not just the description.

## Required Documentation
[21_GOVERNANCE/REVIEW_STANDARDS.md](../21_GOVERNANCE/REVIEW_STANDARDS.md), [docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md).

## Audit Steps
1. Does it do what it claims, and only that (no unrelated scope creep)?
2. Does it introduce a duplicate Source of Truth, duplicate table, duplicate API, or duplicate business logic?
3. Is RLS/permission checking correct for anything touching tenant data?
4. Are secrets handled per [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) if relevant?
5. Is documentation updated to match?

## Implementation Workflow
N/A — this playbook is itself the workflow for the review step, not for implementation.

## Validation
`pnpm build` + `pnpm lint` pass; the change was manually exercised, not just read.

## Testing
Confirm any existing tests for the touched area still pass.

## Documentation Updates
Confirm the author actually updated ADOS per [docs/00_ADOS/SESSION_END.md](../00_ADOS/SESSION_END.md) — this is a common thing to skip under time pressure, and the review is the check for it.

## Definition of Done
Reviewer confirms [docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md) is genuinely met, not just claimed.

## Commit Requirements
N/A.
