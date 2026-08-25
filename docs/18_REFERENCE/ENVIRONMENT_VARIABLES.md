---
title: Environment Variables
last_updated: 2026-08-25
---

# Environment Variables

Full list from `.env.example`, 2026-08-25:

| Variable | Client-safe? | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key — public by design, protected by RLS |

No server-only secrets exist yet — no provider has been integrated that requires one. When one is added, it must be set as a Supabase Edge Function secret (or equivalent server-only mechanism), never a `VITE_`-prefixed variable (those are bundled into the client build and are never secret). See [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Security Requirements.

## References
[docs/15_DEVELOPER/INDEX.md](../15_DEVELOPER/INDEX.md) · [16_PLAYBOOKS/CREATE_EDGE_FUNCTION.md](../16_PLAYBOOKS/CREATE_EDGE_FUNCTION.md)
