import { useQuery } from "@tanstack/react-query";
import * as api from "@/modules/reports/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function useSalesReport(days = 30) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["reports", "sales", activeOrgId, days] as const,
    queryFn: () => api.getSalesReport(activeOrgId!, days),
    enabled: Boolean(activeOrgId),
  });
}

export function useInventoryValuationReport() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["reports", "inventory-valuation", activeOrgId] as const,
    queryFn: () => api.getInventoryValuationReport(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useTopCustomersReport() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["reports", "top-customers", activeOrgId] as const,
    queryFn: () => api.getTopCustomersReport(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}
