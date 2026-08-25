-- Fix: platform_list_users() (0015) omitted organization_members.id from
-- each membership, but the UI needs it to target a specific membership row
-- for platform_set_member_status(). Caught before this ever shipped to
-- users — the membership status dropdown would have had no valid id to
-- update.
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
        (select jsonb_agg(jsonb_build_object('membershipId', om.id, 'orgId', om.org_id, 'orgName', o.name, 'role', r.name, 'status', om.status))
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
