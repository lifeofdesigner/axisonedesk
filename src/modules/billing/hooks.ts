import { useQuery } from "@tanstack/react-query";
import * as api from "@/modules/billing/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function usePlans() {
  return useQuery({ queryKey: ["billing", "plans"] as const, queryFn: api.listPlans });
}

export function useSubscription() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["billing", "subscription", activeOrgId] as const,
    queryFn: () => api.getSubscription(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}
