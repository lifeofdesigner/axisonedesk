---
title: Notification Registry
last_updated: 2026-08-25
---

# Notification Registry

From `0019_notifications.sql`: `notifications`, `announcements`, `notification_channels` tables. Known trigger-driven notification type as of 2026-08-25:

| Trigger | Function | Source |
|---|---|---|
| New support ticket message | `notify_on_ticket_message()` | `0019_notifications.sql` |

Generic dispatch: `notify_org_members(...)` — any new event-driven notification should call this rather than writing to `notifications` directly (see [16_PLAYBOOKS/CREATE_NOTIFICATION.md](../16_PLAYBOOKS/CREATE_NOTIFICATION.md)).

**Delivery channels**: in-app only. Email/SMS/push are not wired — see [docs/14_INTEGRATIONS/PROVIDER_MANAGEMENT.md](../14_INTEGRATIONS/PROVIDER_MANAGEMENT.md) Communication Providers.

## References
[16_PLAYBOOKS/CREATE_NOTIFICATION.md](../16_PLAYBOOKS/CREATE_NOTIFICATION.md) · [docs/17_TEMPLATES/NOTIFICATION_TEMPLATE.md](../17_TEMPLATES/NOTIFICATION_TEMPLATE.md)
