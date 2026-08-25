---
title: Bug Fix Playbook
---
# BUG_FIX_PLAYBOOK

## Purpose
Fix a defect without introducing scope creep or regressions.

## Prerequisites
Reproduce the bug first — don't fix based on a report alone. If you can't reproduce it, say so rather than guessing at a fix.

## Required Documentation
The ADOS doc for the affected area (e.g. [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md) for a module bug).

## Audit Steps
1. Reproduce.
2. Find root cause — not just the symptom (e.g. a missing RLS policy, not just "add a client-side filter to hide it").
3. Check [docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md) — is this already tracked?

## Implementation Workflow
Fix the root cause with the smallest correct change. Per repo-wide guidance: don't add unrelated cleanup, refactoring, or defensive code for scenarios that can't happen alongside a bug fix — that's a separate [REFACTOR_PLAYBOOK.md](REFACTOR_PLAYBOOK.md) task.

## Validation
Confirm the original repro no longer reproduces. Check for the same bug pattern elsewhere in the codebase (if it's a systemic issue, e.g. a missing RLS policy pattern, check other tables too).

## Testing
Add a regression test if a test suite exists for this area by the time you're fixing this; otherwise note the gap.

## Documentation Updates
Remove from [docs/00_ADOS/KNOWN_ISSUES.md](../00_ADOS/KNOWN_ISSUES.md) if it was tracked there; add a [docs/00_ADOS/CHANGELOG.md](../00_ADOS/CHANGELOG.md) entry.

## Definition of Done
[docs/00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md).

## Commit Requirements
Commit message states the bug and root cause, not just "fix bug."
