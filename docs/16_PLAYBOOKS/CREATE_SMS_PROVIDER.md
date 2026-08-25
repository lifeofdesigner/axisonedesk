---
title: Create SMS Provider
---
# CREATE_SMS_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (target list: Twilio, Vonage, MessageBird).

## Purpose
Wire outbound SMS — currently **not implemented**.

## Workflow (delta)
Same pattern as [CREATE_EMAIL_PROVIDER.md](CREATE_EMAIL_PROVIDER.md): server-only send path, respects `notification_channels` preferences, credentials via Provider Registry. SMS additionally needs phone-number validation/formatting and cost-per-message awareness (track via a usage log similar to `ai_usage_logs`'s pattern) since it's a metered cost per send, unlike in-app notifications.

## Definition of Done
Generic DoD, plus: cost tracking wired before enabling for any tenant at scale.
