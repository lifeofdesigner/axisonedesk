import { useQuery } from "@tanstack/react-query";
import { getEnabledModuleKeys, getGlobalFlag } from "@/core/feature-flags/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

/** Pre-org global flag read — see getGlobalFlag for why this differs from useEnabledModules. */
export function useGlobalFlag(key: string) {
  return useQuery({
    queryKey: ["feature-flags", "global", key] as const,
    queryFn: () => getGlobalFlag(key),
  });
}

export function useEnabledModules() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["feature-flags", "enabled-modules", activeOrgId] as const,
    queryFn: () => getEnabledModuleKeys(activeOrgId!),
    enabled: Boolean(activeOrgId),
    staleTime: 60_000,
  });
}
