---
title: Create Notification
---
# CREATE_NOTIFICATION

Extends [_GENERIC_CREATE_WORKFLOW.md](_GENERIC_CREATE_WORKFLOW.md). See [17_TEMPLATES/NOTIFICATION_TEMPLATE.md](../17_TEMPLATES/NOTIFICATION_TEMPLATE.md).

## Purpose
Add a new in-app notification type, reusing the Notifications module built in `0019_notifications.sql`.

## Workflow (delta)
1. Trigger via `notify_org_members(...)` (see real usage in `notify_on_ticket_message()`, `0019_notifications.sql`) — a Postgres trigger function, not client-side notification creation, so notifications can't be spoofed or missed by an unreliable client.
2. Respect `notification_channels` preferences already modeled in the schema — don't bypass user opt-out.
3. Only in-app delivery exists today — email/SMS/push channels are **not wired** (see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Communication Providers). Don't claim a notification "sent an email" if it only wrote an in-app row.

## Documentation Updates (delta)
Add to [docs/18_REFERENCE/NOTIFICATION_REGISTRY.md](../18_REFERENCE/NOTIFICATION_REGISTRY.md).

## Definition of Done
Generic DoD.
