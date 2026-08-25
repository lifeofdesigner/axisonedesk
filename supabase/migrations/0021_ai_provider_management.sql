-- AI Provider Management — configuration layer only, per explicit instruction:
-- "no live LLM integration yet." Per ARCHITECTURE.md §15/§16, AI calls are
-- server-mediated via an Edge Function and provider API keys must live only
-- in Supabase Edge Function secrets, never in a client-readable table or the
-- client bundle. So this migration does NOT store API keys — it stores the
-- registry, active-provider selection, prompt templates, and usage/cost
-- tracking scaffolding a real integration will read from once an Edge
-- Function is wired up. Same "Ready for Connection" honesty pattern already
-- used for notification_channels.

create table public.ai_providers (
  key text primary key,
  label text not null,
  docs_url text,
  models jsonb not null default '[]'::jsonb,
  is_connected boolean not null default false,
  connected_at timestamptz,
  notes text
);

insert into public.ai_providers (key, label, docs_url, models) values
  ('openai', 'OpenAI', 'https://platform.openai.com/docs', '["gpt-4.1", "gpt-4.1-mini", "o4-mini"]'::jsonb),
  ('anthropic', 'Anthropic', 'https://docs.anthropic.com', '["claude-sonnet-5", "claude-opus-5", "claude-haiku-4-5"]'::jsonb),
  ('google_gemini', 'Google Gemini', 'https://ai.google.dev/docs', '["gemini-2.5-pro", "gemini-2.5-flash"]'::jsonb),
  ('azure_openai', 'Azure OpenAI', 'https://learn.microsoft.com/azure/ai-services/openai', '["gpt-4.1"]'::jsonb),
  ('deepseek', 'DeepSeek', 'https://api-docs.deepseek.com', '["deepseek-chat", "deepseek-reasoner"]'::jsonb),
  ('grok', 'Grok (xAI)', 'https://docs.x.ai', '["grok-4"]'::jsonb),
  ('ollama', 'Ollama (self-hosted)', 'https://ollama.com', '[]'::jsonb)
on conflict (key) do nothing;

alter table public.ai_providers enable row level security;

create policy "ai_providers_select_admin" on public.ai_providers
  for select using (public.is_platform_admin(auth.uid()));

-- Which provider/model the (future) ai-assistant Edge Function should use,
-- and whether the feature is globally on. Lives on the existing
-- platform_settings singleton alongside maintenance_mode.
alter table public.platform_settings add column active_ai_provider text references public.ai_providers(key);
alter table public.platform_settings add column ai_default_model text;
alter table public.platform_settings add column ai_assistant_enabled boolean not null default false;

-- Prompt templates: real content management for the (future) assistant's
-- system prompts, editable without a code deploy.
create table public.ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  description text,
  template text not null default '',
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.ai_prompt_templates enable row level security;

create policy "ai_prompt_templates_all_admin" on public.ai_prompt_templates
  for all using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

insert into public.ai_prompt_templates (key, label, description, template) values
  ('reporting_query', 'Reporting query', 'Natural-language reporting questions ("what were my top sellers last week?").', ''),
  ('inventory_reorder', 'Inventory reorder suggestions', 'Suggests reorder quantities from stock and sales velocity.', ''),
  ('crm_note_summary', 'CRM note summarization', 'Summarizes a customer''s note history.', '')
on conflict (key) do nothing;

-- Usage/cost tracking scaffolding — the table a real Edge Function call
-- will insert into once connected. Empty until then; no fabricated rows.
create table public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  user_id uuid references auth.users(id),
  provider_key text references public.ai_providers(key),
  model text,
  prompt_template_key text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd numeric(10, 4) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ai_usage_logs enable row level security;

create policy "ai_usage_logs_select_admin" on public.ai_usage_logs
  for select using (public.is_platform_admin(auth.uid()));

-- RPCs

create or replace function public.platform_list_ai_providers()
returns setof public.ai_providers
language sql
security definer
set search_path = public
as $$
  select * from public.ai_providers
  where public.is_platform_admin(auth.uid())
  order by label;
$$;

create or replace function public.platform_set_ai_provider_connected(
  p_key text, p_is_connected boolean, p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.ai_providers
  set is_connected = p_is_connected,
      connected_at = case when p_is_connected then now() else null end,
      notes = coalesce(p_notes, notes)
  where key = p_key;

  perform public.log_audit_event(
    null, 'ai_provider_connection_updated', 'ai_provider', null,
    jsonb_build_object('key', p_key, 'isConnected', p_is_connected)
  );
end;
$$;

create or replace function public.platform_upsert_ai_prompt_template(
  p_key text, p_label text, p_description text, p_template text
)
returns public.ai_prompt_templates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.ai_prompt_templates;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  insert into public.ai_prompt_templates (key, label, description, template, updated_by)
  values (p_key, p_label, p_description, p_template, auth.uid())
  on conflict (key) do update
    set label = excluded.label,
        description = excluded.description,
        template = excluded.template,
        updated_by = auth.uid(),
        updated_at = now()
  returning * into v_row;

  perform public.log_audit_event(
    null, 'ai_prompt_template_updated', 'ai_prompt_template', v_row.id,
    jsonb_build_object('key', p_key)
  );

  return v_row;
end;
$$;

create or replace function public.platform_update_ai_settings(
  p_active_provider text, p_default_model text, p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.platform_settings
  set active_ai_provider = p_active_provider,
      ai_default_model = p_default_model,
      ai_assistant_enabled = p_enabled
  where id = true;

  perform public.log_audit_event(
    null, 'ai_settings_updated', 'platform_settings', null,
    jsonb_build_object('provider', p_active_provider, 'model', p_default_model, 'enabled', p_enabled)
  );
end;
$$;

create or replace function public.platform_ai_usage_summary()
returns table (provider_key text, total_input_tokens bigint, total_output_tokens bigint, total_cost_usd numeric, call_count bigint)
language sql
security definer
set search_path = public
as $$
  select
    provider_key,
    coalesce(sum(input_tokens), 0) as total_input_tokens,
    coalesce(sum(output_tokens), 0) as total_output_tokens,
    coalesce(sum(cost_usd), 0) as total_cost_usd,
    count(*) as call_count
  from public.ai_usage_logs
  where public.is_platform_admin(auth.uid())
  group by provider_key;
$$;
