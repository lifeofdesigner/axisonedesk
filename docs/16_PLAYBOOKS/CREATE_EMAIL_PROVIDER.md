---
title: Create Email Provider
---
# CREATE_EMAIL_PROVIDER

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md) and [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) (Communication Providers section — target list: SendGrid, Mailgun, SES, Resend, Postmark).

## Purpose
Wire outbound transactional email — currently **not implemented**; only in-app notifications exist (`0019_notifications.sql`).

## Workflow (delta)
1. Server-only send path (Edge Function), never client-side.
2. Reuse `notification_channels` preferences already in the schema to respect opt-in/opt-out rather than emailing unconditionally.
3. Template management should extend the existing `ai_prompt_templates`-style pattern conceptually (versioned, editable via Platform Owner Portal) rather than hardcoding email copy in code — exact table design TBD at implementation time.

## Definition of Done
Generic DoD, plus: a real email is confirmed delivered (not just "API call returned 200") during testing.
