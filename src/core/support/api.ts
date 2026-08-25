/**
 * Shared support-ticket data layer. Tenant members and platform admins both
 * use these same functions — RLS (0017_support_center.sql) already
 * distinguishes what each can see/do: tenant members get their own org's
 * tickets and non-internal messages; platform admins see everything.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";

type TicketRow = Database["public"]["Tables"]["support_tickets"]["Row"];
type MessageRow = Database["public"]["Tables"]["support_ticket_messages"]["Row"];

export interface Ticket {
  id: string;
  orgId: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

function mapTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    orgId: row.org_id,
    subject: row.subject,
    category: row.category,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listOrgTickets(orgId: string): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("org_id", orgId)
    .order("updated_at", { ascending: false });

  if (error) throw toAppError(error);
  return (data as TicketRow[]).map(mapTicket);
}

export interface CreateTicketInput {
  orgId: string;
  subject: string;
  category: string;
  body: string;
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw toAppError(new Error("Not authenticated"));

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({ org_id: input.orgId, created_by: userId, subject: input.subject, category: input.category })
    .select("*")
    .single();

  if (error) throw toAppError(error);

  const { error: msgError } = await supabase
    .from("support_ticket_messages")
    .insert({ ticket_id: ticket.id, author_id: userId, body: input.body, is_internal: false });

  if (msgError) throw toAppError(msgError);

  return mapTicket(ticket as TicketRow);
}

export async function listTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  // support_ticket_messages.author_id references auth.users, not
  // public.profiles directly, so PostgREST can't auto-embed profiles here —
  // same reason Settings' member list resolves names with a separate query.
  const { data, error } = await supabase
    .from("support_ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw toAppError(error);
  const rows = data as MessageRow[];

  const authorIds = Array.from(new Set(rows.map((r) => r.author_id)));
  let namesById = new Map<string, string | null>();
  if (authorIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", authorIds);
    if (profileError) throw toAppError(profileError);
    namesById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  }

  return rows.map((row) => ({
    id: row.id,
    ticketId: row.ticket_id,
    authorId: row.author_id,
    authorName: namesById.get(row.author_id) ?? "Team member",
    body: row.body,
    isInternal: row.is_internal,
    createdAt: row.created_at,
  }));
}

export async function addTicketMessage(ticketId: string, body: string, isInternal: boolean): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw toAppError(new Error("Not authenticated"));

  const { error } = await supabase
    .from("support_ticket_messages")
    .insert({ ticket_id: ticketId, author_id: userId, body, is_internal: isInternal });

  if (error) throw toAppError(error);
}
