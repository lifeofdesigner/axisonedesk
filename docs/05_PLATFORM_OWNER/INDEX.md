---
title: Platform Owner Portal
last_updated: 2026-08-25
---

# 05_PLATFORM_OWNER

Gated `RequireAuth` → `RequirePlatformAdmin` → `PlatformAdminShell`. Access controlled by `useIsPlatformAdmin` (`src/core/platform-admin/hooks.ts`) against the `platform_admins` table. All cross-tenant reads/writes go through `security definer` RPCs (`0011_platform_admin_rpcs.sql`) explicitly re-checking `is_platform_admin(auth.uid())`, never relaxed RLS.

Code: `src/core/platform-admin/` (24 files, `<area>-api.ts` + `<area>-hooks.ts` pairs) and route-level pages in `src/pages/Platform*.tsx`.

## Sections (all shipped)

| Section | Route | Tables | Notes |
|---|---|---|---|
| Tenants | `/platform-admin/tenants[,/:orgId]` | organizations, organization_members | Phase 1, `c2ceb74` |
| Audit Log | `/audit-log` | audit_logs | |
| Feature Flags | `/feature-flags` | feature_flags, org_feature_flags | Global + per-org override |
| Branding | `/branding` | platform_settings | Platform-wide defaults + per-tenant override, dedicated storage bucket |
| Subscriptions | `/subscriptions` | plans, subscriptions, coupons, invoices | Plans CRUD, coupons, manual invoicing, tenant subscription editor — **no payment provider** |
| Users | `/users` | organization_members, profiles | Platform-wide user directory |
| Roles | `/roles` | roles, permissions, role_permissions | Dynamic RBAC editor |
| Tickets | `/tickets[,/:ticketId]` | tickets + threaded messages | `is_internal` flag for platform-admin-only notes |
| Media | `/media` | files | Manages `axiondesk-assets` bucket |
| Notifications | `/notifications` | notifications, announcements, notification_channels | + maintenance_mode |
| AI Providers | `/ai-providers` | ai_providers, ai_prompt_templates, ai_usage_logs | Config only — no live LLM call path. See [06_AI/INDEX.md](../06_AI/INDEX.md) |
| System Health | `/system-health` | error_logs | In-app only, no Sentry/status page |
| Security | `/security` | audit_logs (naming fix) | See [10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md) |
| Developer Tools | `/developer-tools` | platform_api_keys, platform_webhooks, platform_edge_functions | Registry/catalog tables — not deployed API/webhooks/functions |
| CMS | `/cms` | cms_pages | Public page management |

## What's planned, not built

An "Industries" management section (create/edit/archive industries, assign default modules/KPIs/dashboards/roles/AI defaults) does not exist yet — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md). A Provider Management section beyond AI Providers (payments, comms, storage, analytics, maps, video, file providers) does not exist yet — see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).
