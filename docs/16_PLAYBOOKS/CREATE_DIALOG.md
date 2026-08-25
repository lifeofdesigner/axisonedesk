---
title: Create Dialog
---
# CREATE_DIALOG

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and shares its base primitive with [CREATE_MODAL.md](CREATE_MODAL.md) — this playbook covers simple confirm/alert dialogs specifically (e.g. "delete this item?").

## Purpose
Add a confirmation or alert dialog for a destructive or significant action.

## Workflow (delta)
1. shadcn/ui's AlertDialog primitive, not the general Dialog — semantically distinct (blocks until acknowledged/confirmed) and already used this way in `src/shared/components/ui`.
2. Any destructive action (delete, archive, revoke) must go through a confirm dialog — don't wire a destructive mutation directly to a button's `onClick`.
3. Loading/error state while the confirmed action is in flight — don't let the dialog close before the mutation resolves.

## Definition of Done
Generic DoD, plus: cancel path leaves state completely unchanged (verify no partial side effect occurs on cancel).
