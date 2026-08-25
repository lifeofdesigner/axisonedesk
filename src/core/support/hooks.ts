import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/support/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function useOrgTickets() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: ["support", "org-tickets", activeOrgId] as const,
    queryFn: () => api.listOrgTickets(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateTicket() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<api.CreateTicketInput, "orgId">) => api.createTicket({ ...input, orgId: activeOrgId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "org-tickets", activeOrgId] });
      queryClient.invalidateQueries({ queryKey: ["platform-admin", "tickets"] });
    },
  });
}

export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: ["support", "messages", ticketId] as const,
    queryFn: () => api.listTicketMessages(ticketId),
    enabled: Boolean(ticketId),
  });
}

export function useAddTicketMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, body, isInternal }: { ticketId: string; body: string; isInternal: boolean }) =>
      api.addTicketMessage(ticketId, body, isInternal),
    onSuccess: (_d, variables) =>
      queryClient.invalidateQueries({ queryKey: ["support", "messages", variables.ticketId] }),
  });
}
