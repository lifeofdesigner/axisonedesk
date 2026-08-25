/**
 * Tenant-facing feature flag resolution. Sketched in ARCHITECTURE.md §9/§3
 * ("enabled_modules: string[] computed value per org") — this is that
 * computation, finally backed by a real table instead of being hardcoded.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

/**
 * Reads a single global (non-module) flag's default_enabled value directly
 * — used pre-org (e.g. onboarding, before an org/activeOrgId exists), where
 * getEnabledModuleKeys' org-scoped override lookup doesn't apply.
 */
export async function getGlobalFlag(key: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("feature_flags")
    .select("default_enabled")
    .eq("key", key)
    .maybeSingle();
  if (error) throw toAppError(error);
  return data?.default_enabled ?? false;
}

export async function getEnabledModuleKeys(orgId: string): Promise<Set<string>> {
  const { data: flags, error: flagsError } = await supabase
    .from("feature_flags")
    .select("id, module_key, default_enabled")
    .not("module_key", "is", null);
  if (flagsError) throw toAppError(flagsError);

  const { data: overrides, error: overridesError } = await supabase
    .from("org_feature_flags")
    .select("flag_id, enabled")
    .eq("org_id", orgId);
  if (overridesError) throw toAppError(overridesError);

  const overrideByFlagId = new Map((overrides ?? []).map((o) => [o.flag_id, o.enabled]));

  const enabled = new Set<string>();
  for (const flag of flags ?? []) {
    if (!flag.module_key) continue;
    const isEnabled = overrideByFlagId.has(flag.id) ? overrideByFlagId.get(flag.id)! : flag.default_enabled;
    if (isEnabled) enabled.add(flag.module_key);
  }
  return enabled;
}
