import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/orders/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const ordersKeys = {
  orders: (orgId: string | null, filters?: api.OrderFilters) =>
    ["orders", "orders", orgId, filters ?? {}] as const,
  order: (orgId: string | null, id: string) => ["orders", "order", orgId, id] as const,
  items: (orgId: string | null, orderId: string) => ["orders", "items", orgId, orderId] as const,
  notes: (orgId: string | null, orderId: string) => ["orders", "notes", orgId, orderId] as const,
  events: (orgId: string | null, orderId: string) => ["orders", "events", orgId, orderId] as const,
  customers: (orgId: string | null) => ["orders", "customers", orgId] as const,
  sellableProducts: (orgId: string | null) => ["orders", "sellable-products", orgId] as const,
};

export function useSellableProducts() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.sellableProducts(activeOrgId),
    queryFn: () => api.listSellableProducts(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useOrders(filters: api.OrderFilters = {}) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.orders(activeOrgId, filters),
    queryFn: () => api.listOrders(activeOrgId!, filters),
    enabled: Boolean(activeOrgId),
  });
}

export function useOrder(id: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.order(activeOrgId, id),
    queryFn: () => api.getOrder(activeOrgId!, id),
    enabled: Boolean(activeOrgId) && Boolean(id),
  });
}

export function useOrderItems(orderId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.items(activeOrgId, orderId),
    queryFn: () => api.listOrderItems(activeOrgId!, orderId),
    enabled: Boolean(activeOrgId) && Boolean(orderId),
  });
}

export function useOrderNotes(orderId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.notes(activeOrgId, orderId),
    queryFn: () => api.listOrderNotes(activeOrgId!, orderId),
    enabled: Boolean(activeOrgId) && Boolean(orderId),
  });
}

export function useOrderEvents(orderId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.events(activeOrgId, orderId),
    queryFn: () => api.listOrderEvents(activeOrgId!, orderId),
    enabled: Boolean(activeOrgId) && Boolean(orderId),
  });
}

export function useCustomers() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ordersKeys.customers(activeOrgId),
    queryFn: () => api.listCustomers(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateCustomer() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CustomerInput) => api.createCustomer(activeOrgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersKeys.customers(activeOrgId) }),
  });
}

export function useCreateOrder() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateOrderInput) => api.createOrder(activeOrgId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "orders"] });
      // Order creation decrements stock and writes to the inventory ledger —
      // the Inventory module's own cached queries are now stale too.
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "movement-trend"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpdateOrderStatusInput) => api.updateOrderStatus(activeOrgId!, input),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders", "orders"] });
      queryClient.invalidateQueries({ queryKey: ordersKeys.order(activeOrgId, order.id) });
      queryClient.invalidateQueries({ queryKey: ordersKeys.events(activeOrgId, order.id) });
      // Cancelling an order restocks inventory.
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "movement-trend"] });
    },
  });
}

export function useAddOrderNote() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: string; body: string }) =>
      api.addOrderNote(activeOrgId!, orderId, body),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.notes(activeOrgId, orderId) });
      queryClient.invalidateQueries({ queryKey: ordersKeys.events(activeOrgId, orderId) });
    },
  });
}
