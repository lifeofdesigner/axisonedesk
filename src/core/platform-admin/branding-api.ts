import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { PlatformSettings } from "@/core/platform-settings/api";

export interface UpdatePlatformSettingsInput {
  platform_name?: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  support_email?: string;
  default_company_logo_url?: string;
  [key: string]: string | undefined;
}

export async function updatePlatformSettings(updates: UpdatePlatformSettingsInput): Promise<void> {
  const { error } = await supabase.rpc("update_platform_settings", { p_updates: updates });
  if (error) throw toAppError(error);
}

export async function updateOrgBranding(orgId: string, logoUrl: string | null, primaryColor: string | null): Promise<void> {
  const { error } = await supabase.rpc("platform_update_org_branding", {
    p_org_id: orgId,
    p_logo_url: logoUrl as unknown as string,
    p_primary_color: primaryColor as unknown as string,
  });
  if (error) throw toAppError(error);
}

/** Real upload to the axiondesk-assets Storage bucket — returns the public URL. */
export async function uploadBrandingAsset(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("axiondesk-assets").upload(path, file, { upsert: true });
  if (error) throw toAppError(error);
  const { data } = supabase.storage.from("axiondesk-assets").getPublicUrl(path);
  return data.publicUrl;
}

export type { PlatformSettings };
