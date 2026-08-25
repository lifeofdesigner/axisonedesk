---
title: Database
last_updated: 2026-08-25
---

# 03_DATABASE

Source of truth: `supabase/migrations/*.sql` (25 files) and the generated `src/core/supabase/database.types.ts` (regenerate via `supabase gen types typescript --linked` after any schema change — this file is committed, not gitignored).

**Ignore `factorymvp_*` tables** in `database.types.ts` — they belong to an unrelated project sharing the same Supabase instance, not AxisOneDesk. Never document them as part of this schema.

## Migration log

| # | File | Purpose |
|---|---|---|
| 0001 | `0001_init.sql` | organizations, organization_members, roles, permissions, role_permissions, profiles; RLS primitives `current_org_ids()`, `has_permission()` |
| 0002 | `0002_inventory.sql` | categories, suppliers, products, product_images, product_variants, stock_adjustments, inventory_transactions |
| 0003 | `0003_adjust_stock_rpc.sql` | atomic `adjust_stock` RPC (replaced a 5-round-trip client flow) |
| 0004 | `0004_orders.sql` | customers (provisional), orders, order_items, order_notes, order_events, create/update order RPCs |
| 0005 | `0005_crm.sql` | customer_notes, deals (extends customers) |
| 0006 | `0006_bookings.sql` | bookings, booking_resources |
| 0007 | `0007_purchasing.sql` | purchase_orders, purchase_order_items |
| 0008 | `0008_hr_staff.sql` | staff, shifts (manual timesheet log) |
| 0009 | `0009_billing.sql` | plans, subscriptions (real schema, read-only billing UI) |
| 0010 | `0010_platform_admin.sql` | platform_admins identity, audit_logs |
| 0011 | `0011_platform_admin_rpcs.sql` | cross-tenant RPCs, all `security definer` gated by `is_platform_admin(auth.uid())` |
| 0012 | `0012_feature_flags.sql` | feature_flags (global), org_feature_flags (per-org override) |
| 0013 | `0013_branding.sql` | platform_settings branding fields + per-tenant override, dedicated storage bucket |
| 0014 | `0014_subscription_licensing.sql` | coupons, invoices (manual ledger), plan/subscription admin RPCs. No live Stripe integration. |
| 0015 | `0015_user_role_management.sql` | browser-safe user listing vs service-role-only actions |
| 0016 | `0016_fix_platform_list_users.sql` | bugfix (missing `organization_members.id` in RPC output) |
| 0017 | `0017_support_center.sql` | tickets + threaded messages, `is_internal` flag |
| 0018 | `0018_media_library.sql` | files table indexing existing `axiondesk-assets` Storage bucket |
| 0019 | `0019_notifications.sql` | notifications, announcements, notification_channels, maintenance_mode columns |
| 0020 | `0020_extend_platform_settings_rpc.sql` | extends `update_platform_settings()` for maintenance fields |
| 0021 | `0021_ai_provider_management.sql` | ai_providers, ai_prompt_templates, ai_usage_logs — config tables only, no live LLM |
| 0022 | `0022_system_health_monitoring.sql` | error_logs, live DB stats; no Sentry, no formal SLA/status page |
| 0023 | `0023_security_center.sql` | audit-log naming-convention fix (`platform.` prefix) |
| 0024 | `0024_developer_tools.sql` | platform_api_keys, platform_webhooks, platform_edge_functions — a registry/catalog, not deployed functions (no custom REST/GraphQL backend; Supabase auto-generated PostgREST is used) |
| 0025 | `0025_cms.sql` | cms_pages (public-facing legal/help/marketing pages) |

## Tables (public schema, alphabetical, AxisOneDesk-owned)

ai_prompt_templates, ai_providers, ai_usage_logs, announcements, audit_logs, booking_resources, bookings, categories, cms_pages, coupons, customer_notes, customers, deals, error_logs, feature_flags, files, inventory_transactions, invoices, notification_channels, notifications, order_events, order_items, order_notes, orders, org_feature_flags, organization_members, organizations, permissions, plans, platform_admins, platform_api_keys, platform_edge_functions, platform_integrations, platform_settings, platform_webhooks, product_images, product_variants, products, profiles, purchase_order_items, purchase_orders, role_permissions, roles, shifts, staff, stock_adjustments, subscriptions, suppliers, and others alphabetically after `suppliers` not enumerated in the audit pass — regenerate/inspect `database.types.ts` directly for the exhaustive current list before relying on this as complete.

## RLS pattern

Established in `0001_init.sql`, reused throughout:

- `current_org_ids()` — SQL function returning the calling user's orgs via `organization_members`. Used to scope `select` policies: `org_id in (select current_org_ids())`.
- `has_permission(target_org_id uuid, permission_key text)` — used to scope write/manage policies, e.g. `organization_members_manage_admin` calls `has_permission(org_id, 'settings.manage_members')`.
- Cross-tenant platform-admin access never relaxes these — it goes through separate `security definer` RPC functions (see `0011_platform_admin_rpcs.sql`) with an explicit `is_platform_admin(auth.uid())` check inside the function body.

## RPC pattern

Multi-table writes that need atomicity go through Postgres RPCs rather than client-orchestrated multi-step writes — established by `adjust_stock` (`0003`), reused for order create/update (`0004`) and all platform-admin cross-tenant operations (`0011`). See ADR-001 in [00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md).

## Storage

`axiondesk-assets` bucket (indexed by the `files` table since `0018_media_library.sql`) and a dedicated branding-assets bucket (`0013_branding.sql`). No other storage providers integrated — see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).
