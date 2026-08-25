---
title: Master Roadmap
last_updated: 2026-08-25
---

# Master Roadmap

Status values: **Complete**, **In Progress**, **Planned**, **Blocked**, **Deferred**.

## Shipped (per git history, oldest → newest)

| Feature | Status | Modules | Tables | Notes |
|---|---|---|---|---|
| Phase 0 foundation (auth, orgs, RBAC data model) | Complete | `src/core/auth`, `src/core/tenant` | organizations, organization_members, roles, permissions, role_permissions, profiles | No client-side RBAC hook/component layer yet (`src/core/rbac/` empty) |
| Inventory | Complete | `src/modules/inventory` | categories, suppliers, products, product_images, product_variants, stock_adjustments, inventory_transactions | `adjust_stock` RPC is atomic |
| Orders | Complete | `src/modules/orders` | customers, orders, order_items, order_notes, order_events | |
| CRM | Complete | `src/modules/crm` | customer_notes, deals | extends `customers` |
| Bookings | Complete | `src/modules/bookings` | bookings, booking_resources | |
| Purchasing | Complete | `src/modules/purchasing` | purchase_orders, purchase_order_items | |
| HR & Staff | Complete | `src/modules/hr-staff` | staff, shifts | manual timesheets only |
| Billing (read-only) | Complete (no payment provider) | `src/modules/billing` | plans, subscriptions | |
| AI Assistant (shell) | Planned (UI shell shipped, disabled) | `src/modules/ai-assistant` | ai_providers, ai_prompt_templates, ai_usage_logs | Ask button disabled, no LLM call path — see [06_AI/INDEX.md](../06_AI/INDEX.md) |
| Dashboard | Complete | `src/modules/dashboard` | (reads across modules) | |
| Platform Owner Portal Phase 1 (tenants, audit log) | Complete | `src/core/platform-admin` | platform_admins, audit_logs | |
| Feature Flags | Complete | `src/core/feature-flags` | feature_flags, org_feature_flags | |
| Branding / White-label | Complete | | platform_settings (+ per-tenant override) | |
| Subscription & Licensing | Complete (manual only) | | coupons, invoices | no live payment processor |
| User & Role Management | Complete | | (RBAC tables above) | dynamic role editor |
| Support Center | Complete | | tickets + threaded messages | `is_internal` flag |
| Media Library | Complete | | files | indexes existing `axiondesk-assets` bucket |
| Notifications | Complete | | notifications, announcements, notification_channels | + maintenance mode |
| AI Provider Management (config only) | Complete (config), Planned (live use) | | ai_providers, ai_prompt_templates, ai_usage_logs | no live LLM integration |
| System Health & Monitoring | Complete (in-app only) | | error_logs | no Sentry/status page |
| Security Center | Complete | | (audit log naming fix) | |
| Developer Tools | Complete (registry only) | | platform_api_keys, platform_webhooks, platform_edge_functions | catalog table, not deployed Edge Functions |
| CMS | Complete | | cms_pages | public legal/help/marketing pages |

## In Progress — Industry Module Engine (next major architectural milestone)

Full implementation plan lives in [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md). Summary:

- **Priority**: High.
- **Business value**: same codebase serves many industries without forks; config-driven onboarding, navigation, dashboards, AI behavior, roles.
- **Dependencies**: Module Registry must exist before Industry Templates can reference it; Organization Type Library depends on Module Registry + Feature Flags (already shipped) + Subscription plan model (already shipped).
- **Current status**: **Phase 1 (Module Registry) and Phase 2 (Industry/Org-Type Registry + Templates) — schema/API written, neither applied to a live database.** Phase 1: `modules` table, seed data (12 real modules), `platform_list_modules()`/`platform_upsert_module()` RPCs, `src/core/modules/{api.ts,hooks.ts}` (`supabase/migrations/0026_module_registry.sql`). Phase 2: `organization_types` + `organization_type_modules` tables, 14 seeded industries (module mappings for the 9 with a researched default — see [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md)), `platform_list_organization_types()`/`platform_upsert_organization_type()`/`platform_archive_organization_type()`/`platform_restore_organization_type()`/`platform_set_organization_type_module()` RPCs, `src/core/industries/{api.ts,hooks.ts}` (`supabase/migrations/0027_industry_registry.sql`). Neither migration has been applied to any live Supabase project — see [docs/18_REFERENCE/MODULE_REGISTRY.md](../18_REFERENCE/MODULE_REGISTRY.md) for why (no authenticated CLI access to the actual project in this environment). `src/router.tsx` and `organizations` intentionally untouched so far — see ADR-005 and ADR-006 in [DECISIONS.md](DECISIONS.md). Per the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), Phase 3 requires a fresh "Continue" instruction.
- **Phases** (see playbook for detail): 1) Module Registry — **schema shipped**, 2) Industry/Org-Type Registry + Templates — **schema shipped**, 3) Onboarding wizard rewrite to apply templates, 4) Platform Owner Portal "Industries" management UI + Navigation/Dashboard generation from registry, 5) AI behavior selection by industry, 6) Subscription-gated module unlocking.
- **Risks**: touches onboarding (auth-adjacent, high blast radius), navigation (used by every route), and RBAC (default roles per template) — needs migration + rollback strategy per phase. Phase 1 itself was scoped narrowly specifically to avoid these risks (see ADR-005).

## Planned — Workspace & Collaboration

Not started. Full target architecture in [.ai/05_WORKSPACE_COLLABORATION.md](../../.ai/05_WORKSPACE_COLLABORATION.md). No channels/messaging/calls exist in the current schema or code.

## Planned — Enterprise Marketing Website

- **Status**: Planned.
- **Priority**: High.
- **Estimated phase**: After Industry Module Engine Foundation (Phase 1: Module Registry) — sequenced after, not before, per [docs/00_ADOS/AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md)'s Architectural Foundations Rule and Incremental Delivery Rule.
- **Business value**: AxisOneDesk's public site is currently a bare CMS-page renderer (see [docs/09_MARKETING/INDEX.md](../09_MARKETING/INDEX.md)) with no dedicated marketing experience. This milestone treats the marketing site as a core product deliverable, not a throwaway landing page, reflecting the platform's quality for customers, investors, partners, and enterprise buyers.
- **Objective**: a complete, CMS-driven, white-label-aware public website — Home, Features, Industries, Modules, Marketplace, Integrations, AI, Platform Owner, Workspace, White-label, Security, Pricing, Enterprise, Documentation, Blog, About, Careers, Contact.
- **Design benchmark**: study span.framer.ai for visual hierarchy, spacing, motion, and premium presentation quality — original AxisOneDesk execution only, no copied branding/graphics/copy.
- **Deliverables**: page set above; a reusable marketing component library (Hero, Navigation, Mega Menu, Dashboard Showcase, Industry Cards, Module Cards, Feature Sections, AI Showcase, Marketplace Showcase, Integrations Grid, Pricing, FAQ, Testimonials, CTA Sections, Footer) added to the shared design system; a reusable motion system (page transitions, staggered reveals, hover interactions, etc.).
- **Dependencies**: Industries and Modules pages are only meaningfully accurate once the Industry Engine / Module Registry exist (see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)) — building them earlier risks marketing copy describing capabilities the product doesn't have yet, which [docs/00_ADOS/AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md)'s no-fabrication rule applies to just as much as engineering docs. Marketplace and Workspace pages are similarly downstream of their respective playbooks ([.ai/08_MARKETPLACE.md](../../.ai/08_MARKETPLACE.md), [.ai/05_WORKSPACE_COLLABORATION.md](../../.ai/05_WORKSPACE_COLLABORATION.md)) — those pages should describe what's real or clearly-roadmapped, not aspirational features presented as available today.
- **Architecture**: extends the existing CMS (`cms_pages`) and public route segment (see [docs/02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md)) rather than a parallel content system — see [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md) for the implementation playbook this milestone should follow (SEO, analytics, lead capture, i18n, A/B testing all noted there as sequenced phases, not day-one requirements).
- **Completion requirements**: `pnpm build` + `pnpm lint` clean, responsive layouts verified, accessibility verified (see [24_CHECKLISTS/ACCESSIBILITY_CHECKLIST.md](../24_CHECKLISTS/ACCESSIBILITY_CHECKLIST.md)), SEO verified, Lighthouse performance verified — then update `PROJECT_STATE.md`, `PROJECT_HEALTH.md`, `ROADMAP.md`, `PROGRESS.md`, `CHANGELOG.md`, commit, push.
- **Related modules/tables**: `cms_pages` (existing); no new modules — this is presentation-layer work.
- **Testing status**: N/A — not started.

## Planned — other tracked initiatives

| Initiative | Status | Reference |
|---|---|---|
| Provider Management (AI/Payment/Comms/Auth/Storage/Analytics/Maps/Video/File providers, centralized registry) | Planned (AI provider config table is the only piece that exists) | [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) |
| Testing (unit/integration/e2e) | Planned | [11_TESTING/INDEX.md](../11_TESTING/INDEX.md) |
| CI/CD | Planned | [12_DEPLOYMENT/INDEX.md](../12_DEPLOYMENT/INDEX.md) |
| Live payment provider integration | Planned | [08_BILLING/INDEX.md](../08_BILLING/INDEX.md) |
| Live AI/LLM integration | Planned | [06_AI/INDEX.md](../06_AI/INDEX.md) |
| Client-side RBAC layer (`usePermission`/`<Can>`) | Planned (designed in ARCHITECTURE.md §RBAC, `src/core/rbac/` empty) | [02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md) |
| Marketplace | Deferred | [.ai/08_MARKETPLACE.md](../../.ai/08_MARKETPLACE.md) |
| Mobile apps | Deferred | [.ai/06_MOBILE_APPS.md](../../.ai/06_MOBILE_APPS.md) |
