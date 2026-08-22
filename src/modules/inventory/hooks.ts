import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/inventory/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const inventoryKeys = {
  products: (orgId: string | null, filters?: api.ProductFilters) =>
    ["inventory", "products", orgId, filters ?? {}] as const,
  product: (orgId: string | null, id: string) => ["inventory", "product", orgId, id] as const,
  categories: (orgId: string | null) => ["inventory", "categories", orgId] as const,
  stockMovements: (orgId: string | null, productId: string) =>
    ["inventory", "stock-movements", orgId, productId] as const,
  activityLog: (orgId: string | null, productId: string) =>
    ["inventory", "activity-log", orgId, productId] as const,
  variants: (orgId: string | null, productId: string) =>
    ["inventory", "variants", orgId, productId] as const,
  suppliers: (orgId: string | null) => ["inventory", "suppliers", orgId] as const,
  movementTrend: (orgId: string | null) => ["inventory", "movement-trend", orgId] as const,
};

export function useProducts(filters: api.ProductFilters = {}) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.products(activeOrgId, filters),
    queryFn: () => api.listProducts(activeOrgId!, filters),
    enabled: Boolean(activeOrgId),
  });
}

export function useProduct(id: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.product(activeOrgId, id),
    queryFn: () => api.getProduct(activeOrgId!, id),
    enabled: Boolean(activeOrgId) && Boolean(id),
  });
}

export function useCategories() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.categories(activeOrgId),
    queryFn: () => api.listCategories(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useSuppliers() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.suppliers(activeOrgId),
    queryFn: () => api.listSuppliers(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useStockMovements(productId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.stockMovements(activeOrgId, productId),
    queryFn: () => api.listStockMovements(activeOrgId!, productId),
    enabled: Boolean(activeOrgId) && Boolean(productId),
  });
}

export function useActivityLog(productId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.activityLog(activeOrgId, productId),
    queryFn: () => api.listActivityLog(activeOrgId!, productId),
    enabled: Boolean(activeOrgId) && Boolean(productId),
  });
}

export function useVariants(productId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.variants(activeOrgId, productId),
    queryFn: () => api.listVariants(activeOrgId!, productId),
    enabled: Boolean(activeOrgId) && Boolean(productId),
  });
}

export function useStockMovementTrend() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: inventoryKeys.movementTrend(activeOrgId),
    queryFn: () => api.getStockMovementTrend(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateProduct() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateProductInput) => api.createProduct(activeOrgId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories(activeOrgId) });
    },
  });
}

export function useDeleteProduct() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(activeOrgId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories(activeOrgId) });
    },
  });
}

export function useAdjustStock() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.AdjustStockInput) => api.adjustStock(activeOrgId!, input),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.product(activeOrgId, product.id) });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.stockMovements(activeOrgId, product.id),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.activityLog(activeOrgId, product.id),
      });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.movementTrend(activeOrgId) });
    },
  });
}

export function useCreateCategory() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CategoryInput) => api.createCategory(activeOrgId!, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories(activeOrgId) }),
  });
}

export function useUpdateCategory() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: api.CategoryInput }) =>
      api.updateCategory(activeOrgId!, id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories(activeOrgId) }),
  });
}

export function useDeleteCategory() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(activeOrgId!, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories(activeOrgId) }),
  });
}
