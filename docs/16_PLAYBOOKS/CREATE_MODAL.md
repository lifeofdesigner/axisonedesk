---
title: Create Modal
---
# CREATE_MODAL

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a modal overlay for a focused task (e.g. `NewRoleDialog` in `src/modules/platform-admin/components/`).

## Workflow (delta)
1. Build on shadcn/ui's Dialog primitive (`src/shared/components/ui`) — see [CREATE_DIALOG.md](CREATE_DIALOG.md), which covers the same underlying primitive; "modal" here refers to task-focused overlays (often containing a form) as opposed to simple confirm/alert dialogs.
2. Co-locate with the module that uses it (`src/modules/<name>/components/`), not in `src/shared/` unless genuinely reused across modules.
3. Manage open/close state locally in the parent, not via global state, unless multiple distant components need to trigger it.

## Definition of Done
Generic DoD, plus: keyboard-dismissible (Esc) and focus-trapped, per shadcn/ui's Dialog defaults — don't override that behavior without reason.
