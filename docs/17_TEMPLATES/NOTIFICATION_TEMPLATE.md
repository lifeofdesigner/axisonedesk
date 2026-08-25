---
title: Notification Template
---
# NOTIFICATION_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_NOTIFICATION.md](../16_PLAYBOOKS/CREATE_NOTIFICATION.md). Trigger via a Postgres trigger function, following the real pattern in `notify_on_ticket_message()` (`0019_notifications.sql`):

```sql
create or replace function public.notify_on_<event>()
returns trigger
language plpgsql
security definer
as $$
begin
  perform public.notify_org_members(
    new.org_id,
    '<notification_type>',
    '<title>',
    '<body template referencing NEW.*>'
  );
  return new;
end;
$$;

create trigger notify_<event>
  after insert on public.<table>
  for each row execute function public.notify_on_<event>();
```
