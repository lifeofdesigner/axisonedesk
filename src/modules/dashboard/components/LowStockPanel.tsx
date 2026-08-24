import { AlertTriangle, PackageCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useLowStockProducts } from "@/modules/dashboard/hooks";

export function LowStockPanel() {
  const { data: items, isLoading } = useLowStockProducts();

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Low stock alerts</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">Items nearing reorder threshold</p>
        </div>
        <div className="bg-warning/10 text-warning flex size-8 items-center justify-center rounded-full">
          <AlertTriangle className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
        ) : !items || items.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-6 text-center text-sm">
            <PackageCheck className="text-success size-6" />
            All products are above their reorder point.
          </div>
        ) : (
          items.map((item) => {
            const pct = Math.round((item.quantity / item.reorderPoint) * 100);
            return (
              <div key={item.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {item.quantity} / {item.reorderPoint} left
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
