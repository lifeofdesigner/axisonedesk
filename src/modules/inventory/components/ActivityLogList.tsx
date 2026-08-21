import { History } from "lucide-react";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { ActivityLogEntry } from "@/modules/inventory/types";

export function ActivityLogList({
  entries,
  isLoading,
}: {
  entries?: ActivityLogEntry[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <EmptyState
        icon={History}
        title="No activity yet"
        description="Changes to this product will be logged here."
      />
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-start justify-between gap-3 py-3 text-sm">
          <div>
            <p className="font-medium">{entry.description}</p>
            <p className="text-muted-foreground text-xs">by {entry.actor}</p>
          </div>
          <p className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
            {new Date(entry.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
