# AxisOneDesk

AI-powered Business OS for retail, hospitality, and service SMEs. See
[ARCHITECTURE.md](./ARCHITECTURE.md) for the full architecture and source of truth.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Supabase · React Router ·
TanStack Query/Table · Recharts · Framer Motion

## Getting started

```bash
pnpm install
cp .env.example .env   # fill in your Supabase project URL + anon key
pnpm dev
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format the codebase with Prettier |

## Database

Schema lives in `supabase/migrations`, applied in order:

- `0001_init.sql` — organizations, membership, RBAC primitives, profiles
- `0002_inventory.sql` — categories, suppliers, products, product images/variants,
  stock adjustments, and the inventory_transactions ledger (see ARCHITECTURE.md §4)

With the [Supabase CLI](https://supabase.com/docs/guides/cli) linked to your project:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

After pushing, regenerate types so `src/core/supabase/database.types.ts` matches the live
schema exactly (it's checked in — never hand-edit it once this command has been run):

```bash
supabase gen types typescript --linked > src/core/supabase/database.types.ts
```

### Data layer

Every module's `api.ts` (e.g. `src/modules/inventory/api.ts`) talks to Supabase directly —
org-scoped, using `toAppError()` (`src/core/error/AppError.ts`) to normalize failures before
they reach the UI. Nothing in the app holds live business data in memory or mock arrays.

The active organization is resolved by `OrganizationProvider`
(`src/core/tenant/OrganizationProvider.tsx`) from the signed-in user's `organization_members`
rows — there is no hardcoded demo org. A user with zero memberships is routed to `/onboarding`
by the `RequireOrg` guard.
