import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

/**
 * Industry / Organization Type Registry — Industry Module Engine Phase 2.
 * See docs/18_REFERENCE/INDUSTRY_REGISTRY.md and
 * docs/18_REFERENCE/ORGANIZATION_TYPE_REGISTRY.md. "Organization type" and
 * "industry" are the same concept; this file covers both.
 */
export interface OrganizationType {
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  isSystemDefault: boolean;
  archivedAt: string | null;
}

export interface OrganizationTypeModule {
  organizationTypeKey: string;
  moduleKey: string;
  defaultEnabled: boolean;
  isOptional: boolean;
  isHidden: boolean;
}

function toOrganizationType(row: {
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_system_default: boolean;
  archived_at: string | null;
}): OrganizationType {
  return {
    key: row.key,
    name: row.name,
    description: row.description,
    icon: row.icon,
    isSystemDefault: row.is_system_default,
    archivedAt: row.archived_at,
  };
}

function toOrganizationTypeModule(row: {
  organization_type_key: string;
  module_key: string;
  default_enabled: boolean;
  is_optional: boolean;
  is_hidden: boolean;
}): OrganizationTypeModule {
  return {
    organizationTypeKey: row.organization_type_key,
    moduleKey: row.module_key,
    defaultEnabled: row.default_enabled,
    isOptional: row.is_optional,
    isHidden: row.is_hidden,
  };
}

export async function listOrganizationTypes(): Promise<OrganizationType[]> {
  const { data, error } = await supabase.from("organization_types").select("*").order("name");
  if (error) throw toAppError(error);
  return (data ?? []).map(toOrganizationType);
}

export async function listOrganizationTypeModules(organizationTypeKey: string): Promise<OrganizationTypeModule[]> {
  const { data, error } = await supabase
    .from("organization_type_modules")
    .select("*")
    .eq("organization_type_key", organizationTypeKey)
    .order("module_key");
  if (error) throw toAppError(error);
  return (data ?? []).map(toOrganizationTypeModule);
}

export async function upsertOrganizationType(input: Omit<OrganizationType, "archivedAt">): Promise<OrganizationType> {
  const { data, error } = await supabase.rpc("platform_upsert_organization_type", {
    p_key: input.key,
    p_name: input.name,
    p_description: input.description,
    p_icon: input.icon,
    p_is_system_default: input.isSystemDefault,
  });
  if (error) throw toAppError(error);
  return toOrganizationType(data);
}

export async function archiveOrganizationType(key: string): Promise<void> {
  const { error } = await supabase.rpc("platform_archive_organization_type", { p_key: key });
  if (error) throw toAppError(error);
}

export async function restoreOrganizationType(key: string): Promise<void> {
  const { error } = await supabase.rpc("platform_restore_organization_type", { p_key: key });
  if (error) throw toAppError(error);
}

export async function setOrganizationTypeModule(input: OrganizationTypeModule): Promise<OrganizationTypeModule> {
  const { data, error } = await supabase.rpc("platform_set_organization_type_module", {
    p_organization_type_key: input.organizationTypeKey,
    p_module_key: input.moduleKey,
    p_default_enabled: input.defaultEnabled,
    p_is_optional: input.isOptional,
    p_is_hidden: input.isHidden,
  });
  if (error) throw toAppError(error);
  return toOrganizationTypeModule(data);
}
