import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/bookings/api";
import type { BookingStatus } from "@/modules/bookings/types";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const bookingsKeys = {
  resources: (orgId: string | null) => ["bookings", "resources", orgId] as const,
  bookings: (orgId: string | null) => ["bookings", "bookings", orgId] as const,
};

export function useBookingCustomers() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["bookings", "customers", activeOrgId] as const,
    queryFn: () => api.listCustomers(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useResources() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: bookingsKeys.resources(activeOrgId),
    queryFn: () => api.listResources(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateResource() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateResourceInput) => api.createResource(activeOrgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKeys.resources(activeOrgId) }),
  });
}

export function useBookings() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: bookingsKeys.bookings(activeOrgId),
    queryFn: () => api.listBookings(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateBooking() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateBookingInput) => api.createBooking(activeOrgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKeys.bookings(activeOrgId) }),
  });
}

export function useUpdateBookingStatus() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      api.updateBookingStatus(activeOrgId!, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKeys.bookings(activeOrgId) }),
  });
}
