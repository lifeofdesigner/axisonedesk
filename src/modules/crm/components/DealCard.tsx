import { Card, CardContent } from "@/shared/components/ui/card";
import type { Deal } from "@/modules/crm/types";

export function DealCard({ deal, customerName }: { deal: Deal; customerName: string | null }) {
  return (
    <Card className="gap-0 py-3">
      <CardContent className="px-3">
        <p className="text-sm font-medium">{deal.title}</p>
        {customerName ? <p className="text-muted-foreground text-xs">{customerName}</p> : null}
        <p className="mt-2 text-sm font-semibold tabular-nums">${deal.value.toFixed(2)}</p>
        {deal.expectedCloseDate ? (
          <p className="text-muted-foreground mt-1 text-xs">
            Close {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
