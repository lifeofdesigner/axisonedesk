import {
  CheckCircle2,
  CreditCard,
  History,
  MessageSquare,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type { OrderEvent } from "@/modules/orders/types";

const typeConfig: Record<OrderEvent["type"], { icon: typeof History; className: string }> = {
  created: { icon: CheckCircle2, className: "bg-success/10 text-success" },
  payment_status_changed: { icon: CreditCard, className: "bg-info/10 text-info" },
  fulfillment_status_changed: { icon: PackageCheck, className: "bg-primary/10 text-primary" },
  note_added: { icon: MessageSquare, className: "bg-muted text-muted-foreground" },
  cancelled: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

export function OrderTimeline({
  events,
  isLoading,
}: {
  events?: OrderEvent[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events?.length) {
    return (
      <EmptyState icon={History} title="No activity yet" description="Order events will show up here." />
    );
  }

  return (
    <ol className="flex flex-col gap-5 p-1">
      {events.map((event, i) => {
        const config = typeConfig[event.type];
        const Icon = config.icon;
        return (
          <li key={event.id} className="relative flex gap-3">
            {i < events.length - 1 ? (
              <span className="bg-border absolute top-8 left-4 h-full w-px" />
            ) : null}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                config.className,
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-medium">{event.description}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(event.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">by {event.actorName}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
