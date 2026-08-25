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
- **Current status**: **Phases 1, 2, 3a live. Phase 3b slice 1 (canonical Source of Truth + flagged picker) live; slice 2 (remaining onboarding fields + flag rollout) not started.** Phase 1: `modules` table + RPCs + `src/core/modules/` (`0026`). Phase 2: `organization_types`/`organization_type_modules` + RPCs + `src/core/industries/` (`0027`). Phase 3a: `organizations` schema extension, 7 new nullable columns (`0028`). Phase 3b slice 1: **`organization_type_key` established as the canonical, permanent Source of Truth for organization classification — `business_type` is now legacy-compatibility only** (full mapping table + reasoning in ADR-009, [DECISIONS.md](DECISIONS.md)); every existing org backfilled, every new org guaranteed to get `organization_type_key` populated regardless of picker-flag state, flagged registry-backed onboarding picker added (default OFF, zero behavior change until explicitly enabled), API/type layer updated everywhere `business_type` was surfaced (`0029`, `0030` fix, `0031`). All 6 migrations (`0026`-`0031`) applied to the live "Axis" project and verified by direct query — including the backfill (all 3 existing orgs correctly mapped). `src/router.tsx`, the onboarding UI's actual picker rendering (still legacy by default), and cosmetic nav labels (`OrgSwitcher`/`SidebarNav`/`TenantDetailPage`) remain untouched — see ADR-005, ADR-006, ADR-008, ADR-009 in [DECISIONS.md](DECISIONS.md). Per the Incremental Delivery Rule in [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md), Phase 3b slice 2 requires a fresh "Continue" instruction.
- **Phases** (see playbook for detail): 1) Module Registry — **live**, 2) Industry/Org-Type Registry + Templates — **live**, 3a) `organizations` schema extension — **live**, 3b slice 1) Canonical Source of Truth + flagged picker — **live**, 3b slice 2) Remaining onboarding fields + picker flag rollout — not started, 4) Platform Owner Portal "Industries" management UI + Navigation/Dashboard generation from registry, 5) AI behavior selection by industry, 6) Subscription-gated module unlocking.
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
