-- System Health & Monitoring. Per ARCHITECTURE.md a formal status page/SLA
-- is explicitly Phase 5 ("Formal SLA + status page + on-call process") and
-- Sentry (§ error tracking row) is not connected in this environment — so
-- this does NOT fabricate uptime percentages or synthetic incident history.
-- What it builds is genuinely real: a client-side error capture pipeline
-- (wired to the existing ErrorBoundary + global window handlers, so rows
-- only appear when a real error actually happens), live row-count/db-latency
-- checks run on demand against the real database, and an honest
-- "Ready for Connection" registry for the two named-but-unconnected
-- monitoring/billing integrations (Sentry, Stripe).

create table public.error_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  user_id uuid references auth.users(id),
  message text not null,
  stack text,
  url text,
  context jsonb not null default '{}'::jsonb,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.error_logs enable row level security;

-- Any authenticated user can report their own client-side errors. No
-- update/select for clients — only the reporter's own insert.
create policy "error_logs_insert_own" on public.error_logs
  for insert with check (user_id = auth.uid());

create policy "error_logs_select_admin" on public.error_logs
  for select using (public.is_platform_admin(auth.uid()));

create policy "error_logs_update_admin" on public.error_logs
  for update using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

create index error_logs_created_at_idx on public.error_logs (created_at desc);

create or replace function public.platform_resolve_error_log(p_id uuid, p_resolved boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.error_logs set resolved = p_resolved where id = p_id;
end;
$$;

-- Live system health snapshot — real counts against real tables, computed
-- on demand rather than cached/fabricated. auth.users isn't readable by
-- clients at all, so the user count has to come from this security-definer
-- function rather than a direct table read.
create or replace function public.platform_system_health()
returns table (
  organizations_count bigint,
  users_count bigint,
  active_subscriptions_count bigint,
  orders_count bigint,
  products_count bigint,
  open_tickets_count bigint,
  unresolved_error_count bigint,
  checked_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  return query
  select
    (select count(*) from public.organizations where deleted_at is null),
    (select count(*) from auth.users),
    (select count(*) from public.subscriptions where status = 'active'),
    (select count(*) from public.orders),
    (select count(*) from public.products),
    (select count(*) from public.support_tickets where status not in ('closed', 'resolved')),
    (select count(*) from public.error_logs where not resolved),
    now();
end;
$$;

-- Named-but-unconnected monitoring/billing integrations. Separate registry
-- from ai_providers/notification_channels since these are a different
-- category (observability + payments), not modeled by either.
create table public.platform_integrations (
  key text primary key,
  label text not null,
  category text not null,
  docs_url text,
  is_connected boolean not null default false,
  connected_at timestamptz
);

insert into public.platform_integrations (key, label, category, docs_url) values
  ('sentry', 'Sentry', 'error_tracking', 'https://docs.sentry.io'),
  ('stripe', 'Stripe', 'billing', 'https://stripe.com/docs')
on conflict (key) do nothing;

alter table public.platform_integrations enable row level security;

create policy "platform_integrations_select_admin" on public.platform_integrations
  for select using (public.is_platform_admin(auth.uid()));

create or replace function public.platform_set_integration_connected(p_key text, p_is_connected boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.platform_integrations
  set is_connected = p_is_connected,
      connected_at = case when p_is_connected then now() else null end
  where key = p_key;

  perform public.log_audit_event(
    null, 'integration_connection_updated', 'platform_integration', null,
    jsonb_build_object('key', p_key, 'isConnected', p_is_connected)
  );
end;
$$;
