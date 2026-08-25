import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/support-api";

export function usePlatformTickets() {
  return useQuery({ queryKey: ["platform-admin", "tickets"] as const, queryFn: api.listAllTickets });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      status,
      priority,
      assignedTo,
    }: {
      ticketId: string;
      status: string;
      priority: string;
      assignedTo: string | null;
    }) => api.updateTicket(ticketId, status, priority, assignedTo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-admin", "tickets"] }),
  });
}
