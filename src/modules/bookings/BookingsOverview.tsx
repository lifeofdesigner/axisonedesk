import { useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Plus } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { KpiCard } from "@/shared/components/data/KpiCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useBookings, useResources, useUpdateBookingStatus } from "@/modules/bookings/hooks";
import { NewBookingDialog } from "@/modules/bookings/components/NewBookingDialog";
import { NewResourceDialog } from "@/modules/bookings/components/NewResourceDialog";
import type { BookingStatus } from "@/modules/bookings/types";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function BookingsOverview() {
  const { data: bookings, isLoading } = useBookings();
  const { data: resources } = useResources();
  const updateStatus = useUpdateBookingStatus();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);

  const upcoming = (bookings ?? []).filter(
    (b) => new Date(b.startsAt) >= new Date() && b.status !== "cancelled",
  );

  async function handleStatusChange(id: string, status: BookingStatus) {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking updated");
    } catch {
      toast.error("Couldn't update booking");
    }
  }

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Reservations across every resource — rooms, tables, staff, or equipment."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setResourceDialogOpen(true)}>
              <Plus className="size-4" />
              Resource
            </Button>
            <Button size="sm" onClick={() => setBookingDialogOpen(true)}>
              <Plus className="size-4" />
              New booking
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Upcoming bookings" value={String(upcoming.length)} caption="not cancelled" />
        <KpiCard label="Resources" value={String(resources?.length ?? 0)} caption="rooms, tables & more" />
        <KpiCard
          label="Cancelled"
          value={String((bookings ?? []).filter((b) => b.status === "cancelled").length)}
          caption="all time"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No bookings yet"
            description="Create your first booking to start filling the calendar."
            action={
              <Button size="sm" onClick={() => setBookingDialogOpen(true)}>
                <Plus className="size-4" />
                New booking
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {bookings.map((booking) => {
              const resource = resources?.find((r) => r.id === booking.resourceId);
              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{booking.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(booking.startsAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {resource ? ` · ${resource.name}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("font-normal capitalize", statusStyles[booking.status])}>
                      {booking.status}
                    </Badge>
                    <Select value={booking.status} onValueChange={(v) => handleStatusChange(booking.id, v as BookingStatus)}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewBookingDialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} />
      <NewResourceDialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen} />
    </div>
  );
}
