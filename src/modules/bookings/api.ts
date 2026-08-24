/**
 * Supabase-backed data layer for Bookings. Reads `customers` directly (shared
 * table, owned by orders/crm) rather than importing module code.
 */
import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type { Booking, BookingResource, BookingStatus } from "@/modules/bookings/types";

type ResourceRow = Database["public"]["Tables"]["booking_resources"]["Row"];
type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];

function mapResource(row: ResourceRow): BookingResource {
  return { id: row.id, name: row.name, resourceType: row.resource_type, capacity: row.capacity };
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    title: row.title,
    resourceId: row.resource_id,
    customerId: row.customer_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status as BookingStatus,
    notes: row.notes,
  };
}

export interface BookingCustomer {
  id: string;
  name: string;
}

export async function listCustomers(orgId: string): Promise<BookingCustomer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return data as BookingCustomer[];
}

export async function listResources(orgId: string): Promise<BookingResource[]> {
  const { data, error } = await supabase
    .from("booking_resources")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw toAppError(error);
  return (data as ResourceRow[]).map(mapResource);
}

export interface CreateResourceInput {
  name: string;
  resourceType: string;
  capacity: number;
}

export async function createResource(orgId: string, input: CreateResourceInput): Promise<BookingResource> {
  const { data, error } = await supabase
    .from("booking_resources")
    .insert({ org_id: orgId, name: input.name, resource_type: input.resourceType, capacity: input.capacity })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapResource(data as ResourceRow);
}

export async function listBookings(orgId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("starts_at", { ascending: true });

  if (error) throw toAppError(error);
  return (data as BookingRow[]).map(mapBooking);
}

export interface CreateBookingInput {
  title: string;
  resourceId: string | null;
  customerId: string | null;
  startsAt: string;
  endsAt: string;
  notes: string | null;
}

export async function createBooking(orgId: string, input: CreateBookingInput): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      org_id: orgId,
      title: input.title,
      resource_id: input.resourceId,
      customer_id: input.customerId,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      notes: input.notes,
      status: "confirmed",
    })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapBooking(data as BookingRow);
}

export async function updateBookingStatus(orgId: string, id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("org_id", orgId)
    .eq("id", id);

  if (error) throw toAppError(error);
}
