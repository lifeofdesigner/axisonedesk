---
title: Create Edge Function
---
# CREATE_EDGE_FUNCTION

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/EDGE_FUNCTION_TEMPLATE.md](../17_TEMPLATES/EDGE_FUNCTION_TEMPLATE.md).

## Purpose
Add server-mediated logic that must not run client-side — chiefly, anything requiring a secret (LLM API key, payment provider secret key, webhook signature verification).

## Current state
As of 2026-08-25, `supabase/functions/` has **no deployed functions** — only an empty `_shared/`. This will be the first real Edge Function in the repo; there's no existing example to copy, only ARCHITECTURE.md's design intent (§15) to follow.

## Workflow (delta)
1. `supabase/functions/<name>/index.ts`, shared helpers in `supabase/functions/_shared/`.
2. Secrets read from Supabase Edge Function environment/secrets store — **never** from a client-supplied value, never hardcoded.
3. Verify the caller's auth (JWT) and, for tenant-scoped functions, their org membership — the function does not automatically inherit RLS the way PostgREST does, so auth checks must be explicit.
4. Deploy via Supabase CLI.

## Documentation Updates (delta)
[docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)'s "designed but not built" section should be updated to move Edge Functions from that list once one ships.

## Definition of Done
Generic DoD, plus: manually confirmed the secret never appears in any client-side network request (check browser devtools network tab, not just the source code).
