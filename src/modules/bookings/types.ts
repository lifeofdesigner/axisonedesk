export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface BookingResource {
  id: string;
  name: string;
  resourceType: string;
  capacity: number;
}

export interface Booking {
  id: string;
  title: string;
  resourceId: string | null;
  customerId: string | null;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  notes: string | null;
}
