import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  trend,
  caption,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  caption: string;
}) {
  const isUp = trend === "up";

  return (
    <Card className="gap-3 py-5">
      <CardContent className="px-5">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              isUp ? "text-success" : "text-destructive",
            )}
          >
            {isUp ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {delta}
          </span>
          <span className="text-muted-foreground text-xs">{caption}</span>
        </div>
      </CardContent>
    </Card>
  );
}
