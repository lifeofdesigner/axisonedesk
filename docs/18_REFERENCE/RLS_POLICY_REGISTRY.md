---
title: RLS Policy Registry
last_updated: 2026-08-25
---

# RLS Policy Registry

Tables with at least one `create policy` in `supabase/migrations/*.sql`, 2026-08-25 — i.e. tables with RLS actively configured (not just `enable row level security` with no policies, which would deny all access).

`profiles` · `organizations` · `roles` · `permissions` · `role_permissions` · `organization_members` · `categories` · `suppliers` · `products` · `product_images` · `product_variants` · `stock_adjustments` · `inventory_transactions` · `customers` · `orders` · `order_items` · `order_notes` · `order_events` · `customer_notes` · `deals` · `booking_resources` · `bookings` · `purchase_orders` · `purchase_order_items` · `staff` · `shifts` · `timesheets` · `plans` · `subscriptions` · `platform_admins` · `audit_logs` · `feature_flags` · `org_feature_flags` · `storage.objects` · `platform_settings` · `coupons` · `invoices` · `support_tickets` · `support_ticket_messages` · `files` · `notifications` · `announcements` · `notification_channels` · `ai_providers` · `ai_prompt_templates` · `ai_usage_logs` · `error_logs` · `platform_integrations` · `cms_pages` · `platform_api_keys` · `platform_webhooks` · `webhook_deliveries` · `platform_edge_functions`

**52 tables with policies as of 2026-08-25.** Every new tenant table must appear here after following [16_PLAYBOOKS/CREATE_RLS_POLICY.md](../16_PLAYBOOKS/CREATE_RLS_POLICY.md) — if a table exists in [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md)'s table list but not here, that's a red flag worth investigating (either it's genuinely public/unrestricted by design, or RLS was missed).

## References
[16_PLAYBOOKS/CREATE_RLS_POLICY.md](../16_PLAYBOOKS/CREATE_RLS_POLICY.md) · [docs/03_DATABASE/INDEX.md](../03_DATABASE/INDEX.md) · [docs/10_SECURITY/INDEX.md](../10_SECURITY/INDEX.md)
