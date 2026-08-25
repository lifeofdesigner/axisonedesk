-- Fix: 0021/0022 logged audit events without the established 'platform.'
-- action-name prefix used by every other platform-admin mutation (see
-- 'platform.admin_granted', 'platform.role_created', etc. in 0010-0020).
-- Already applied, so fixed via create-or-replace here rather than editing
-- those files — same pattern as 0016 fixing 0015.
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
    null, 'platform.ai_provider_connection_updated', 'ai_provider', null,
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
    null, 'platform.ai_prompt_template_updated', 'ai_prompt_template', v_row.id,
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
    null, 'platform.ai_settings_updated', 'platform_settings', null,
    jsonb_build_object('provider', p_active_provider, 'model', p_default_model, 'enabled', p_enabled)
  );
end;
$$;

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
    null, 'platform.integration_connection_updated', 'platform_integration', null,
    jsonb_build_object('key', p_key, 'isConnected', p_is_connected)
  );
end;
$$;

-- Security Center.
--
-- Distinct from the existing Audit Log page (which shows every logged
-- action across the platform): this is a security-focused view — an RLS
-- coverage check (computed live against pg_catalog, not a static checklist)
-- and a filtered feed of only the security-relevant subset of the same
-- audit_logs table (admin grants/revokes, role/permission changes, member
-- status changes). Reuses audit_logs as the source of truth rather than a
-- parallel table.

-- Turns the manual code-review checklist item from ARCHITECTURE.md §10
-- ("any new table PR must include its RLS policies... a checklist item in
-- code review confirms RLS is enabled before merge") into a live,
-- self-auditing check instead of a human-only process.
create or replace function public.platform_rls_coverage()
returns table (table_name text, rls_enabled boolean, policy_count bigint)
language sql
security definer
set search_path = public
as $$
  select
    c.relname::text,
    c.relrowsecurity,
    (select count(*) from pg_policy p where p.polrelid = c.oid)
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and public.is_platform_admin(auth.uid())
  order by c.relname;
$$;

create or replace function public.platform_security_events(p_limit int default 50)
returns table (
  id uuid, actor_id uuid, actor_email text, action text, entity_type text,
  entity_id uuid, metadata jsonb, created_at timestamptz
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
  select al.id, al.actor_id, u.email::text, al.action, al.entity_type, al.entity_id, al.metadata, al.created_at
  from public.audit_logs al
  left join auth.users u on u.id = al.actor_id
  where al.action in (
    'platform.admin_granted', 'platform.admin_revoked', 'platform.role_created',
    'platform.role_permissions_updated', 'platform.member_status_changed'
  )
  order by al.created_at desc
  limit p_limit;
end;
$$;
