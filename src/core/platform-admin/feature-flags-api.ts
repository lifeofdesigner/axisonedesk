import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface PlatformFeatureFlag {
  id: string;
  key: string;
  moduleKey: string | null;
  description: string;
  defaultEnabled: boolean;
}

export interface OrgFlagOverride {
  orgId: string;
  flagId: string;
  enabled: boolean;
}

export async function listFlags(): Promise<PlatformFeatureFlag[]> {
  const { data, error } = await supabase.from("feature_flags").select("*").order("key");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    key: r.key,
    moduleKey: r.module_key,
    description: r.description,
    defaultEnabled: r.default_enabled,
  }));
}

export async function listAllOverrides(): Promise<OrgFlagOverride[]> {
  const { data, error } = await supabase.from("org_feature_flags").select("org_id, flag_id, enabled");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({ orgId: r.org_id, flagId: r.flag_id, enabled: r.enabled }));
}

export async function setFlagDefault(flagId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase.rpc("platform_set_flag_default", { p_flag_id: flagId, p_enabled: enabled });
  if (error) throw toAppError(error);
}

export async function setOrgFlagOverride(orgId: string, flagId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase.rpc("platform_set_org_flag_override", {
    p_org_id: orgId,
    p_flag_id: flagId,
    p_enabled: enabled,
  });
  if (error) throw toAppError(error);
}

export async function clearOrgFlagOverride(orgId: string, flagId: string): Promise<void> {
  const { error } = await supabase.rpc("platform_clear_org_flag_override", { p_org_id: orgId, p_flag_id: flagId });
  if (error) throw toAppError(error);
}
