---
title: Product Bible
last_updated: 2026-08-25
---

# 01_PRODUCT — Product Bible

## What AxisOneDesk is

A multi-tenant Business Operating System (ERP-style) delivered as a single SPA. One organization = one tenant, isolated via Postgres RLS. Each tenant gets: Inventory, Orders, CRM, Bookings, Purchasing, HR & Staff, Reports, Billing, an AI Assistant (currently a disabled shell), and a Dashboard. A separate Platform Owner Portal lets AxisOneDesk's own operators manage all tenants, subscriptions, feature flags, branding, support, and platform configuration. See [02_ARCHITECTURE/INDEX.md](../02_ARCHITECTURE/INDEX.md).

## Business model (as implemented)

Subscription SaaS with plans (`plans` table: price_monthly/yearly, seat_limit, module_limits) and per-org `subscriptions`. **No live payment provider is integrated** — billing today is a manually-managed ledger (coupons, manual invoices) operated from the Platform Owner Portal, not a self-serve checkout. See [08_BILLING/INDEX.md](../08_BILLING/INDEX.md).

## Customer personas (inferred from the shipped module set, not from a documented persona study)

- **Small/mid business owner** running inventory + orders + a handful of staff — the modules built first (Inventory, Orders, CRM) map most directly to this persona.
- **Platform operator (AxisOneDesk itself)** — the Platform Owner Portal's breadth (tenants, subscriptions, support, branding, feature flags, security, dev tools) implies a real internal-ops persona was designed for, distinct from tenant end users.

No formal persona documentation exists in the repo; this section should be replaced with real research if/when it exists rather than expanded speculatively.

## Competitive positioning

Not documented in the repo. Do not fabricate a competitive analysis — if this is needed, it should come from the user/business side, not be inferred from code.

## Industry templates

**Not implemented.** All tenants currently get the identical module set and generic dashboard regardless of business type. This is the gap the planned Industry Module Engine addresses — see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) and [ROADMAP.md](../00_ADOS/ROADMAP.md).

## White-label

Implemented: platform-wide branding defaults with per-tenant override (`platform_settings`, migration `0013_branding.sql`) — logo/theme customization exists. See [05_PLATFORM_OWNER/INDEX.md](../05_PLATFORM_OWNER/INDEX.md).

## Pricing model

Plan records exist (`plans` table) but actual pricing figures are operational data, not something to hardcode into documentation — see the live `plans` table via the Platform Owner Portal Subscriptions section for current pricing.
