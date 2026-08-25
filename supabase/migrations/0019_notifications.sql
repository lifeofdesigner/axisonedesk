-- Notifications: the `notifications` table sketched in ARCHITECTURE.md §4/
-- §13 since Phase 0 ("In-app notification center... Realtime-subscribed...
-- for the primary MVP channel") but never built — same recurring gap.
-- Wires the Topbar bell icon (already in the UI, never connected to
-- anything) to real data, and hooks it into a real event (a support ticket
-- reply notifies the ticket's creator) rather than shipping an isolated
-- demo table nothing actually writes to.
--
-- Per §13, SMS/Push/WhatsApp are explicitly out of scope until a vertical
-- justifies the cost — this migration adds a notification_channels
-- registry so the platform admin UI can show real configuration status
-- ("Ready for Connection") without pretending any of them send anything.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  user_id uuid not null references auth.users(id),
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (user_id = auth.uid());

create policy "notifications_update_own" on public.notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- No client insert policy — notifications are system-generated only, via
-- this function (called from triggers or RPCs on real events).
create or replace function public.notify_org_members(
  p_org_id uuid, p_type text, p_title text, p_body text, p_exclude_user_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (org_id, user_id, type, title, body)
  select p_org_id, om.user_id, p_type, p_title, p_body
  from public.organization_members om
  where om.org_id = p_org_id
    and om.status = 'active'
    and (p_exclude_user_id is null or om.user_id <> p_exclude_user_id);
end;
$$;

-- Real hook: a non-internal reply on a support ticket notifies everyone in
-- the ticket's org except whoever just wrote the message (so the author
-- doesn't get notified about their own reply).
create or replace function public.notify_on_ticket_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_subject text;
begin
  if new.is_internal then
    return new;
  end if;

  select org_id, subject into v_org_id, v_subject from public.support_tickets where id = new.ticket_id;

  perform public.notify_org_members(
    v_org_id, 'support_ticket_reply', 'New reply: ' || v_subject,
    left(new.body, 140), new.author_id
  );

  return new;
end;
$$;

create trigger on_ticket_message_notify
  after insert on public.support_ticket_messages
  for each row execute function public.notify_on_ticket_message();

-- Platform-wide announcement banners.
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "announcements_select_all" on public.announcements
  for select using (true);

create policy "announcements_write_admin" on public.announcements
  for all using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

-- Maintenance mode lives on the existing platform_settings singleton.
alter table public.platform_settings add column maintenance_mode boolean not null default false;
alter table public.platform_settings add column maintenance_message text;

-- Notification channel registry — real UI state, no fake sending. Every
-- channel here is genuinely not connected; this just tracks that fact
-- instead of the platform admin having no visibility into it at all.
create table public.notification_channels (
  key text primary key,
  label text not null,
  is_connected boolean not null default false,
  config jsonb not null default '{}'::jsonb
);

insert into public.notification_channels (key, label) values
  ('email', 'Email'),
  ('sms', 'SMS'),
  ('whatsapp', 'WhatsApp'),
  ('push', 'Push notifications')
on conflict (key) do nothing;

alter table public.notification_channels enable row level security;

create policy "notification_channels_select_admin" on public.notification_channels
  for select using (public.is_platform_admin(auth.uid()));
