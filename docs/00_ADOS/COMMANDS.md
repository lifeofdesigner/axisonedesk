---
title: Commands Reference
---

# Commands

All verified against `package.json`. Package manager is **pnpm** (`pnpm-lock.yaml` present).

| Command | Purpose |
|---|---|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | `tsc -b && vite build` — typecheck + production build |
| `pnpm lint` | ESLint (flat config, typescript-eslint) |
| `pnpm format` | Prettier (with `prettier-plugin-tailwindcss`) |
| `pnpm preview` | Preview the production build locally |
| `pnpm admin-tool` | Runs `scripts/admin-tool/server.mjs` |

## Supabase

| Command | Purpose |
|---|---|
| `supabase gen types typescript --linked` | Regenerate `src/core/supabase/database.types.ts` after any migration change — this file is committed, not gitignored |
| Migrations live in `supabase/migrations/*.sql`, applied via the Supabase CLI against the linked project (`supabase/config.toml`, `supabase/.temp/`) | |

## Testing

None configured yet — no test runner in `package.json`. See [11_TESTING/INDEX.md](../11_TESTING/INDEX.md) before assuming a `pnpm test` command exists.

## CI

None exists (no `.github/workflows`). See [12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md).
