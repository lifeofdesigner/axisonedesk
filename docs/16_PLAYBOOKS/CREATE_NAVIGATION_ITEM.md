---
title: Create Navigation Item
---
# CREATE_NAVIGATION_ITEM

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add an item to `AppShell` or `PlatformAdminShell` navigation.

## Current state
Navigation is hardcoded in the shell components today — there's no Navigation Registry yet (see [docs/18_REFERENCE/MODULE_REGISTRY.md](../18_REFERENCE/MODULE_REGISTRY.md), Planned). Once the Module Registry (see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) Phase 1 and 4) exists, navigation should generate from it instead — don't add more hardcoded nav branching in the meantime than necessary.

## Workflow (delta)
1. Add the item to the relevant shell component, matching existing icon/label conventions (lucide icons, per `createLucideIcon` usage across the codebase).
2. Gate visibility by module-enabled status (`RequireModuleEnabled`'s underlying flag check) — a nav item should never be visible if its route would immediately redirect/error.
3. Respect existing ordering conventions in the shell rather than inserting arbitrarily.

## Definition of Done
Generic DoD.
