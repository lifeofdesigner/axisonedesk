---
title: Create Layout
---
# CREATE_LAYOUT

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add a new shared layout wrapper (like `AppShell`, `PlatformAdminShell`, `SettingsLayout`) for a route subtree with common chrome.

## Workflow (delta)
1. Confirm an existing layout (`AppShell`, `PlatformAdminShell`, `SettingsLayout`) doesn't already fit — most new features nest under one of these rather than needing a new layout.
2. If genuinely new: place in `src/shared/components/layout/`, wire as a parent route in `src/router.tsx` with an `<Outlet />`.
3. Respect existing branding/theming (`next-themes`, platform branding settings) rather than hardcoding a new visual style.

## Definition of Done
Generic DoD.
