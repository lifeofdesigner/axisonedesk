import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/purchasing/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const purchasingKeys = {
  suppliers: (orgId: string | null) => ["purchasing", "suppliers", orgId] as const,
  products: (orgId: string | null) => ["purchasing", "products", orgId] as const,
  orders: (orgId: string | null) => ["purchasing", "orders", orgId] as const,
  order: (orgId: string | null, id: string) => ["purchasing", "order", orgId, id] as const,
  items: (orgId: string | null, poId: string) => ["purchasing", "items", orgId, poId] as const,
};

export function useSuppliers() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: purchasingKeys.suppliers(activeOrgId),
    queryFn: () => api.listSuppliers(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function usePurchasableProducts() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: purchasingKeys.products(activeOrgId),
    queryFn: () => api.listPurchasableProducts(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function usePurchaseOrders() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: purchasingKeys.orders(activeOrgId),
    queryFn: () => api.listPurchaseOrders(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function usePurchaseOrder(id: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: purchasingKeys.order(activeOrgId, id),
    queryFn: () => api.getPurchaseOrder(activeOrgId!, id),
    enabled: Boolean(activeOrgId) && Boolean(id),
  });
}

export function usePurchaseOrderItems(poId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: purchasingKeys.items(activeOrgId, poId),
    queryFn: () => api.listPurchaseOrderItems(activeOrgId!, poId),
    enabled: Boolean(activeOrgId) && Boolean(poId),
  });
}

export function useCreatePurchaseOrder() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreatePurchaseOrderInput) => api.createPurchaseOrder(activeOrgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchasing", "orders"] }),
  });
}

export function useReceivePurchaseOrder() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.receivePurchaseOrder(activeOrgId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchasing", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["purchasing", "order"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "movement-trend"] });
    },
  });
}
