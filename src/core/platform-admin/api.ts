/**
 * Platform Owner Portal data layer. Every function here calls a
 * security-definer RPC (supabase/migrations/0010_platform_admin.sql,
 * 0011_platform_admin_rpcs.sql) that explicitly checks
 * is_platform_admin(auth.uid()) — this deliberately does NOT read tenant
 * tables directly the way org-scoped modules do, since a platform admin is
 * not a member of every org and ordinary RLS would block it.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";

export type OrganizationStatus = Database["public"]["Enums"]["organization_status"];

export interface PlatformDashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  trialingCompanies: number;
  suspendedCompanies: number;
  pastDueCompanies: number;
  archivedCompanies: number;
  totalUsers: number;
  newSignups30d: number;
  newSignupsPrev30d: number;
  mrr: number;
  arr: number;
  planBreakdown: { plan: string; count: number }[];
}

export interface PlatformOrganization {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  status: OrganizationStatus;
  createdAt: string;
  deletedAt: string | null;
  planName: string | null;
  memberCount: number;
  logoUrl?: string | null;
  primaryColor?: string | null;
}

export interface PlatformOrganizationMember {
  id: string;
  userId: string;
  status: string;
  role: string;
  fullName: string | null;
  joinedAt: string | null;
}

export interface PlatformOrganizationDetail {
  organization: PlatformOrganization & { businessType: string };
  planName: string | null;
  subscriptionStatus: string | null;
  members: PlatformOrganizationMember[];
}

export interface AuditLogEntry {
  id: string;
  orgId: string | null;
  orgName: string | null;
  actorId: string | null;
  actorName: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export async function checkIsPlatformAdmin(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data, error } = await supabase.rpc("is_platform_admin", { p_user_id: userData.user.id });
  if (error) throw toAppError(error);
  return Boolean(data);
}

export async function getDashboardStats(): Promise<PlatformDashboardStats> {
  const { data, error } = await supabase.rpc("platform_dashboard_stats");
  if (error) throw toAppError(error);
  const d = data as {
    total_companies: number;
    active_companies: number;
    trialing_companies: number;
    suspended_companies: number;
    past_due_companies: number;
    archived_companies: number;
    total_users: number;
    new_signups_30d: number;
    new_signups_prev_30d: number;
    mrr: number;
    arr: number;
    plan_breakdown: { plan: string; count: number }[];
  };
  return {
    totalCompanies: d.total_companies,
    activeCompanies: d.active_companies,
    trialingCompanies: d.trialing_companies,
    suspendedCompanies: d.suspended_companies,
    pastDueCompanies: d.past_due_companies,
    archivedCompanies: d.archived_companies,
    totalUsers: d.total_users,
    newSignups30d: d.new_signups_30d,
    newSignupsPrev30d: d.new_signups_prev_30d,
    mrr: Number(d.mrr),
    arr: Number(d.arr),
    planBreakdown: d.plan_breakdown ?? [],
  };
}

export async function listOrganizations(): Promise<PlatformOrganization[]> {
  const { data, error } = await supabase.rpc("list_platform_organizations");
  if (error) throw toAppError(error);
  return (data as {
    id: string; name: string; slug: string; business_type: string;
    status: OrganizationStatus; created_at: string; deleted_at: string | null;
    plan_name: string | null; member_count: number;
  }[]).map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    businessType: r.business_type,
    status: r.status,
    createdAt: r.created_at,
    deletedAt: r.deleted_at,
    planName: r.plan_name,
    memberCount: Number(r.member_count),
  }));
}

export async function getOrganizationDetail(orgId: string): Promise<PlatformOrganizationDetail | null> {
  const { data, error } = await supabase.rpc("get_platform_organization", { p_org_id: orgId });
  if (error) throw toAppError(error);
  if (!data) return null;
  const d = data as {
    organization: {
      id: string; name: string; slug: string; business_type: string;
      status: OrganizationStatus; created_at: string; deleted_at: string | null;
      logo_url: string | null; primary_color: string | null;
    };
    plan_name: string | null;
    subscription_status: string | null;
    members: { id: string; user_id: string; status: string; role: string; full_name: string | null; joined_at: string | null }[];
  };
  return {
    organization: {
      id: d.organization.id,
      name: d.organization.name,
      slug: d.organization.slug,
      businessType: d.organization.business_type,
      status: d.organization.status,
      createdAt: d.organization.created_at,
      deletedAt: d.organization.deleted_at,
      planName: d.plan_name,
      memberCount: d.members.length,
      logoUrl: d.organization.logo_url,
      primaryColor: d.organization.primary_color,
    },
    planName: d.plan_name,
    subscriptionStatus: d.subscription_status,
    members: d.members.map((m) => ({
      id: m.id,
      userId: m.user_id,
      status: m.status,
      role: m.role,
      fullName: m.full_name,
      joinedAt: m.joined_at,
    })),
  };
}

export async function setOrganizationStatus(orgId: string, status: OrganizationStatus): Promise<void> {
  const { error } = await supabase.rpc("platform_set_organization_status", { p_org_id: orgId, p_status: status });
  if (error) throw toAppError(error);
}

export async function archiveOrganization(orgId: string): Promise<void> {
  const { error } = await supabase.rpc("platform_archive_organization", { p_org_id: orgId });
  if (error) throw toAppError(error);
}

export async function restoreOrganization(orgId: string): Promise<void> {
  const { error } = await supabase.rpc("platform_restore_organization", { p_org_id: orgId });
  if (error) throw toAppError(error);
}

export async function listAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase.rpc("platform_list_audit_logs", { p_limit: limit });
  if (error) throw toAppError(error);
  return (data as {
    id: string; org_id: string | null; org_name: string | null; actor_id: string | null;
    actor_name: string | null; action: string; entity_type: string; entity_id: string | null;
    metadata: Record<string, unknown>; created_at: string;
  }[]).map((r) => ({
    id: r.id,
    orgId: r.org_id,
    orgName: r.org_name,
    actorId: r.actor_id,
    actorName: r.actor_name,
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    metadata: r.metadata,
    createdAt: r.created_at,
  }));
}
