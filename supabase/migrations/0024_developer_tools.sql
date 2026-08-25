-- Developer Tools — platform-owner-facing tooling, not a tenant-facing
-- public API. Per ARCHITECTURE.md §16 there is "no custom REST/GraphQL
-- backend at MVP — the Supabase auto-generated PostgREST API is the
-- primary data interface", and data export/API access for integrations is
-- explicitly Phase 5. So this does not fabricate a working gateway:
--
-- - platform_api_keys are real, hashed (sha256 via pgcrypto), revocable
--   tokens the platform owner can issue for their own scripts/tooling —
--   but nothing currently validates them against requests, since no
--   gateway/Edge Function exists to do so yet. Honestly labeled in the UI.
-- - platform_webhooks + webhook_deliveries are real, stored config for
--   outgoing webhooks (e.g. "notify Slack on new tenant signup") — the
--   dispatcher that would actually fire them is a not-yet-built Edge
--   Function, so webhook_deliveries stays empty until then, matching the
--   ai_usage_logs/error_logs scaffolding pattern already used twice this
--   session.
-- - platform_edge_functions is an honest deployment-status registry for
--   the Edge Functions named in ARCHITECTURE.md (ai-assistant,
--   stripe-webhook) plus the webhook-dispatcher this migration implies —
--   all seeded as not deployed, because none are.

create table public.platform_api_keys (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  key_prefix text not null,
  key_hash text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);

alter table public.platform_api_keys enable row level security;

create policy "platform_api_keys_all_admin" on public.platform_api_keys
  for all using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

-- Returns the raw key exactly once — only the sha256 hash is ever stored.
-- Mirrors the standard personal-access-token pattern.
create or replace function public.platform_create_api_key(p_label text)
returns table (id uuid, raw_key text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_raw text;
  v_prefix text;
  v_id uuid;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  v_raw := 'axd_' || encode(extensions.gen_random_bytes(24), 'hex');
  v_prefix := left(v_raw, 12);

  insert into public.platform_api_keys (label, key_prefix, key_hash, created_by)
  values (p_label, v_prefix, encode(extensions.digest(v_raw, 'sha256'), 'hex'), auth.uid())
  returning platform_api_keys.id into v_id;

  perform public.log_audit_event(null, 'platform.api_key_created', 'platform_api_key', v_id, jsonb_build_object('label', p_label));

  return query select v_id, v_raw;
end;
$$;

create or replace function public.platform_revoke_api_key(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.platform_api_keys set revoked_at = now() where id = p_id;

  perform public.log_audit_event(null, 'platform.api_key_revoked', 'platform_api_key', p_id, '{}'::jsonb);
end;
$$;

create table public.platform_webhooks (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  secret text not null default encode(extensions.gen_random_bytes(16), 'hex'),
  event_types text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.platform_webhooks enable row level security;

create policy "platform_webhooks_all_admin" on public.platform_webhooks
  for all using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

create table public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  webhook_id uuid not null references public.platform_webhooks(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'delivered', 'failed')),
  response_code int,
  created_at timestamptz not null default now()
);

alter table public.webhook_deliveries enable row level security;

create policy "webhook_deliveries_select_admin" on public.webhook_deliveries
  for select using (public.is_platform_admin(auth.uid()));

create table public.platform_edge_functions (
  key text primary key,
  label text not null,
  description text not null,
  is_deployed boolean not null default false,
  docs_url text
);

insert into public.platform_edge_functions (key, label, description, docs_url) values
  ('ai-assistant', 'ai-assistant', 'Server-mediated AI capability calls — no LLM key ever ships to the client.', 'https://supabase.com/docs/guides/functions'),
  ('stripe-webhook', 'stripe-webhook', 'Handles checkout.session.completed, subscription updates, invoice.payment_failed from Stripe.', 'https://supabase.com/docs/guides/functions'),
  ('webhook-dispatcher', 'webhook-dispatcher', 'Would fire the outgoing webhooks configured below on real platform events.', 'https://supabase.com/docs/guides/functions')
on conflict (key) do nothing;

alter table public.platform_edge_functions enable row level security;

create policy "platform_edge_functions_select_admin" on public.platform_edge_functions
  for select using (public.is_platform_admin(auth.uid()));

create or replace function public.platform_set_edge_function_deployed(p_key text, p_is_deployed boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.platform_edge_functions set is_deployed = p_is_deployed where key = p_key;

  perform public.log_audit_event(
    null, 'platform.edge_function_deployment_updated', 'platform_edge_function', null,
    jsonb_build_object('key', p_key, 'isDeployed', p_is_deployed)
  );
end;
$$;
