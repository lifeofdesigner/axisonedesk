import { useQuery } from "@tanstack/react-query";
import * as api from "@/modules/dashboard/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const dashboardKeys = {
  kpis: (orgId: string | null) => ["dashboard", "kpis", orgId] as const,
  revenueSeries: (orgId: string | null) => ["dashboard", "revenue-series", orgId] as const,
  recentOrders: (orgId: string | null) => ["dashboard", "recent-orders", orgId] as const,
  lowStock: (orgId: string | null) => ["dashboard", "low-stock", orgId] as const,
  topProducts: (orgId: string | null) => ["dashboard", "top-products", orgId] as const,
};

export function useDashboardKpis() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: dashboardKeys.kpis(activeOrgId),
    queryFn: () => api.getDashboardKpis(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useRevenueSeries() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: dashboardKeys.revenueSeries(activeOrgId),
    queryFn: () => api.getRevenueSeries(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useRecentOrders(limit = 6) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: dashboardKeys.recentOrders(activeOrgId),
    queryFn: () => api.getRecentOrders(activeOrgId!, limit),
    enabled: Boolean(activeOrgId),
  });
}

export function useLowStockProducts() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: dashboardKeys.lowStock(activeOrgId),
    queryFn: () => api.getLowStockProducts(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useTopProducts() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: dashboardKeys.topProducts(activeOrgId),
    queryFn: () => api.getTopProducts(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}
