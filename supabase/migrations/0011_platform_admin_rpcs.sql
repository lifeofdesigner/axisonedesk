-- Platform Owner Portal: cross-tenant read/write RPCs. Every function here
-- explicitly checks is_platform_admin(auth.uid()) before touching anything
-- — these are security definer because a platform admin is deliberately NOT
-- a member of every org, so ordinary RLS would otherwise block all of this.
-- Kept as RPCs rather than modifying existing tenant-table RLS policies (see
-- 0010's header comment for the reasoning).

create or replace function public.platform_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  select jsonb_build_object(
    'total_companies', (select count(*) from public.organizations),
    'active_companies', (select count(*) from public.organizations where status = 'active' and deleted_at is null),
    'trialing_companies', (select count(*) from public.organizations where status = 'trialing' and deleted_at is null),
    'suspended_companies', (select count(*) from public.organizations where status = 'suspended' and deleted_at is null),
    'past_due_companies', (select count(*) from public.organizations where status = 'past_due' and deleted_at is null),
    'archived_companies', (select count(*) from public.organizations where status = 'archived' or deleted_at is not null),
    'total_users', (select count(*) from auth.users),
    'new_signups_30d', (select count(*) from public.organizations where created_at >= now() - interval '30 days'),
    'new_signups_prev_30d', (select count(*) from public.organizations where created_at >= now() - interval '60 days' and created_at < now() - interval '30 days'),
    'mrr', (
      select coalesce(sum(p.price_monthly), 0)
      from public.subscriptions s
      join public.plans p on p.id = s.plan_id
      join public.organizations o on o.id = s.org_id
      where s.status = 'active' and o.deleted_at is null
    ),
    'arr', (
      select coalesce(sum(p.price_monthly), 0) * 12
      from public.subscriptions s
      join public.plans p on p.id = s.plan_id
      join public.organizations o on o.id = s.org_id
      where s.status = 'active' and o.deleted_at is null
    ),
    'plan_breakdown', (
      select coalesce(jsonb_agg(jsonb_build_object('plan', p.name, 'count', cnt)), '[]'::jsonb)
      from (
        select plan_id, count(*) as cnt
        from public.subscriptions s
        join public.organizations o on o.id = s.org_id
        where o.deleted_at is null
        group by plan_id
      ) sub
      join public.plans p on p.id = sub.plan_id
    )
  ) into result;

  return result;
end;
$$;

grant execute on function public.platform_dashboard_stats() to authenticated;

create or replace function public.list_platform_organizations()
returns table (
  id uuid,
  name text,
  slug text,
  business_type text,
  status public.organization_status,
  created_at timestamptz,
  deleted_at timestamptz,
  plan_name text,
  member_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  return query
    select
      o.id, o.name, o.slug, o.business_type, o.status, o.created_at, o.deleted_at,
      p.name as plan_name,
      (select count(*) from public.organization_members om where om.org_id = o.id) as member_count
    from public.organizations o
    left join public.subscriptions s on s.org_id = o.id
    left join public.plans p on p.id = s.plan_id
    order by o.created_at desc;
end;
$$;

grant execute on function public.list_platform_organizations() to authenticated;

create or replace function public.get_platform_organization(p_org_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  select jsonb_build_object(
    'organization', to_jsonb(o.*),
    'plan_name', p.name,
    'subscription_status', s.status,
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', om.id, 'user_id', om.user_id, 'status', om.status,
        'role', r.name, 'full_name', pr.full_name, 'joined_at', om.joined_at
      )), '[]'::jsonb)
      from public.organization_members om
      join public.roles r on r.id = om.role_id
      left join public.profiles pr on pr.id = om.user_id
      where om.org_id = o.id
    )
  ) into result
  from public.organizations o
  left join public.subscriptions s on s.org_id = o.id
  left join public.plans p on p.id = s.plan_id
  where o.id = p_org_id;

  return result;
end;
$$;

grant execute on function public.get_platform_organization(uuid) to authenticated;

-- Tenant lifecycle actions. Each logs to audit_logs via log_audit_event.
create or replace function public.platform_set_organization_status(
  p_org_id uuid,
  p_status public.organization_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status public.organization_status;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  select status into v_old_status from public.organizations where id = p_org_id;
  if v_old_status is null then
    raise exception 'Organization not found';
  end if;

  update public.organizations set status = p_status where id = p_org_id;

  perform public.log_audit_event(
    p_org_id, 'platform.status_changed', 'organization', p_org_id,
    jsonb_build_object('old_status', v_old_status, 'new_status', p_status)
  );
end;
$$;

grant execute on function public.platform_set_organization_status(uuid, public.organization_status) to authenticated;

create or replace function public.platform_archive_organization(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.organizations set status = 'archived', deleted_at = now() where id = p_org_id;

  perform public.log_audit_event(p_org_id, 'platform.archived', 'organization', p_org_id, '{}'::jsonb);
end;
$$;

grant execute on function public.platform_archive_organization(uuid) to authenticated;

create or replace function public.platform_restore_organization(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.organizations set status = 'active', deleted_at = null where id = p_org_id;

  perform public.log_audit_event(p_org_id, 'platform.restored', 'organization', p_org_id, '{}'::jsonb);
end;
$$;

grant execute on function public.platform_restore_organization(uuid) to authenticated;

create or replace function public.platform_list_audit_logs(p_limit int default 100)
returns table (
  id uuid,
  org_id uuid,
  org_name text,
  actor_id uuid,
  actor_name text,
  action text,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  return query
    select
      al.id, al.org_id, o.name as org_name, al.actor_id,
      pr.full_name as actor_name, al.action, al.entity_type, al.entity_id,
      al.metadata, al.created_at
    from public.audit_logs al
    left join public.organizations o on o.id = al.org_id
    left join public.profiles pr on pr.id = al.actor_id
    order by al.created_at desc
    limit p_limit;
end;
$$;

grant execute on function public.platform_list_audit_logs(int) to authenticated;
