import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/inventory/api";

export const inventoryKeys = {
  products: (filters?: api.ProductFilters) => ["inventory", "products", filters ?? {}] as const,
  product: (id: string) => ["inventory", "product", id] as const,
  categories: () => ["inventory", "categories"] as const,
  stockMovements: (productId: string) => ["inventory", "stock-movements", productId] as const,
  activityLog: (productId: string) => ["inventory", "activity-log", productId] as const,
  variants: (productId: string) => ["inventory", "variants", productId] as const,
  suppliers: () => ["inventory", "suppliers"] as const,
};

export function useProducts(filters: api.ProductFilters = {}) {
  return useQuery({
    queryKey: inventoryKeys.products(filters),
    queryFn: () => api.listProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: inventoryKeys.product(id),
    queryFn: () => api.getProduct(id),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: inventoryKeys.categories(),
    queryFn: api.listCategories,
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: inventoryKeys.suppliers(),
    queryFn: api.listSuppliers,
  });
}

export function useStockMovements(productId: string) {
  return useQuery({
    queryKey: inventoryKeys.stockMovements(productId),
    queryFn: () => api.listStockMovements(productId),
    enabled: Boolean(productId),
  });
}

export function useActivityLog(productId: string) {
  return useQuery({
    queryKey: inventoryKeys.activityLog(productId),
    queryFn: () => api.listActivityLog(productId),
    enabled: Boolean(productId),
  });
}

export function useVariants(productId: string) {
  return useQuery({
    queryKey: inventoryKeys.variants(productId),
    queryFn: () => api.listVariants(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.adjustStock,
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.product(product.id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stockMovements(product.id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.activityLog(product.id) });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: api.CategoryInput }) =>
      api.updateCategory(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() }),
  });
}
