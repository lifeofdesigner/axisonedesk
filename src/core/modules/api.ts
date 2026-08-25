import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface ModuleDefinition {
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  route: string | null;
  dependencies: string[];
  requiredPermissions: string[];
  featureFlagKey: string | null;
  supportedIndustries: string[];
  subscriptionRequirement: string | null;
  displayOrder: number;
  enabled: boolean;
}

function toModuleDefinition(row: {
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  route: string | null;
  dependencies: unknown;
  required_permissions: unknown;
  feature_flag_key: string | null;
  supported_industries: unknown;
  subscription_requirement: string | null;
  display_order: number;
  enabled: boolean;
}): ModuleDefinition {
  return {
    key: row.key,
    name: row.name,
    description: row.description,
    category: row.category,
    icon: row.icon,
    route: row.route,
    dependencies: Array.isArray(row.dependencies) ? (row.dependencies as string[]) : [],
    requiredPermissions: Array.isArray(row.required_permissions) ? (row.required_permissions as string[]) : [],
    featureFlagKey: row.feature_flag_key,
    supportedIndustries: Array.isArray(row.supported_industries) ? (row.supported_industries as string[]) : [],
    subscriptionRequirement: row.subscription_requirement,
    displayOrder: row.display_order,
    enabled: row.enabled,
  };
}

/**
 * Reads the Module Registry (docs/18_REFERENCE/MODULE_REGISTRY.md).
 * This is metadata only — it does not gate access. Module on/off state
 * remains feature_flags/org_feature_flags via RequireModuleEnabled, per
 * the additive design in supabase/migrations/0026_module_registry.sql.
 */
export async function listModules(): Promise<ModuleDefinition[]> {
  const { data, error } = await supabase.from("modules").select("*").order("display_order");
  if (error) throw toAppError(error);
  return (data ?? []).map(toModuleDefinition);
}

export async function upsertModule(input: ModuleDefinition): Promise<ModuleDefinition> {
  const { data, error } = await supabase.rpc("platform_upsert_module", {
    p_key: input.key,
    p_name: input.name,
    p_description: input.description,
    p_category: input.category,
    p_icon: input.icon,
    p_route: input.route,
    p_dependencies: input.dependencies,
    p_required_permissions: input.requiredPermissions,
    p_feature_flag_key: input.featureFlagKey,
    p_supported_industries: input.supportedIndustries,
    p_subscription_requirement: input.subscriptionRequirement,
    p_display_order: input.displayOrder,
    p_enabled: input.enabled,
  });
  if (error) throw toAppError(error);
  return toModuleDefinition(data);
}
