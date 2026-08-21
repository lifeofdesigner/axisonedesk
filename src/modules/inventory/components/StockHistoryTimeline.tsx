import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type { StockMovement } from "@/modules/inventory/types";

const typeConfig = {
  increase: { icon: ArrowUpRight, className: "bg-success/10 text-success" },
  decrease: { icon: ArrowDownLeft, className: "bg-destructive/10 text-destructive" },
  transfer: { icon: ArrowRightLeft, className: "bg-info/10 text-info" },
};

export function StockHistoryTimeline({
  movements,
  isLoading,
}: {
  movements?: StockMovement[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-1">
        {Array.from({ length: 4 }).map((_, i) => (
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

  if (!movements?.length) {
    return (
      <EmptyState
        icon={ArrowRightLeft}
        title="No stock movements yet"
        description="Increases, decreases, and transfers for this product will show up here."
      />
    );
  }

  return (
    <ol className="flex flex-col gap-5 p-1">
      {movements.map((movement, i) => {
        const config = typeConfig[movement.type];
        const Icon = config.icon;
        const sign = movement.type === "increase" ? "+" : movement.type === "decrease" ? "-" : "";

        return (
          <li key={movement.id} className="relative flex gap-3">
            {i < movements.length - 1 ? (
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
                <p className="text-sm font-medium capitalize">
                  {movement.type} — {sign}
                  {movement.quantity}
                  {movement.type === "transfer" ? "" : " units"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(movement.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {movement.reason} · by {movement.performedBy}
                {movement.type === "transfer" && movement.fromLocation && movement.toLocation
                  ? ` · ${movement.fromLocation} → ${movement.toLocation}`
                  : ""}
              </p>
              {movement.notes ? (
                <p className="text-muted-foreground mt-1 text-xs italic">"{movement.notes}"</p>
              ) : null}
              <p className="text-muted-foreground mt-1 text-xs">
                Resulting quantity: <span className="font-medium">{movement.resultingQuantity}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
