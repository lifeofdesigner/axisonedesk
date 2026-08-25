---
title: Developer Handbook
last_updated: 2026-08-25
---

# 15_DEVELOPER

## Folder structure

See [02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md) for the full `src/` layout. Summary: `src/core/` (cross-cutting concerns), `src/modules/<name>/{api.ts,hooks.ts,components}` (feature modules), `src/pages/` (thin route files), `src/shared/` (reusable UI/hooks/lib/types), `src/router.tsx` (single route tree).

## Coding standards (as observed, not separately documented elsewhere in the repo)

- TypeScript throughout, `tsc -b` must pass before merge.
- ESLint flat config (`eslint.config.js`) + Prettier (`.prettierrc`, with `prettier-plugin-tailwindcss` for class sorting).
- Data fetching via TanStack Query hooks wrapping typed Supabase calls — never raw `fetch` to Supabase REST directly from components.
- Forms via react-hook-form + zod schemas.
- Tenant tables always get RLS using `current_org_ids()`/`has_permission()` — no client-side-only tenant filtering.
- Multi-table writes needing atomicity go through Postgres RPCs, not client-orchestrated sequences (ADR-001 in [00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md)).

## Contribution workflow

See [00_ADOS/WORKFLOW.md](../00_ADOS/WORKFLOW.md) and [00_ADOS/DEFINITION_OF_DONE.md](../00_ADOS/DEFINITION_OF_DONE.md).

## Commands

See [00_ADOS/COMMANDS.md](../00_ADOS/COMMANDS.md).

## Environment variables

Only two exist today (`.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — both public/client-safe, protected by RLS. No server-only secrets exist yet; see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) for how future provider credentials must be handled (never client-side).

## ADR log

[00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md).
