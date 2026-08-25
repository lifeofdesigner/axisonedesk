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
| 0026 | `0026_module_registry.sql` | modules (Module Registry metadata — Industry Engine Phase 1, see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)). **Applied to the live "Axis" project 2026-08-25**; `database.types.ts` regenerated via CLI and reconciled with the hand-authored version committed earlier the same day (content identical; CLI additionally revealed RPC scalar `Args` are non-nullable `string`, not `string | null` — `src/core/modules/api.ts` updated accordingly). Verified: 12 seeded rows present, `platform_upsert_module` confirmed rejecting a non-platform-admin caller. |
| 0027 | `0027_industry_registry.sql` | organization_types, organization_type_modules (Industry/Org-Type Registry + Templates — Industry Engine Phase 2, see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md)). Seeded with 14 target industries; module mappings seeded only for the 9 with a researched proposed default (see [docs/18_REFERENCE/INDUSTRY_REGISTRY.md](../18_REFERENCE/INDUSTRY_REGISTRY.md)) — the other 5 intentionally have zero mappings rather than a guess. Does not touch `organizations` (deferred to Phase 3). **Applied to the live "Axis" project 2026-08-25**, same verification as 0026: 14 organization_types rows, 42 organization_type_modules rows (matches the 9-industry seed exactly). |
| 0028 | `0028_organization_type_columns.sql` | Adds `organization_type_key` (FK to `organization_types`), `company_size`, `employee_count`, `branch_count`, `warehouse_count`, `country`, `preferred_language` to `organizations` — Industry Engine Phase 3a (schema-only foundation for the onboarding rewrite, deliberately not the rewrite itself; see ADR-008 in [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md)). All nullable, no backfill at the time. **Applied to the live "Axis" project 2026-08-25**, verified via direct schema query. |
| 0029 | `0029_onboarding_industry_picker.sql` | `feature_flags` row `onboarding.industry_registry_picker` (default OFF) + `create_organization_with_owner()` extended with optional `p_organization_type_key`. Industry Engine Phase 3b slice 1. **Applied to the live "Axis" project 2026-08-25.** |
| 0030 | `0030_fix_create_organization_overload.sql` | Corrective migration — `0029`'s `create or replace function` with an added parameter created a Postgres function *overload* rather than replacing the original 3-arg version (confirmed live: both existed simultaneously). Dropped the stale overload. **Applied to the live "Axis" project 2026-08-25.** |
| 0031 | `0031_canonical_organization_type.sql` | `organization_type_key` established as canonical (ADR-009, [docs/00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md)): adds `map_business_type_to_organization_type_key()` mapping function, backfills every existing organization's `organization_type_key` from `business_type`, updates `create_organization_with_owner()` so every new org always gets `organization_type_key` populated (explicit or mapped fallback), extends `list_platform_organizations()` with the new column (required drop+recreate — see migration comment for why `create or replace` failed here). **Applied to the live "Axis" project 2026-08-25**, backfill verified: all 3 existing orgs correctly mapped (`business_type='retail'` → `organization_type_key='retail'`). |
| 0032 | `0032_onboarding_full_profile.sql` | `create_organization_with_owner()` extended to persist company_size/employee_count/branch_count/warehouse_count/country/timezone/currency/preferred_language, apply the selected organization type's default module set as `org_feature_flags` rows, and log an `organization.created` audit event. Industry Engine Phase 3b slice 2 — see ADR-010. **Applied to the live "Axis" project 2026-08-25.** |
| 0033 | `0033_fix_create_organization_overload_2.sql` | Corrective migration — same overload bug as `0030` recurred when `0032` added parameters; dropped the stale 4-arg overload. **Applied to the live "Axis" project 2026-08-25.** |

## Tables (public schema, alphabetical, AxisOneDesk-owned)

ai_prompt_templates, ai_providers, ai_usage_logs, announcements, audit_logs, booking_resources, bookings, categories, cms_pages, coupons, customer_notes, customers, deals, error_logs, feature_flags, files, inventory_transactions, invoices, modules, notification_channels, notifications, order_events, order_items, order_notes, orders, org_feature_flags, organization_members, organization_types, organization_type_modules, organizations, permissions, plans, platform_admins, platform_api_keys, platform_edge_functions, platform_integrations, platform_settings, platform_webhooks, product_images, product_variants, products, profiles, purchase_order_items, purchase_orders, role_permissions, roles, shifts, staff, stock_adjustments, subscriptions, suppliers, and others alphabetically after `suppliers` not enumerated in the audit pass — regenerate/inspect `database.types.ts` directly for the exhaustive current list before relying on this as complete.

## RLS pattern

Established in `0001_init.sql`, reused throughout:

- `current_org_ids()` — SQL function returning the calling user's orgs via `organization_members`. Used to scope `select` policies: `org_id in (select current_org_ids())`.
- `has_permission(target_org_id uuid, permission_key text)` — used to scope write/manage policies, e.g. `organization_members_manage_admin` calls `has_permission(org_id, 'settings.manage_members')`.
- Cross-tenant platform-admin access never relaxes these — it goes through separate `security definer` RPC functions (see `0011_platform_admin_rpcs.sql`) with an explicit `is_platform_admin(auth.uid())` check inside the function body.

## RPC pattern

Multi-table writes that need atomicity go through Postgres RPCs rather than client-orchestrated multi-step writes — established by `adjust_stock` (`0003`), reused for order create/update (`0004`) and all platform-admin cross-tenant operations (`0011`). See ADR-001 in [00_ADOS/DECISIONS.md](../00_ADOS/DECISIONS.md).

## Storage

`axiondesk-assets` bucket (indexed by the `files` table since `0018_media_library.sql`) and a dedicated branding-assets bucket (`0013_branding.sql`). No other storage providers integrated — see [14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).
