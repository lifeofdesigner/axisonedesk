/**
 * Supabase-backed data layer for CRM. Reads the `customers` table directly
 * (built provisionally by Orders, now owned conceptually by CRM per
 * ARCHITECTURE.md §4) rather than importing Orders module code — a shared
 * data store, not shared code (see ARCHITECTURE.md §2).
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type { Customer, CustomerNote, Deal, DealStage } from "@/modules/crm/types";

type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];
type CustomerNoteRow = Database["public"]["Tables"]["customer_notes"]["Row"];

function mapCustomer(row: CustomerRow): Customer {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone };
}

function mapDeal(row: DealRow): Deal {
  return {
    id: row.id,
    customerId: row.customer_id,
    title: row.title,
    value: Number(row.value),
    stage: row.stage,
    expectedCloseDate: row.expected_close_date,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}

export async function listCustomers(orgId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return (data as CustomerRow[]).map(mapCustomer);
}

export async function getCustomer(orgId: string, id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("org_id", orgId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw toAppError(error);
  return data ? mapCustomer(data as CustomerRow) : null;
}

export async function listDeals(orgId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);
  return (data as DealRow[]).map(mapDeal);
}

export async function listDealsForCustomer(orgId: string, customerId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("org_id", orgId)
    .eq("customer_id", customerId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);
  return (data as DealRow[]).map(mapDeal);
}

export interface CreateDealInput {
  title: string;
  value: number;
  customerId: string | null;
  expectedCloseDate: string | null;
}

export async function createDeal(orgId: string, input: CreateDealInput): Promise<Deal> {
  const { data, error } = await supabase
    .from("deals")
    .insert({
      org_id: orgId,
      title: input.title,
      value: input.value,
      customer_id: input.customerId,
      expected_close_date: input.expectedCloseDate,
      stage: "lead",
    })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapDeal(data as DealRow);
}

export async function updateDealStage(orgId: string, id: string, stage: DealStage): Promise<Deal> {
  const { data, error } = await supabase
    .from("deals")
    .update({ stage })
    .eq("org_id", orgId)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapDeal(data as DealRow);
}

export async function listCustomerNotes(orgId: string, customerId: string): Promise<CustomerNote[]> {
  const { data, error } = await supabase
    .from("customer_notes")
    .select("*, profiles(full_name)")
    .eq("org_id", orgId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw toAppError(error);
  return (data as (CustomerNoteRow & { profiles: { full_name: string | null } | null })[]).map(
    (row) => ({
      id: row.id,
      customerId: row.customer_id,
      authorId: row.author_id,
      authorName: row.profiles?.full_name ?? "Team member",
      body: row.body,
      createdAt: row.created_at,
    }),
  );
}

export async function addCustomerNote(
  orgId: string,
  customerId: string,
  body: string,
): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const authorId = userData.user?.id;
  if (!authorId) throw toAppError(new Error("Not authenticated"));

  const { error } = await supabase
    .from("customer_notes")
    .insert({ org_id: orgId, customer_id: customerId, author_id: authorId, body });

  if (error) throw toAppError(error);
}
