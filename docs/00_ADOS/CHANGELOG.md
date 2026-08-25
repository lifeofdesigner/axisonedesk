---
title: Changelog
---

# Changelog

Human-readable summary, newest first. Machine-verifiable detail is in `git log`; this file explains *why*, not just *what*.

## 2026-08-25 — Industry Module Engine Phase 1: Module Registry

Added `modules` table (`supabase/migrations/0026_module_registry.sql`), seeded with the 12 real shipped modules, plus `platform_list_modules()`/`platform_upsert_module()` RPCs and `src/core/modules/{api.ts,hooks.ts}`. Purely additive metadata — does not change any gating behavior (`feature_flags`/`org_feature_flags`/`RequireModuleEnabled` untouched). `src/router.tsx` was intentionally *not* refactored to consume the registry in this milestone — see ADR-005 in `DECISIONS.md` for why that was scoped out to keep this milestone small and low-risk per the Incremental Delivery Rule. **The migration has not been applied to any live database**: this session had no authenticated Supabase CLI access to the project the app's `.env` actually points at (its project ref isn't in the linked account's project list, and no local Docker-based Supabase instance is running). `database.types.ts` was updated by hand to match the migration's schema exactly and should be verified against `supabase gen types` once real DB access exists. Build and lint verified passing against the hand-authored types.

## 2026-08-25 — Enterprise Engineering Knowledge Platform (EEKP) established

Extended ADOS into a full recurring-task knowledge platform: `docs/16_PLAYBOOKS/` (63 playbooks — a generic CREATE workflow plus 53 artifact-specific playbooks and 9 process playbooks for bug fixes, releases, rollbacks, etc.), `docs/17_TEMPLATES/` (24 copy-paste skeletons), `docs/18_REFERENCE/` (23 registries — Permissions Matrix, Roles Matrix, Route Registry, RPC Registry, RLS Policy Registry, and others derived from a fresh live-code audit; Module/Industry/Organization Type/Provider registries marked Planned since those systems don't exist yet), `docs/19_RUNBOOKS/` (15 operational runbooks for deployment, incidents, recovery, and rotation), `docs/20_OPERATIONS/`, `docs/21_GOVERNANCE/` (16 standards documents), `docs/22_PATTERNS/ARCHITECTURAL_PRINCIPLES.md` (16 governing principles), `docs/23_EXAMPLES/`, `docs/24_CHECKLISTS/` (12 actionable checklists), `docs/25_DIAGRAMS/` (2 Mermaid diagrams of the real route tree and RLS data flow). Added three permanent rules to `AI_INSTRUCTIONS.md`: Autonomous Development Rule (what "Continue" means), Incremental Delivery Rule (one milestone per session), Architectural Foundations Rule (never skip a required registry/config layer to build atop its absence). Added the Enterprise Marketing Website milestone to `ROADMAP.md`. No application code changed; build and lint verified passing.

## 2026-08-25 — ADOS established

Built the full Engineering Operating System: `docs/00_ADOS/` (state/process files), `docs/01_PRODUCT/` through `docs/15_DEVELOPER/` (subject-area reference, audited against actual code/migrations, no fabricated content), `docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md`, and `.ai/` (13 implementation playbooks for not-yet-built systems). No application code changed. Goal: future sessions can resume with "Continue" instead of re-deriving context from conversation history.

## Prior history (from `git log`, pre-ADOS)

- `6570f2e` Add Notifications: real in-app notifications, announcements, maintenance mode.
- `68ed0d1` Add Media Library: real file manager on the existing axiondesk-assets bucket.
- `4402cbd` Add Support Center: tickets with threaded conversation + platform-admin-only internal notes.
- `d655b32` Add User & Role Management: platform-wide user directory + dynamic RBAC editor.
- `eaba9b0` Add Subscription & Licensing: plans CRUD, coupons, manual invoicing, tenant subscription editor.
- `40fe11c` Add Branding / white-label.
- `80548ba` Add Feature Flags.
- `c2ceb74` Add Platform Owner Portal Phase 1 (tenants, audit log).
- `13c6436` Add CRM, Bookings, Purchasing, HR & Staff, Reports, Billing (read-only), AI Assistant shell, Dashboard.
- `494d634` Add Orders.
- `e432a57` Inventory live wiring.
- `4c74117` Add Inventory.
- `8b47a5e` Phase 0 foundation (auth, organizations, RBAC data model).
- `370889b` Add AI Provider Management (config only, no live LLM).
- `135fd8e` Add System Health & Monitoring.
- `985546e` Add Security Center.
- `ba980af` Add Developer Tools.
- `dbb4b67` Add CMS.
- `cfb9f33` Fix Vercel deep-link 404s.

(Ordering here follows the feature build sequence per `git log --oneline`; consult `git log` directly for exact commit ordering/timestamps.)
