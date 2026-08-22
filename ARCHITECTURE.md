# AxisOneDesk — Architecture & Source of Truth (SOT)

Status: **Approved**
Version: 0.1.0
Client: ************
Developer:Aderemy- CubaDev
Last updated: 2026-08-21

This document is the single source of truth for AxisOneDesk. No implementation code is written until this document is approved. Once approved, any deviation from this document during implementation requires updating this document first (SOT-first workflow) — the code follows the doc, not the other way around.

---

## 0. Product Summary

AxisOneDesk is a multi-tenant, AI-powered Business Operating System for SMEs — retail, fashion, supermarkets, restaurants, pharmacies, warehouses, logistics, hotels, schools, and general SMEs. One codebase, one database, many tenants (organizations), with per-vertical functionality delivered as configurable modules rather than forked apps.

Design priorities, in order: **security & tenant isolation → correctness → scalability → developer velocity → polish.**

---

## 1. Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| Build tool | Vite | Fast HMR, native ESM |
| Language | TypeScript (strict mode) | `strict: true`, no implicit any, no unchecked indexed access |
| UI framework | React 18+ | Function components + hooks only |
| Routing | React Router v6 (data router) | `createBrowserRouter`, lazy-loaded route modules |
| Styling | Tailwind CSS | Utility-first, design tokens via CSS variables |
| Component library | shadcn/ui (Radix primitives) | Copied into repo, not an npm dependency — we own and modify these |
| Server state | TanStack Query v5 | All Supabase reads/writes go through Query hooks |
| Table state | TanStack Table v8 | Server-side pagination/sort/filter for large datasets |
| Charts | Recharts | Dashboard/reporting visualizations |
| Motion | Framer Motion | Used sparingly: page transitions, modals, micro-interactions — never for core layout |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions, Realtime) | Single Supabase project per environment (dev/staging/prod) |
| Client-side global/local UI state | React Context + component state; Zustand only if a cross-cutting UI state need emerges (e.g. command palette, active tenant switcher) | Server state is never duplicated into a client store |
| Forms | React Hook Form + Zod | Zod schemas are the single validation source, shared between form and API boundary where feasible |
| Testing | Vitest + React Testing Library (unit/component), Playwright (e2e) | Introduced starting MVP phase 2 (see roadmap) |
| Linting/formatting | ESLint (typescript-eslint), Prettier | Enforced in CI and pre-commit hook |
| Package manager | pnpm | Faster installs, strict dependency resolution |
| Deployment (frontend) | Vercel or Cloudflare Pages (decision pending — see §19) | Static SPA build + edge-cacheable |
| Deployment (backend) | Supabase managed cloud | Migrations via Supabase CLI, versioned in repo |
| Error tracking | Sentry | Frontend + Edge Function error capture |
| Analytics | PostHog (self-hostable, supports feature flags too) | Product analytics + optional feature-flag overlap with §14 |

---

## 2. Folder Structure

Feature-based (vertical slice) architecture inside a single app, not layer-based. Each business capability owns its components, hooks, and API calls together; shared/generic code lives in `src/shared` and `src/core`.

```
axiondesk/
├── ARCHITECTURE.md                 # this document
├── README.md
├── .env.example
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json                 # shadcn/ui config
├── .eslintrc.cjs
├── .prettierrc
├── supabase/
│   ├── config.toml
│   ├── migrations/                 # timestamped SQL migrations (SOT for schema)
│   ├── functions/                  # Edge Functions (Deno)
│   │   ├── stripe-webhook/
│   │   ├── ai-assistant/
│   │   └── _shared/                # shared Edge Function utilities (cors, auth, supabase client)
│   └── seed.sql
├── public/
├── src/
│   ├── main.tsx                    # app entry
│   ├── App.tsx                     # root providers + router
│   ├── router.tsx                  # createBrowserRouter route tree
│   ├── core/                       # app-wide infrastructure, not feature-specific
│   │   ├── auth/                   # AuthProvider, session hooks, guards
│   │   ├── supabase/                # supabase client(s), generated types
│   │   ├── query/                  # QueryClient config, query key factory
│   │   ├── tenant/                 # active-org context, org switcher logic
│   │   ├── rbac/                   # permission definitions, usePermission hook, <Can>
│   │   ├── feature-flags/          # flag provider/hooks
│   │   ├── audit/                  # audit log client helpers
│   │   └── error/                  # ErrorBoundary, error reporting bridge
│   ├── shared/                     # reusable, business-agnostic building blocks
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui primitives (button, dialog, table, ...)
│   │   │   └── layout/             # AppShell, Sidebar, Topbar, PageHeader
│   │   ├── hooks/
│   │   ├── lib/                    # generic utils (formatting, date, currency)
│   │   └── types/
│   ├── modules/                    # one folder per business capability/vertical module
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── pos/
│   │   ├── orders/
│   │   ├── bookings/                # hotels, schools, appointment-style scheduling
│   │   ├── crm/
│   │   ├── hr-staff/
│   │   ├── purchasing/
│   │   ├── reports/
│   │   ├── billing/                 # subscription/plan management UI
│   │   ├── settings/
│   │   └── ai-assistant/
│   │       └── <module>/
│   │           ├── components/
│   │           ├── hooks/           # useXQuery, useXMutation (TanStack Query)
│   │           ├── api.ts           # typed Supabase calls for this module
│   │           ├── types.ts
│   │           ├── routes.tsx       # module's route subtree, lazy exported
│   │           └── permissions.ts   # module-specific RBAC actions
│   ├── pages/                       # thin route-level composition only (imports from modules)
│   └── styles/
│       └── globals.css              # Tailwind layers + CSS variable design tokens
├── tests/
│   ├── unit/
│   └── e2e/
└── scripts/                         # one-off ops scripts (migrations helpers, seed generators)
```

Rules:
- A module may depend on `core` and `shared`, never on another module directly. Cross-module data needs go through a documented API/service boundary (initially: direct Supabase queries scoped by RLS; later: internal service functions if complexity grows).
- `pages/` files are route glue only — no business logic, no direct Supabase calls.
- No default exports except for route-level page components (React Router convention).

---

## 3. Module Architecture

Modules are **feature-flagged and plan-gated units**, not separate apps. A given organization's enabled modules are determined by:

1. **Business type template** (e.g. "Restaurant" enables `pos`, `inventory`, `bookings`; "Hotel" enables `bookings`, `crm`, `hr-staff`) — a starting default set applied at org creation.
2. **Subscription plan** (§9) — caps which modules/features are available regardless of business type.
3. **Manual overrides** — an org admin (with permission) can enable/disable optional modules within their plan's allowance.

This resolves to an `enabled_modules: string[]` computed value per org (cached client-side via a query), which drives:
- Sidebar navigation rendering
- Route guarding (disabled module routes redirect to an upsell/empty state, never 404 silently)
- RBAC action availability

Module manifest convention — each module exports a `manifest.ts`:
```ts
export const inventoryModule: ModuleManifest = {
  key: "inventory",
  label: "Inventory",
  icon: PackageIcon,
  routes: inventoryRoutes,
  requiredPermission: "inventory.view",
  minPlan: "starter",
};
```
The core `core/tenant` layer aggregates manifests into the nav/router at boot.

---

## 4. Database Architecture

- Single Postgres database (Supabase-managed), single schema (`public`) for application tables, `auth` schema owned by Supabase Auth.
- **Every tenant-scoped table has a non-nullable `org_id uuid references organizations(id)`.**
- RLS is enabled on every tenant-scoped table with no exceptions; there is no "trusted" client path that bypasses RLS. Server-side privileged operations (e.g. Stripe webhook writes) go through Edge Functions using the `service_role` key, never exposed to the client.
- Primary keys: `uuid default gen_random_uuid()`.
- Timestamps: every table has `created_at timestamptz default now()` and `updated_at timestamptz default now()` maintained via a shared trigger function `set_updated_at()`.
- Soft deletes: tenant business records (products, customers, orders, etc.) use `deleted_at timestamptz null` rather than hard deletes, to preserve audit/history integrity. Hard deletes are reserved for genuinely transient data.
- Migrations are the only way schema changes happen — no manual dashboard edits in staging/prod. Every migration file is checked into `supabase/migrations/` and is forward-only (rollback = new migration).

### Core tables (initial set)

```
organizations
  id, name, slug, business_type, timezone, currency, plan_id,
  stripe_customer_id, status (active|trialing|past_due|canceled),
  created_at, updated_at

organization_members
  id, org_id, user_id, role_id, status (invited|active|suspended),
  invited_by, joined_at, created_at, updated_at

roles
  id, org_id (nullable = system role), name, is_system_role,
  created_at, updated_at

permissions
  id, key (e.g. "inventory.edit"), description, module_key

role_permissions
  role_id, permission_id

profiles                              -- 1:1 with auth.users
  id (= auth.users.id), full_name, avatar_url, locale,
  created_at, updated_at

audit_logs
  id, org_id, actor_id, action, entity_type, entity_id,
  metadata jsonb, ip_address, created_at
  -- append-only, no updates/deletes permitted via RLS

subscriptions
  id, org_id, plan_id, status, stripe_subscription_id,
  current_period_end, seats, created_at, updated_at

plans
  id, key, name, price_monthly, price_yearly, module_limits jsonb,
  seat_limit, is_active

feature_flags
  id, key, description, default_enabled boolean

org_feature_flags
  org_id, flag_id, enabled boolean

notifications
  id, org_id, user_id, type, title, body, read_at, metadata jsonb,
  created_at

files
  id, org_id, bucket, path, filename, mime_type, size_bytes,
  uploaded_by, entity_type, entity_id, created_at
```

### Module tables (examples — expanded per module during implementation)

```
products, product_variants, product_images, categories, suppliers,
  inventory_transactions, stock_adjustments                             (inventory — finalized, see below)
orders, order_items, payments, pos_sessions, pos_registers              (pos/orders)
customers, customer_notes, deals, pipelines                             (crm)
bookings, booking_resources, availability_rules                         (bookings)
staff, shifts, timesheets                                               (hr-staff)
purchase_orders, purchase_order_items                                   (purchasing)
```

All module tables follow the same tenant-isolation, timestamp, and soft-delete conventions as core tables.

#### SOT reconciliation (Phase B/C, inventory milestone)

Two deliberate deviations from the original sketch above, made when the inventory schema was
finalized against the already-shipped UI (Phase 1) rather than guessed in the abstract:

- **`suppliers` moved from `purchasing` to `inventory`.** The Product Details screen already
  surfaces supplier name/contact/phone as an inventory concern, and there is no `purchasing`
  module yet. `suppliers` stays owned by `inventory` until a `purchasing` module exists; if/when
  purchase orders are built, `purchasing` will reference `inventory.suppliers` rather than
  duplicating it.
- **`stock_levels`/`stock_movements` replaced by two tables: `stock_adjustments` +
  `inventory_transactions`.** These serve different jobs and collapsing them into one table
  would conflate them:
  - `stock_adjustments` is the **user-facing action log** — one row per manual increase /
    decrease / transfer made from the Stock Adjustment screen, with reason, notes, and who
    performed it. It powers the product detail "Stock history" timeline.
  - `inventory_transactions` is a **generic, append-only ledger** of quantity deltas
    (`direction: in|out`), written automatically (by trigger) whenever a `stock_adjustment` of
    type `increase`/`decrease` is inserted (`transfer` doesn't change total quantity, so it isn't
    ledgered). It exists so future stock-affecting sources — POS sales, purchase-order receipts —
    can write to the same ledger without being manual "adjustments," and it's what the Inventory
    Dashboard's stock-movement chart aggregates from. Clients never insert into it directly.

#### Inventory schema (finalized)

```
categories
  id, org_id, name, color, icon, description,
  created_at, updated_at, deleted_at

suppliers
  id, org_id, name, contact_name, email, phone,
  created_at, updated_at, deleted_at

products
  id, org_id, category_id (nullable, set null on category delete),
  supplier_id (nullable, set null on supplier delete),
  name, sku, barcode, description,
  cost_price, selling_price, quantity, reorder_point, unit, location,
  created_at, updated_at, deleted_at

product_images
  id, org_id, product_id, url, sort_order, created_at, updated_at

product_variants
  id, org_id, product_id, name, sku, price_delta, quantity,
  created_at, updated_at

stock_adjustments                     -- append-only; the manual action log
  id, org_id, product_id, type (increase|decrease|transfer), quantity,
  reason, notes, performed_by, resulting_quantity,
  from_location, to_location, created_at

inventory_transactions                -- append-only; system-wide ledger, trigger-populated only
  id, org_id, product_id, direction (in|out), quantity,
  source (adjustment|transfer|sale|purchase_receipt), source_id,
  occurred_at, created_at
```

New permission keys (seeded into `permissions`, granted to every org's system `Owner` role):
`inventory.view`, `inventory.edit`, `inventory.adjust_stock`.

---

## 5. Supabase Schema Plan

- **Auth**: Supabase Auth (`auth.users`) is the identity source of truth. `public.profiles` extends it 1:1 via trigger on user creation.
- **RLS policy pattern** (applied consistently across all tenant tables):
  ```sql
  create policy "org_isolation_select" on <table>
    for select using (
      org_id in (select org_id from organization_members where user_id = auth.uid() and status = 'active')
    );
  ```
  Insert/update/delete policies additionally check the acting user's role permission via a `has_permission(org_id, permission_key)` SQL function, so RLS and RBAC (§7) are enforced at the same layer — the client cannot rely on UI hiding alone.
- **Database functions** (`security definer` where needed) encapsulate cross-table invariants: e.g. `create_organization_with_owner()`, `has_permission(uuid, text)`, `current_org_ids()`.
- **Generated types**: `supabase gen types typescript` output checked into `src/core/supabase/database.types.ts`, regenerated as part of the migration workflow (never hand-edited).
- **Realtime**: enabled selectively per table (e.g. `notifications`, `orders`) — not globally, to control payload/connection cost.
- **Storage buckets**: `avatars` (public, size-limited), `org-files` (private, RLS-scoped by org via storage policies mirroring the `files` table pattern), `receipts`/`invoices` (private).

---

## 6. Authentication

- Supabase Auth: email/password + magic link at MVP; OAuth (Google) added post-MVP.
- `core/auth/AuthProvider` wraps the app, exposes `session`, `user`, `loading` via context; backed by `supabase.auth.onAuthStateChange`.
- `core/tenant` layer resolves the **active organization** after auth: a user can belong to multiple orgs; active org is stored in a client-side selection (persisted to `localStorage`, validated against membership on load) and included implicitly via RLS (all queries are already org-scoped by membership; the active-org selection controls what the *UI* shows, RLS controls what's *reachable*).
- Protected routes: a `<RequireAuth>` wrapper at the router root redirects unauthenticated users to `/login`; a `<RequireOrg>` wrapper ensures an active org is selected before rendering module routes; a `<RequirePermission>` / `<Can>` wrapper gates individual routes/actions per §7.
- Session refresh handled by the Supabase JS client automatically; no custom token logic.
- Invite flow: org admins invite by email → `organization_members` row with `status = 'invited'` → invitee accepts via a signed invite link → status flips to `active`.

---

## 7. RBAC Permissions

- Two-tier model: **system roles** (Owner, Admin, Manager, Staff, Read-only) ship by default per org at creation, are not deletable, and map to a curated permission set. Orgs on eligible plans may also define **custom roles** (`roles.org_id` non-null) with a la carte permission grants.
- Permissions are namespaced strings: `<module>.<action>`, e.g. `inventory.view`, `inventory.edit`, `pos.refund`, `billing.manage`, `settings.manage_roles`.
- Enforcement happens in **three places, redundantly, by design**:
  1. Database RLS/`has_permission()` — the actual security boundary.
  2. TanStack Query hooks — mutations check permission client-side before firing, to fail fast with a clear UI message rather than a raw RLS error.
  3. UI — `<Can permission="inventory.edit">` conditionally renders actions/buttons.
- `core/rbac` exposes `usePermissions()` (returns the resolved permission set for the active org/user, from a cached query joining `organization_members → roles → role_permissions`) and `useCan(permissionKey)`.

---

## 8. Subscription Architecture

- Stripe is the billing engine; Supabase stores subscription state mirrored from Stripe via webhook (Edge Function `stripe-webhook`), never trust client-reported plan state.
- `plans` table defines tiers (e.g. Starter, Growth, Enterprise) with `module_limits` (which modules, seat caps, usage caps like max SKUs or locations) as structured jsonb, read by `core/tenant` to compute entitlements.
- `subscriptions` table is the org's current billing state; `stripe_customer_id`/`stripe_subscription_id` link both directions.
- Entitlement checks (module availability, seat limits) are computed from `plans.module_limits` + current usage — never hardcoded per plan name in UI code, so plan definitions can change without a redeploy.
- Trial, past-due, and canceled states drive a global "billing banner" and progressively restrict write actions (read-only lockout) rather than hard-blocking login, to reduce support burden and involuntary churn.

---

## 9. Feature Flags

- `feature_flags` (global definitions) + `org_feature_flags` (per-org override) tables, exposed via `core/feature-flags` provider, loaded once per session alongside entitlements.
- Two use cases distinguished:
  - **Release flags** (short-lived, engineering-controlled): gate incomplete features in production before default-audit. Removed once fully rolled out.
  - **Entitlement flags** (long-lived, plan/business-tied): overlap conceptually with §8 module limits but allow finer-grained toggles (e.g. an experimental AI feature enabled for specific pilot orgs).
- PostHog feature flags may be adopted for release-flag use cases specifically (fast toggle without a deploy or DB write); entitlement flags remain source-of-truth in Supabase since they're tied to billing/business logic.

---

## 10. Tenant Isolation

- Isolation boundary = `organizations.id`, enforced at the database layer via RLS on every tenant table (§4/§5) — this is non-negotiable and the same pattern regardless of table.
- No tenant data is ever fetched using the `service_role` key from client-reachable code. `service_role` is used only inside Edge Functions for specific, audited server-side operations (webhook processing, scheduled jobs).
- Cross-tenant data leakage is treated as a security incident class; any new table PR must include its RLS policies in the same migration, and a checklist item in code review confirms RLS is enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) before merge.
- Storage isolation mirrors table isolation: bucket paths are prefixed `org_id/...` and storage policies check membership the same way.

---

## 11. Audit Logs

- `audit_logs` is append-only (RLS permits `insert` for authenticated org members acting within their own org, denies `update`/`delete` entirely).
- Logged via `core/audit` helper called from mutation hooks for sensitive actions: role changes, permission changes, billing changes, deletions, exports, settings changes. Not every read/write is logged — only actions with compliance/security relevance, to keep the log meaningful and queryable.
- Each entry captures actor, action, entity type/id, a jsonb diff/metadata payload, and timestamp; IP address captured where available via Edge Function-mediated writes for sensitive actions (client-side inserts don't reliably get real IP).
- Surfaced in-product via a `settings/audit-log` view (admin-only, permission-gated) with filtering by actor/action/date.

---

## 12. Billing

- Stripe Billing (Checkout for upgrade flow, Customer Portal for self-serve plan/payment-method management) rather than a custom billing UI at MVP — reduces PCI scope and build time.
- `modules/billing` renders current plan, usage against entitlements, and invoice history (pulled live from Stripe via a thin Edge Function proxy, not duplicated in Supabase beyond `subscriptions`).
- Webhook Edge Function handles: `checkout.session.completed`, `customer.subscription.updated/deleted`, `invoice.payment_failed` → updates `subscriptions.status` and triggers in-app notifications for billing issues.
- Usage-based add-ons (e.g. extra seats, extra locations) modeled as Stripe subscription items; not built at MVP unless a target vertical requires it early.

---

## 13. Notifications

- In-app notification center (`notifications` table, Realtime-subscribed) for the primary MVP channel.
- Email notifications via Supabase's SMTP integration or a transactional provider (Resend/Postmark — decision deferred to implementation phase) for: invites, billing events, password reset (Supabase default), and optionally digest summaries.
- Notification preferences per user stored on `profiles` or a dedicated `notification_preferences` table (added when the second channel — email — is implemented, to avoid a premature table for a single-channel MVP).
- Push/SMS explicitly out of scope until a specific vertical (e.g. logistics delivery alerts) justifies the cost — noted in roadmap, not built speculatively.

---

## 14. File Storage

- Supabase Storage, buckets as defined in §5.
- `files` table indexes uploads for querying/listing without hitting Storage APIs directly (attach files to orders, products, staff docs, etc. via `entity_type`/`entity_id`).
- Uploads go through signed upload URLs requested via a thin client helper; downloads via signed URLs for private buckets (never public-read for tenant documents).
- File size/type validation enforced both client-side (fast feedback) and via Storage bucket policy (actual boundary).

---

## 15. AI Architecture

- AI features are additive, not load-bearing for core CRUD flows — the app must be fully usable if AI is degraded/unavailable.
- All AI calls are server-mediated via an Edge Function (`ai-assistant` and future task-specific functions) — **no LLM API key ever ships to the client.**
- Edge Function responsibilities: assemble tenant-scoped context (respecting RLS — the function queries with the user's JWT, not `service_role`, unless a specific privileged summary task is explicitly designed and audited), call the model provider, stream response back to client.
- Anthropic Claude is the default model provider given the stated stack context; the Edge Function is written against a thin internal interface so provider/model can change without touching call sites.
- Planned AI capabilities (phased, see roadmap): natural-language reporting queries ("what were my top sellers last week"), inventory reorder suggestions, customer/CRM note summarization, restaurant/retail demand forecasting. Each ships as its own scoped Edge Function + module UI entry point, not a single monolithic "AI chat does everything" surface, so each capability can be evaluated, rate-limited, and billed independently.
- AI usage is metered per org (a counter table or PostHog event) to support future plan-based AI usage limits.

---

## 16. API Conventions

- No custom REST/GraphQL backend at MVP — the Supabase auto-generated PostgREST API (via `supabase-js`) is the primary data interface, with RLS as the authorization layer.
- Complex multi-step operations that must be transactional or need elevated privilege live in Postgres functions (`security definer` where justified) called via `supabase.rpc()`, not assembled client-side from multiple round trips.
- Edge Functions are used for: third-party integrations (Stripe, AI providers), anything requiring `service_role`, and scheduled/cron jobs — never as a general-purpose app backend duplicate of PostgREST.
- All module `api.ts` files expose typed functions (`getProducts(orgId, filters)`, `createProduct(input)`) wrapping `supabase-js` calls, returning `Database` generated types — components/hooks never call `supabase.from(...)` directly outside these files.
- TanStack Query key convention: `[module, resource, ...params]`, e.g. `["inventory", "products", orgId, filters]`, centralized in a per-module `queryKeys.ts` to avoid key drift/typos.
- Errors from Supabase are normalized into a single `AppError` shape (`code`, `message`, `cause`) before reaching UI, so error-handling/toast logic is uniform across modules.

---

## 17. UI Design System

- shadcn/ui components are copied into `src/shared/components/ui` and treated as owned code — modified directly as needed, not patched around.
- Design tokens defined as CSS variables in `src/styles/globals.css` (HSL-based, matching shadcn convention) for light/dark themes: `--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, `--border`, radii, and a small semantic set for status colors (`--success`, `--warning`, `--info`) since a Business OS needs consistent status/badge coloring across modules (order status, stock status, subscription status, etc.).
- Typography: a single font family, Tailwind's default type scale, no ad-hoc font sizes in component code — all sizing via Tailwind classes mapped to the scale.
- Spacing/layout: Tailwind's default spacing scale; a shared `<AppShell>` (sidebar + topbar + content) is the only top-level layout component — pages never construct their own page chrome.
- Dark mode supported from the start via the CSS-variable/class strategy (not bolted on later), since it's near-free with this token approach and expected in a premium SaaS product.
- Data-dense patterns (tables, filters, bulk actions) get a shared pattern set in `shared/components` (`<DataTable>` wrapping TanStack Table + shadcn table primitives, `<FilterBar>`, `<EmptyState>`, `<PageHeader>`) so every module's list view looks and behaves consistently rather than each module reinventing table UX.
- No placeholder/lorem-ipsum UI ships — empty states are real, designed empty states with a clear next action.

---

## 18. Coding Standards

- TypeScript strict mode; `any` is a lint error (escape hatch requires an inline justification comment, code-reviewed).
- No default exports except route page components.
- Components: function components, colocated `.tsx` + (if needed) `.test.tsx`.
- Naming: `PascalCase` components, `camelCase` functions/variables, `useX` hooks, `kebab-case` file names for non-component files, `PascalCase.tsx` for component files.
- No business logic inside JSX-heavy components — extract to hooks (`useProductForm`, `useOrderTotals`) so components stay presentational and testable.
- All Supabase interaction goes through module `api.ts` + TanStack Query hooks — never inline in components (§16).
- Zod schemas define form/API input shape once; types are inferred from schemas (`z.infer<>`) rather than hand-duplicated interfaces, where practical.
- Every PR: type-checks, lints, and (from MVP phase 2 onward) passes relevant tests before merge — enforced via CI, not convention alone.
- No commented-out code, no TODO left unassigned/untracked — TODOs reference a tracked issue or are resolved before merge.

---

## 19. Security Model

- **Tenant isolation**: RLS on every table, no exceptions (§10) — the primary security boundary.
- **RBAC**: enforced at DB layer, not just UI (§7).
- **Secrets**: never in client bundle. `.env` (client) contains only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — both safe to expose per Supabase's design (protected by RLS). All other secrets (`service_role`, Stripe secret key, AI provider keys) live only in Supabase Edge Function secrets / deployment environment.
- **Input validation**: Zod at every form/API boundary; Postgres constraints as a second line of defense (not relying on application-layer validation alone).
- **Audit trail**: sensitive actions logged append-only (§11).
- **Dependency hygiene**: `pnpm audit` in CI; Dependabot/Renovate for updates.
- **Auth session handling**: relies on Supabase's battle-tested client library rather than custom token logic.
- **XSS/injection**: React's default escaping relied on; any `dangerouslySetInnerHTML` usage (e.g. rendering AI-generated rich text) goes through a sanitizer (DOMPurify) — flagged explicitly wherever used.
- **Rate limiting**: Edge Functions (especially AI endpoints) implement per-org rate limiting to control cost and abuse; Supabase's built-in Auth rate limits cover login/signup abuse.
- **CSP**: a Content-Security-Policy header configured at the hosting layer once deployment target is finalized.

---

## 20. Deployment Architecture

- Environments: `local` (Supabase CLI local stack) → `staging` (separate Supabase project + separate frontend deployment) → `production`.
- Frontend: static Vite build deployed to Vercel or Cloudflare Pages (both fit an SPA well; final choice deferred — see Open Decisions below) with preview deployments per PR.
- Backend: Supabase CLI manages migrations (`supabase db push`/linked project migrations) — CI runs migrations against staging on merge to `main`, production migrations run as a deliberate, reviewed step (not auto-applied on every merge) until the team is confident in the migration review process, at which point it can be automated.
- Edge Functions deployed via Supabase CLI as part of the same CI pipeline as migrations.
- CI: GitHub Actions — typecheck, lint, unit tests → build → (staging) deploy + migrate → (production) manual approval gate → deploy + migrate.
- Environment config via `.env` files per environment, never committed (`.env.example` documents required keys only).

---

## 21. Scalability Plan

- **Data volume**: RLS-scoped queries plus proper indexing (`org_id` indexed on every tenant table, composite indexes for common filter patterns like `(org_id, status, created_at)`) keep query plans efficient as tenant count grows; TanStack Table server-side pagination avoids ever loading full tables client-side.
- **Read scaling**: Supabase read replicas can be introduced later for reporting-heavy queries without application changes, since all access goes through the same typed API layer.
- **Realtime scaling**: Realtime subscriptions kept selective (§5) to avoid connection/broadcast cost blowing up with tenant count.
- **Compute scaling**: Edge Functions scale horizontally by nature of the platform; AI endpoints get per-org rate limits and usage metering (§15) to bound cost growth.
- **Module growth**: the module-manifest pattern (§3) means adding a new vertical module doesn't touch core routing/nav logic — it's additive, keeping the core app's complexity roughly flat as verticals are added.
- **Team scaling**: feature-based folder structure means multiple engineers can work in different `modules/*` folders with minimal merge conflicts; `core`/`shared` changes get tighter review since they're cross-cutting.

---

## 22. Development Roadmap: MVP → Enterprise

### Phase 0 — Foundation (pre-MVP)
- Repo scaffold: Vite + TS + Tailwind + shadcn/ui + ESLint/Prettier + pnpm
- Supabase project (local + staging), core tables: `organizations`, `organization_members`, `roles`, `permissions`, `role_permissions`, `profiles`, base RLS
- Auth: sign up/login/logout, org creation on signup, `AuthProvider`, `RequireAuth`/`RequireOrg`
- `AppShell` layout, design tokens, dark mode
- CI: typecheck/lint/build

### Phase 1 — MVP (single vertical proof, e.g. Retail)
- RBAC system roles + `<Can>`/`useCan`
- One full vertical module end-to-end (e.g. `inventory` + `pos` for Retail) including server-side paginated `<DataTable>` pattern
- `dashboard` module with real Recharts-based KPIs (no placeholder data)
- `settings` module: org profile, member invites, role management
- Stripe integration: plans, checkout, customer portal, webhook sync
- Basic in-app notifications
- File storage for one real use case (e.g. product images or receipts)
- Audit logging for sensitive actions
- Unit tests for core hooks/utils; first Playwright smoke test (login → core flow)

### Phase 2 — Multi-Vertical Expansion
- Add 2–3 additional modules (e.g. `bookings` for hotels, `crm`, `purchasing`)
- Business-type templates driving default `enabled_modules`
- Feature flag system (release + entitlement flags)
- Email notification channel
- Expanded test coverage, Playwright coverage for each shipped module's critical path
- Custom roles (beyond system roles) for eligible plans

### Phase 3 — AI Layer
- `ai-assistant` Edge Function architecture, first capability shipped (e.g. natural-language reporting query)
- Per-org AI usage metering + rate limiting
- Second AI capability tied to a specific vertical (e.g. inventory reorder suggestions)

### Phase 4 — Scale & Polish
- Read-replica evaluation if reporting load warrants it
- Realtime expansion (e.g. live order boards for restaurants/POS)
- Advanced reporting/export module
- SSO/OAuth providers beyond Google if enterprise prospects require it
- SOC2-readiness pass: formalize audit log coverage, access reviews, backup/DR runbook

### Phase 5 — Enterprise
- SSO (SAML) for enterprise customers
- Custom contracts / usage-based billing add-ons
- Advanced permission granularity (row-level exceptions beyond org, e.g. location-scoped roles for multi-location retailers)
- Data export/API access for enterprise integrations
- Formal SLA + status page + on-call process

---

## Open Decisions (need your input before/along with implementation start)

1. **Hosting for frontend**: Vercel vs Cloudflare Pages — no strong technical blocker either way; pick based on your existing infra/preferences.
2. **Transactional email provider**: Resend vs Postmark vs Supabase's built-in SMTP for MVP.
3. **First vertical to build for MVP proof**: which of the target business types should Phase 1 actually implement first (affects which module gets built deepest first)? Retail was used as the illustrative example above but this should be your call.
4. **AI provider default**: confirm Anthropic Claude as the default model provider for the `ai-assistant` Edge Function (stack description didn't specify).

---

**This document requires your explicit approval before any scaffolding or code is written.** Once approved, Phase 0 scaffolding begins per §22.
