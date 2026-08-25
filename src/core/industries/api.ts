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

/**
 * Dynamic Experience Engine config — Industry Module Engine Phase 4 slice 1
 * (supabase/migrations/0034_experience_config.sql). Only 6 of 14
 * organization_types have real seeded content; every field here is
 * genuinely optional and every consumer must handle "no config" (null,
 * empty array, missing key) as the normal case, not an error — see ADR-011,
 * docs/00_ADOS/DECISIONS.md, for exactly which industries have content and
 * why the rest don't (no fabricated defaults).
 */
export interface KpiDefinition {
  key: string;
  label: string;
}

export interface QuickAction {
  key: string;
  label: string;
  route: string;
}

export interface ExperienceConfig {
  kpis: KpiDefinition[];
  quickActions: QuickAction[];
  emptyStates: Record<string, string>;
}

function toExperienceConfig(raw: unknown): ExperienceConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<ExperienceConfig>;
  return {
    kpis: Array.isArray(r.kpis) ? r.kpis : [],
    quickActions: Array.isArray(r.quickActions) ? r.quickActions : [],
    emptyStates: r.emptyStates && typeof r.emptyStates === "object" ? r.emptyStates : {},
  };
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

export async function getExperienceConfig(organizationTypeKey: string): Promise<ExperienceConfig | null> {
  const { data, error } = await supabase
    .from("organization_types")
    .select("experience_config")
    .eq("key", organizationTypeKey)
    .maybeSingle();
  if (error) throw toAppError(error);
  return toExperienceConfig(data?.experience_config);
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
  // See the comment in src/core/modules/api.ts upsertModule — same
  // generated-Args-nullability caveat applies here.
  const { data, error } = await supabase.rpc("platform_upsert_organization_type", {
    p_key: input.key,
    p_name: input.name,
    p_description: input.description as string,
    p_icon: input.icon as string,
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
