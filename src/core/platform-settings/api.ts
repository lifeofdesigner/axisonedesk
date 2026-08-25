/**
 * Public, session-independent platform branding read. Used by AuthLayout
 * (login/signup, before any session exists) and anywhere else in the app
 * that should reflect white-label settings — this is what makes Platform
 * Branding real rather than admin-only stored data with no visible effect.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface PlatformSettings {
  platformName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  supportEmail: string | null;
  defaultCompanyLogoUrl: string | null;
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const { data, error } = await supabase.from("platform_settings").select("*").eq("id", true).single();
  if (error) throw toAppError(error);
  return {
    platformName: data.platform_name,
    logoUrl: data.logo_url,
    faviconUrl: data.favicon_url,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    accentColor: data.accent_color,
    supportEmail: data.support_email,
    defaultCompanyLogoUrl: data.default_company_logo_url,
  };
}
