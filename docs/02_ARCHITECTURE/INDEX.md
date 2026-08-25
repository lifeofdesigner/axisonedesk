---
title: Architecture
last_updated: 2026-08-25
---

# 02_ARCHITECTURE

## Relationship to root `ARCHITECTURE.md`

The repo root has an `ARCHITECTURE.md` (41KB, "Status: Approved", dated 2026-08-21). It is a **pre-build design document** — code was meant to follow it, and mostly does, but it also describes things not yet built (a client-side RBAC library, `stripe-webhook`/`ai-assistant` Edge Functions). This ADOS section describes **what's actually built**, verified against source, and flags where it diverges from the root doc.

## Stack

- **Frontend**: React 19.2.8 + React Router 7.18.2 (`createBrowserRouter`, lazy route modules), TypeScript ~6.0.2, Vite 8.2.0.
- **Styling**: Tailwind CSS v4, shadcn/ui (`components.json`).
- **Data layer**: `@supabase/supabase-js` 2.112.3 (Postgres + Auth + Storage), TanStack Query 5.101.4, TanStack Table 8.21.3.
- **Forms**: react-hook-form + zod.
- **Other**: recharts (charts), framer-motion, sonner (toasts), cmdk, next-themes, date-fns, react-barcode.
- **Package manager**: pnpm.
- **Deploy target**: Vercel (`vercel.json` — SPA rewrite only, no build customization).

This is a **single app, not a monorepo** — no `apps/`/`packages/` workspace split.

## Repo structure

```
src/core/       cross-cutting: audit, auth, cms, error, feature-flags, notifications,
                platform-admin, platform-settings, query, rbac (EMPTY), supabase, support, tenant
src/modules/    ai-assistant, billing, bookings, cms, crm, dashboard, hr-staff,
                inventory, orders, platform-admin, pos (unrouted), purchasing, reports, settings
src/pages/      47 thin route-level files, one per route
src/shared/     components/{ui,forms,layout,data}, hooks, lib, types
src/styles/
src/router.tsx  single createBrowserRouter definition
supabase/       migrations/ (25 files), functions/ (empty except _shared/), config.toml
```

Module pattern: `src/modules/<name>/api.ts` (typed Supabase calls) + `hooks.ts` (TanStack Query) + components. Platform-admin modules live under `src/core/platform-admin/` instead (24 files: `<area>-api.ts` + `<area>-hooks.ts` pairs).

## Three route segments (`src/router.tsx`)

1. **Public**: `/pages/:slug` (CMS-rendered), unauthenticated.
2. **Pre-auth**: `/login`, `/signup`, `/forgot-password` (`RedirectIfAuthed` guard), `/onboarding` (`RequireAuth` only, pre-org).
3. **Tenant Application**: gated `RequireAuth` → `RequireOrg` → `AppShell`. Routes: `/`, `/inventory*`, `/orders*`, `/crm*`, `/bookings`, `/purchasing*`, `/hr-staff`, `/reports`, `/billing`, `/ai-assistant`, `/settings*`. Each module subtree additionally gated by `RequireModuleEnabled moduleKey="..."`.
4. **Platform Owner Portal**: gated `RequireAuth` → `RequirePlatformAdmin` → `PlatformAdminShell`. Routes: `/platform-admin`, `/platform-admin/tenants[,/:orgId]`, `/audit-log`, `/feature-flags`, `/branding`, `/subscriptions`, `/users`, `/roles`, `/tickets[,/:ticketId]`, `/media`, `/notifications`, `/ai-providers`, `/system-health`, `/security`, `/developer-tools`, `/cms`.

## Auth & authorization

- Auth: Supabase Auth via `src/core/auth/AuthProvider.tsx` + `RequireAuth.tsx` (also defines `RequireOrg`, `RequirePlatformAdmin`, `RedirectIfAuthed`).
- Active org resolution: `src/core/tenant/OrganizationProvider.tsx`, from the user's `organization_members` rows — no hardcoded demo org.
- Platform-admin check: `useIsPlatformAdmin` in `src/core/platform-admin/hooks.ts`.
- **RBAC**: data model is SQL-side only (`roles`, `permissions`, `role_permissions`, `organization_members`, `has_permission(org_id, key)` function). `src/core/rbac/` (the planned client-side `usePermission`/`<Can>` layer) is **empty** — not built. Module-level gating (`RequireModuleEnabled`) is feature-flag-based, not RBAC-based.

## Multi-tenancy

Tenant = `organizations` row. Isolation via RLS: `current_org_ids()` SQL function (via `organization_members`) scopes `select`; `has_permission(org_id, key)` scopes writes. Platform-admin cross-tenant access uses separate `security definer` RPCs gated by `is_platform_admin(auth.uid())`, not relaxed RLS. See [03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md).

## What's designed but not built

- Client-side RBAC library (`src/core/rbac/`).
- Supabase Edge Functions (`supabase/functions/` has only an empty `_shared/`) — no `stripe-webhook`, no `ai-assistant` function.
- Industry Module Engine, Module Registry, Workspace/Collaboration — see `.ai/` playbooks.
