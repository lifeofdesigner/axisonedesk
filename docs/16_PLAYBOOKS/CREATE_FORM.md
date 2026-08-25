---
title: Create Form
---
# CREATE_FORM

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/FORM_TEMPLATE.md](../17_TEMPLATES/FORM_TEMPLATE.md).

## Purpose
Add a data-entry form using the established form stack.

## Workflow (delta)
1. react-hook-form + zod schema — this is the only form pattern used in the codebase, don't introduce an alternative.
2. Components from `src/shared/components/forms` and `src/shared/components/ui` (shadcn/ui-based) — don't hand-roll form controls.
3. Client-side zod validation is a UX convenience, not the security boundary — the real boundary is RLS/permission checks server-side (see [CREATE_RLS_POLICY.md](CREATE_RLS_POLICY.md)). Never rely on client validation alone for anything security-relevant.
4. Submit via a TanStack Query mutation hook (see [CREATE_HOOK.md](CREATE_HOOK.md)).

## Definition of Done
Generic DoD, plus: manually tested with invalid input (empty required fields, wrong types) to confirm validation messages appear correctly.
