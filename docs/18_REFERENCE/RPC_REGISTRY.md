---
title: RPC Registry
last_updated: 2026-08-25
---

# RPC Registry

Every `create or replace function` in `supabase/migrations/*.sql`, 2026-08-25. Where a function was redefined in a later migration, the later file is the effective/current version — both are noted.

## Core / shared
`set_updated_at()` · `handle_new_user()` · `current_org_ids()` · `has_permission(target_org_id, permission_key)` · `create_organization_with_owner(org_name, org_slug, org_business_type)` (`0001_init.sql`, redefined `0009_billing.sql`)

## Inventory
`log_inventory_transaction_from_adjustment()` (`0002`) · `adjust_stock(...)` (`0003`)

## Orders
`assign_order_number()` · `log_order_status_change()` · `log_order_note_event()` · `create_order(...)` · `update_order_status(...)` (all `0004_orders.sql`)

## Purchasing
`receive_purchase_order(p_org_id, p_purchase_order_id)` (`0007`)

## Platform Admin — core
`is_platform_admin(p_user_id)` · `log_audit_event(...)` (`0010`) · `platform_dashboard_stats()` · `list_platform_organizations()` · `get_platform_organization(p_org_id)` · `platform_set_organization_status(...)` · `platform_archive_organization(p_org_id)` · `platform_restore_organization(p_org_id)` · `platform_list_audit_logs(p_limit)` (all `0011_platform_admin_rpcs.sql`)

## Feature Flags
`platform_set_flag_default(p_flag_id, p_enabled)` · `platform_set_org_flag_override(p_org_id, p_flag_id, p_enabled)` · `platform_clear_org_flag_override(p_org_id, p_flag_id)` (`0012`)

## Branding
`update_platform_settings(p_updates)` (`0013`, redefined `0020_extend_platform_settings_rpc.sql`) · `platform_update_org_branding(p_org_id, p_logo_url, p_primary_color)` (`0013`)

## Subscription & Licensing
`platform_upsert_plan(...)` · `platform_update_subscription(...)` · `platform_upsert_coupon(...)` · `platform_upsert_invoice(...)` · `platform_list_plans()` · `platform_list_coupons()` · `platform_list_invoices()` (all `0014`)

## User & Role Management
`platform_list_users()` (`0015`, redefined `0016_fix_platform_list_users.sql`) · `platform_grant_admin(p_user_id)` · `platform_revoke_admin(p_user_id)` · `platform_set_member_status(p_org_id, p_member_id, p_status)` · `platform_list_permissions()` · `platform_create_role(p_org_id, p_name, p_permission_ids)` · `platform_update_role_permissions(p_role_id, p_permission_ids)` · `platform_list_org_roles(p_org_id)` (all `0015`)

## Support Center
`platform_list_tickets()` · `platform_update_ticket(...)` (`0017`)

## Notifications
`notify_org_members(...)` · `notify_on_ticket_message()` (`0019`)

## AI Provider Management
`platform_list_ai_providers()` (`0021`) · `platform_set_ai_provider_connected(...)` (`0021`, redefined `0023`) · `platform_upsert_ai_prompt_template(...)` (`0021`, redefined `0023`) · `platform_update_ai_settings(...)` (`0021`, redefined `0023`) · `platform_ai_usage_summary()` (`0021`)

## System Health
`platform_resolve_error_log(p_id, p_resolved)` · `platform_system_health()` (`0022`) · `platform_set_integration_connected(p_key, p_is_connected)` (`0022`, redefined `0023`)

## Security Center
`platform_rls_coverage()` · `platform_security_events(p_limit)` (`0023`)

## Developer Tools
`platform_create_api_key(p_label)` · `platform_revoke_api_key(p_id)` · `platform_set_edge_function_deployed(p_key, p_is_deployed)` (`0024`)

## CMS
`platform_list_cms_pages()` · `platform_upsert_cms_page(...)` · `platform_delete_cms_page(p_id)` (`0025`)

## Module Registry (live — see `docs/18_REFERENCE/MODULE_REGISTRY.md`)
`platform_list_modules()` · `platform_upsert_module(...)` (`0026`)

## Industry / Organization Type Registry (live — see `docs/18_REFERENCE/INDUSTRY_REGISTRY.md`)
`platform_list_organization_types()` · `platform_list_organization_type_modules(p_organization_type_key)` · `platform_upsert_organization_type(...)` · `platform_archive_organization_type(p_key)` · `platform_restore_organization_type(p_key)` · `platform_set_organization_type_module(...)` (`0027`)

## References
[16_PLAYBOOKS/CREATE_SUPABASE_RPC.md](../16_PLAYBOOKS/CREATE_SUPABASE_RPC.md) · [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)
