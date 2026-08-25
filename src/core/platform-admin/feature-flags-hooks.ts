import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/feature-flags-api";

const KEYS = {
  flags: ["platform-admin", "feature-flags"] as const,
  overrides: ["platform-admin", "feature-flag-overrides"] as const,
};

export function usePlatformFlags() {
  return useQuery({ queryKey: KEYS.flags, queryFn: api.listFlags });
}

export function useAllFlagOverrides() {
  return useQuery({ queryKey: KEYS.overrides, queryFn: api.listAllOverrides });
}

function useInvalidateFlags() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["platform-admin", "feature-flag"] });
    queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
  };
}

export function useSetFlagDefault() {
  const invalidate = useInvalidateFlags();
  return useMutation({
    mutationFn: ({ flagId, enabled }: { flagId: string; enabled: boolean }) => api.setFlagDefault(flagId, enabled),
    onSuccess: invalidate,
  });
}

export function useSetOrgFlagOverride() {
  const invalidate = useInvalidateFlags();
  return useMutation({
    mutationFn: ({ orgId, flagId, enabled }: { orgId: string; flagId: string; enabled: boolean }) =>
      api.setOrgFlagOverride(orgId, flagId, enabled),
    onSuccess: invalidate,
  });
}

export function useClearOrgFlagOverride() {
  const invalidate = useInvalidateFlags();
  return useMutation({
    mutationFn: ({ orgId, flagId }: { orgId: string; flagId: string }) => api.clearOrgFlagOverride(orgId, flagId),
    onSuccess: invalidate,
  });
}
