---
title: Create White-Label Feature
---
# CREATE_WHITE_LABEL_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Extend branding/white-label customization (logo, theme, colors, typography, email/invoice/receipt branding).

## Current state
`platform_settings` (`0013_branding.sql`) supports platform-wide defaults + per-tenant override for logo/theme today. Email/invoice/receipt branding specifically is **not confirmed implemented** — verify against `platform_settings`'s actual columns before assuming those exist; if not, this playbook is how to add them.

## Workflow (delta)
1. Extend `platform_settings` (additive columns via migration) rather than a new branding table — keep one Source of Truth for branding config.
2. Update via `update_platform_settings(...)`/`platform_update_org_branding(...)` (`0013_branding.sql`) — extend these RPCs rather than writing new ones for new branding fields.
3. Any new white-label surface (e.g. invoice branding) must respect per-tenant override, not just platform default — that's the whole point of this feature (see [.ai/02_INDUSTRY_ENGINE.md](../../.ai/02_INDUSTRY_ENGINE.md) White-Label Compatibility note).

## Definition of Done
Generic DoD, plus: verified a tenant's override actually takes precedence over the platform default in the rendered output.
