import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";

type MemberStatus = Database["public"]["Enums"]["member_status"];

export interface PlatformUserMembership {
  membershipId: string;
  orgId: string;
  orgName: string;
  role: string;
  status: string;
}

export interface PlatformUser {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  isPlatformAdmin: boolean;
  memberships: PlatformUserMembership[];
}

export async function listUsers(): Promise<PlatformUser[]> {
  const { data, error } = await supabase.rpc("platform_list_users");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    createdAt: r.created_at,
    isPlatformAdmin: r.is_platform_admin,
    memberships: (r.memberships as unknown as {
      membershipId: string; orgId: string; orgName: string; role: string; status: string;
    }[]) ?? [],
  }));
}

export async function grantAdmin(userId: string): Promise<void> {
  const { error } = await supabase.rpc("platform_grant_admin", { p_user_id: userId });
  if (error) throw toAppError(error);
}

export async function revokeAdmin(userId: string): Promise<void> {
  const { error } = await supabase.rpc("platform_revoke_admin", { p_user_id: userId });
  if (error) throw toAppError(error);
}

export async function setMemberStatus(orgId: string, memberId: string, status: MemberStatus): Promise<void> {
  const { error } = await supabase.rpc("platform_set_member_status", {
    p_org_id: orgId,
    p_member_id: memberId,
    p_status: status,
  });
  if (error) throw toAppError(error);
}

export interface PlatformPermission {
  id: string;
  key: string;
  description: string | null;
  moduleKey: string;
}

export async function listPermissions(): Promise<PlatformPermission[]> {
  const { data, error } = await supabase.rpc("platform_list_permissions");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({ id: r.id, key: r.key, description: r.description, moduleKey: r.module_key }));
}

export interface PlatformRole {
  id: string;
  name: string;
  isSystemRole: boolean;
  permissionIds: string[];
}

export async function listOrgRoles(orgId: string): Promise<PlatformRole[]> {
  const { data, error } = await supabase.rpc("platform_list_org_roles", { p_org_id: orgId });
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    isSystemRole: r.is_system_role,
    permissionIds: r.permission_ids ?? [],
  }));
}

export async function createRole(orgId: string, name: string, permissionIds: string[]): Promise<void> {
  const { error } = await supabase.rpc("platform_create_role", {
    p_org_id: orgId,
    p_name: name,
    p_permission_ids: permissionIds,
  });
  if (error) throw toAppError(error);
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
  const { error } = await supabase.rpc("platform_update_role_permissions", {
    p_role_id: roleId,
    p_permission_ids: permissionIds,
  });
  if (error) throw toAppError(error);
}
