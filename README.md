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

Schema lives in `supabase/migrations`. With the [Supabase CLI](https://supabase.com/docs/guides/cli)
linked to your project:

```bash
supabase db push
```
