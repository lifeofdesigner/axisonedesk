---
title: Create Analytics Feature
---
# CREATE_ANALYTICS_FEATURE

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md).

## Purpose
Add analytics tracking or an analytics-driven feature.

## Current state
No analytics provider is wired (no GA/PostHog/Mixpanel/etc. dependency exists) — see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Analytics Providers section.

## Workflow (delta)
1. Pick and wire one analytics provider via the Provider Registry pattern (once built) rather than embedding a vendor SDK ad hoc in `index.html` or a component.
2. Respect tenant/user privacy — analytics events must not leak cross-tenant data or PII beyond what's explicitly needed.
3. In-app product analytics (module usage, feature adoption) is a distinct need from public-website marketing analytics (see [.ai/03_PUBLIC_WEBSITE.md](../../.ai/03_PUBLIC_WEBSITE.md)) — don't conflate the two when choosing a provider/config.

## Definition of Done
Generic DoD.
