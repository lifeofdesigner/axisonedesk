import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/crm/api";
import type { DealStage } from "@/modules/crm/types";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const crmKeys = {
  customers: (orgId: string | null) => ["crm", "customers", orgId] as const,
  customer: (orgId: string | null, id: string) => ["crm", "customer", orgId, id] as const,
  deals: (orgId: string | null) => ["crm", "deals", orgId] as const,
  customerDeals: (orgId: string | null, customerId: string) =>
    ["crm", "customer-deals", orgId, customerId] as const,
  notes: (orgId: string | null, customerId: string) => ["crm", "notes", orgId, customerId] as const,
};

export function useCustomers() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: crmKeys.customers(activeOrgId),
    queryFn: () => api.listCustomers(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCustomer(id: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: crmKeys.customer(activeOrgId, id),
    queryFn: () => api.getCustomer(activeOrgId!, id),
    enabled: Boolean(activeOrgId) && Boolean(id),
  });
}

export function useDeals() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: crmKeys.deals(activeOrgId),
    queryFn: () => api.listDeals(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCustomerDeals(customerId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: crmKeys.customerDeals(activeOrgId, customerId),
    queryFn: () => api.listDealsForCustomer(activeOrgId!, customerId),
    enabled: Boolean(activeOrgId) && Boolean(customerId),
  });
}

export function useCreateDeal() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateDealInput) => api.createDeal(activeOrgId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "deals"] });
    },
  });
}

export function useUpdateDealStage() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: DealStage }) =>
      api.updateDealStage(activeOrgId!, id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "deals"] });
    },
  });
}

export function useCustomerNotes(customerId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: crmKeys.notes(activeOrgId, customerId),
    queryFn: () => api.listCustomerNotes(activeOrgId!, customerId),
    enabled: Boolean(activeOrgId) && Boolean(customerId),
  });
}

export function useAddCustomerNote() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, body }: { customerId: string; body: string }) =>
      api.addCustomerNote(activeOrgId!, customerId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.notes(activeOrgId, variables.customerId) });
    },
  });
}
