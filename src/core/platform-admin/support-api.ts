import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface PlatformTicket {
  id: string;
  orgId: string;
  orgName: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdByName: string | null;
  assignedToName: string | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function listAllTickets(): Promise<PlatformTicket[]> {
  const { data, error } = await supabase.rpc("platform_list_tickets");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    orgId: r.org_id,
    orgName: r.org_name,
    subject: r.subject,
    category: r.category,
    status: r.status,
    priority: r.priority,
    createdByName: r.created_by_name,
    assignedToName: r.assigned_to_name,
    messageCount: Number(r.message_count),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function updateTicket(
  ticketId: string,
  status: string,
  priority: string,
  assignedTo: string | null,
): Promise<void> {
  const { error } = await supabase.rpc("platform_update_ticket", {
    p_ticket_id: ticketId,
    p_status: status,
    p_priority: priority,
    p_assigned_to: assignedTo as unknown as string,
  });
  if (error) throw toAppError(error);
}
