import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  trend,
  caption,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  caption?: string;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "destructive";
}) {
  const isUp = trend === "up";

  const toneStyles: Record<typeof tone, string> = {
    default: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="gap-3 py-5">
      <CardContent className="px-5">
        <div className="flex items-start justify-between">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          {Icon ? (
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                toneStyles[tone],
              )}
            >
              <Icon className="size-4" />
            </div>
          ) : null}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
        </div>
        {delta && trend ? (
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
            {caption ? <span className="text-muted-foreground text-xs">{caption}</span> : null}
          </div>
        ) : caption ? (
          <p className="text-muted-foreground mt-2 text-xs">{caption}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
