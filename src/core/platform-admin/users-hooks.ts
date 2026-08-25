import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/users-api";
import type { Database } from "@/core/supabase/database.types";

type MemberStatus = Database["public"]["Enums"]["member_status"];

const KEYS = {
  users: ["platform-admin", "users"] as const,
  permissions: ["platform-admin", "permissions"] as const,
  orgRoles: (orgId: string) => ["platform-admin", "org-roles", orgId] as const,
};

export function usePlatformUsers() {
  return useQuery({ queryKey: KEYS.users, queryFn: api.listUsers });
}

export function useGrantAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.grantAdmin(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.users }),
  });
}

export function useRevokeAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.revokeAdmin(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.users }),
  });
}

export function useSetMemberStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, memberId, status }: { orgId: string; memberId: string; status: MemberStatus }) =>
      api.setMemberStatus(orgId, memberId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.users }),
  });
}

export function usePlatformPermissions() {
  return useQuery({ queryKey: KEYS.permissions, queryFn: api.listPermissions });
}

export function useOrgRoles(orgId: string) {
  return useQuery({
    queryKey: KEYS.orgRoles(orgId),
    queryFn: () => api.listOrgRoles(orgId),
    enabled: Boolean(orgId),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, name, permissionIds }: { orgId: string; name: string; permissionIds: string[] }) =>
      api.createRole(orgId, name, permissionIds),
    onSuccess: (_d, variables) => queryClient.invalidateQueries({ queryKey: KEYS.orgRoles(variables.orgId) }),
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[]; orgId: string }) =>
      api.updateRolePermissions(roleId, permissionIds),
    onSuccess: (_d, variables) => queryClient.invalidateQueries({ queryKey: KEYS.orgRoles(variables.orgId) }),
  });
}
