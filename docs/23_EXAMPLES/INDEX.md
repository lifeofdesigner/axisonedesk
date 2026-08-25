---
title: Worked Examples
last_updated: 2026-08-25
---

# 23_EXAMPLES

Concrete, real (not hypothetical) examples pointing at actual shipped code, so a playbook's abstract steps have a real reference implementation to compare against.

| Pattern | Real example in this repo |
|---|---|
| Module (api.ts + hooks.ts + components) | `src/modules/inventory/` — see [docs/04_MODULES/INDEX.md](../04_MODULES/INDEX.md) |
| Atomic multi-table write via RPC | `adjust_stock` RPC, `supabase/migrations/0003_adjust_stock_rpc.sql` |
| RLS policy pair (select + manage) | `organization_members` policies in `supabase/migrations/0001_init.sql` |
| Platform-admin cross-tenant RPC | `platform_list_organizations()`, `supabase/migrations/0011_platform_admin_rpcs.sql` |
| Feature-flag-gated route | `RequireModuleEnabled moduleKey="inventory"` around `/inventory*` in `src/router.tsx` |
| Config-only provider integration (not yet live) | `ai_providers` table + `/ai-providers` UI, `supabase/migrations/0021_ai_provider_management.sql` |
| Threaded conversation with internal-only notes | Support Center tickets, `supabase/migrations/0017_support_center.sql` |

When writing a new playbook or template, link to a real example here rather than inventing a hypothetical one.
