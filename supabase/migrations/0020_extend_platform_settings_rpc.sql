-- Extend update_platform_settings() (0013_branding.sql) to also handle the
-- maintenance_mode/maintenance_message columns added in 0019_notifications.sql.
-- The original function's UPDATE statement predates those columns and would
-- silently ignore them if called with those keys — caught before this ever
-- shipped a broken maintenance-mode toggle. jsonb ->> and -> operators
-- return null for a missing key either way, so boolean/text coalescing both
-- need explicit handling (p_updates->>'maintenance_mode' is text 'true'/
-- 'false', cast via ::boolean).
create or replace function public.update_platform_settings(p_updates jsonb)
returns public.platform_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.platform_settings;
begin
  if not public.is_platform_admin(auth.uid()) then
    raise exception 'Not permitted';
  end if;

  update public.platform_settings set
    platform_name = coalesce(p_updates->>'platform_name', platform_name),
    logo_url = coalesce(p_updates->>'logo_url', logo_url),
    favicon_url = coalesce(p_updates->>'favicon_url', favicon_url),
    primary_color = coalesce(p_updates->>'primary_color', primary_color),
    secondary_color = coalesce(p_updates->>'secondary_color', secondary_color),
    accent_color = coalesce(p_updates->>'accent_color', accent_color),
    support_email = coalesce(p_updates->>'support_email', support_email),
    default_company_logo_url = coalesce(p_updates->>'default_company_logo_url', default_company_logo_url),
    maintenance_mode = coalesce((p_updates->>'maintenance_mode')::boolean, maintenance_mode),
    maintenance_message = case when p_updates ? 'maintenance_message' then p_updates->>'maintenance_message' else maintenance_message end
  where id = true
  returning * into result;

  perform public.log_audit_event(null, 'platform.branding_updated', 'platform_settings', null, p_updates);

  return result;
end;
$$;
