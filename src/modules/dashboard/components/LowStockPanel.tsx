import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { lowStockItems } from "@/modules/dashboard/data/mock";

export function LowStockPanel() {
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
        {lowStockItems.map((item) => {
          const pct = Math.round((item.remaining / item.reorderAt) * 100);
          return (
            <div key={item.sku} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground text-xs">
                  {item.remaining} / {item.reorderAt} left
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
