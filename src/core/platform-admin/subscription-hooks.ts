import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/subscription-api";

const KEYS = {
  plans: ["platform-admin", "plans"] as const,
  coupons: ["platform-admin", "coupons"] as const,
  invoices: ["platform-admin", "invoices"] as const,
};

export function usePlans() {
  return useQuery({ queryKey: KEYS.plans, queryFn: api.listPlans });
}

export function useUpsertPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpsertPlanInput) => api.upsertPlan(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.plans }),
  });
}

export function useCoupons() {
  return useQuery({ queryKey: KEYS.coupons, queryFn: api.listCoupons });
}

export function useUpsertCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpsertCouponInput) => api.upsertCoupon(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.coupons }),
  });
}

export function useInvoices() {
  return useQuery({ queryKey: KEYS.invoices, queryFn: api.listInvoices });
}

export function useUpsertInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpsertInvoiceInput) => api.upsertInvoice(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.invoices }),
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orgId,
      planId,
      status,
      seats,
      currentPeriodEnd,
    }: {
      orgId: string;
      planId: string;
      status: string;
      seats: number;
      currentPeriodEnd: string | null;
    }) => api.updateSubscription(orgId, planId, status, seats, currentPeriodEnd),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-admin"] }),
  });
}
