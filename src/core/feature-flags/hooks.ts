import { useQuery } from "@tanstack/react-query";
import { getEnabledModuleKeys } from "@/core/feature-flags/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function useEnabledModules() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["feature-flags", "enabled-modules", activeOrgId] as const,
    queryFn: () => getEnabledModuleKeys(activeOrgId!),
    enabled: Boolean(activeOrgId),
    staleTime: 60_000,
  });
}
