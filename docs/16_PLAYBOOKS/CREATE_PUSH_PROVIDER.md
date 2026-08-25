---
title: Create Push Notification Provider
---
# CREATE_PUSH_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md).

## Purpose
Wire push notifications — currently **not implemented**, and has no client to push to yet (no mobile app exists — see [.ai/06_MOBILE_APPS.md](../../.ai/06_MOBILE_APPS.md)). Web push to the browser is possible independent of mobile, if that's the actual need.

## Workflow (delta)
1. Requires a device/subscription token store (`push_tokens` table, not yet designed — see [.ai/06_MOBILE_APPS.md](../../.ai/06_MOBILE_APPS.md) Required Database Changes).
2. Server-only send path via provider SDK/API in an Edge Function.
3. Respect `notification_channels` preferences.

## Definition of Done
Generic DoD. Don't build this ahead of having an actual push-capable client (mobile app or web push registration) to target.
