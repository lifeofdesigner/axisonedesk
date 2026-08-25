---
title: Create Hook
---
# CREATE_HOOK

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/HOOK_TEMPLATE.md](../17_TEMPLATES/HOOK_TEMPLATE.md).

## Purpose
Add a TanStack Query hook wrapping an `api.ts` function — the `hooks.ts` half of the module pattern (see `src/modules/inventory/hooks.ts`).

## Workflow (delta)
1. `useQuery`/`useMutation` from TanStack Query, never raw `useEffect` + `useState` for server data — this is the established convention throughout the codebase.
2. Query keys scoped by org where relevant (avoid cache bleed between orgs when a user switches organizations).
3. Mutations invalidate the relevant query keys on success.
4. Reusable non-data hooks (UI state, not server data) → `src/shared/hooks/`.

## Definition of Done
Generic DoD, plus: verified cache invalidation actually refreshes the UI after a mutation (test manually, don't assume).
