-- User & Role Management. Split deliberately by what's safe to expose to a
-- browser client vs. what genuinely needs the service_role key:
--
-- Browser-safe (this migration): viewing users platform-wide, suspending/
-- reactivating a user's membership in a specific org, granting/revoking
-- platform-admin, and full dynamic RBAC (create custom roles per org, edit
-- their permission grants) — all ordinary table writes a security-definer
-- RPC can do safely with an explicit is_platform_admin() check, same
-- pattern as everything else in this portal.
--
-- Deliberately NOT built here: delete user, force logout, password reset.
-- Those require Supabase's Admin API (auth.admin.*), which requires
-- service_role — exposing that to the browser bundle would violate
-- ARCHITECTURE.md §19 ("Secrets: never in client bundle"). Those actions
-- live in scripts/admin-tool/ instead, the same local-only, service_role-
-- backed tool already used to bootstrap the first platform admin.

create or replace function public.platform_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  is_platform_admin boolean,
  memberships jsonb
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
      u.id,
      u.email::text,
      p.full_name,
      u.created_at,
      exists(select 1 from public.platform_admins pa where pa.user_id = u.id) as is_platform_admin,
      coalesce(
        (select jsonb_agg(jsonb_build_object('orgId', om.org_id, 'orgName', o.name, 'role', r.name, 'status', om.status))
         from public.organization_members om
         join public.organizations o on o.id = om.org_id
         join public.roles r on r.id = om.role_id
         where om.user_id = u.id),
        '[]'::jsonb
      ) as memberships
    from auth.users u
    left join public.profiles p on p.id = u.id
    order by u.created_at desc;
end;
$$;

grant execute on function public.platform_list_users() to authenticated;

create or replace function public.platform_grant_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  insert into public.platform_admins (user_id, granted_by)
  values (p_user_id, auth.uid())
  on conflict (user_id) do nothing;

  perform public.log_audit_event(null, 'platform.admin_granted', 'user', p_user_id, '{}'::jsonb);
end;
$$;

grant execute on function public.platform_grant_admin(uuid) to authenticated;

create or replace function public.platform_revoke_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'Cannot revoke your own platform-admin access';
  end if;

  delete from public.platform_admins where user_id = p_user_id;

  perform public.log_audit_event(null, 'platform.admin_revoked', 'user', p_user_id, '{}'::jsonb);
end;
$$;

grant execute on function public.platform_revoke_admin(uuid) to authenticated;

create or replace function public.platform_set_member_status(p_org_id uuid, p_member_id uuid, p_status public.member_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.organization_members set status = p_status where id = p_member_id and org_id = p_org_id;

  perform public.log_audit_event(p_org_id, 'platform.member_status_changed', 'organization_member', p_member_id,
    jsonb_build_object('status', p_status));
end;
$$;

grant execute on function public.platform_set_member_status(uuid, uuid, public.member_status) to authenticated;

-- Dynamic RBAC: list all permissions (for building a role editor), create a
-- custom role for a specific org, and replace its permission grants.
create or replace function public.platform_list_permissions()
returns setof public.permissions
language sql
stable
security definer
set search_path = public
as $$
  select * from public.permissions order by module_key, key;
$$;

grant execute on function public.platform_list_permissions() to authenticated;

create or replace function public.platform_create_role(p_org_id uuid, p_name text, p_permission_ids uuid[])
returns public.roles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.roles;
  perm_id uuid;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  insert into public.roles (org_id, name, is_system_role)
  values (p_org_id, p_name, false)
  returning * into result;

  foreach perm_id in array p_permission_ids loop
    insert into public.role_permissions (role_id, permission_id) values (result.id, perm_id);
  end loop;

  perform public.log_audit_event(p_org_id, 'platform.role_created', 'role', result.id, jsonb_build_object('name', p_name));

  return result;
end;
$$;

grant execute on function public.platform_create_role(uuid, text, uuid[]) to authenticated;

create or replace function public.platform_update_role_permissions(p_role_id uuid, p_permission_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_is_system boolean;
  perm_id uuid;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  select org_id, is_system_role into v_org_id, v_is_system from public.roles where id = p_role_id;
  if v_is_system then
    raise exception 'Cannot edit permissions on a system role';
  end if;

  delete from public.role_permissions where role_id = p_role_id;

  foreach perm_id in array p_permission_ids loop
    insert into public.role_permissions (role_id, permission_id) values (p_role_id, perm_id);
  end loop;

  perform public.log_audit_event(v_org_id, 'platform.role_permissions_updated', 'role', p_role_id,
    jsonb_build_object('permission_count', array_length(p_permission_ids, 1)));
end;
$$;

grant execute on function public.platform_update_role_permissions(uuid, uuid[]) to authenticated;

create or replace function public.platform_list_org_roles(p_org_id uuid)
returns table (id uuid, name text, is_system_role boolean, permission_ids uuid[])
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  return query
    select r.id, r.name, r.is_system_role,
      coalesce((select array_agg(rp.permission_id) from public.role_permissions rp where rp.role_id = r.id), array[]::uuid[])
    from public.roles r
    where r.org_id = p_org_id or r.org_id is null
    order by r.is_system_role desc, r.name;
end;
$$;

grant execute on function public.platform_list_org_roles(uuid) to authenticated;
