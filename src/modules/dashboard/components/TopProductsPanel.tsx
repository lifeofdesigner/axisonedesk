import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { topProducts } from "@/modules/dashboard/data/mock";

export function TopProductsPanel() {
  const maxUnits = Math.max(...topProducts.map((p) => p.unitsSold));

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">Top products</CardTitle>
        <p className="text-muted-foreground text-xs">By units sold, last 30 days</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {topProducts.map((product, index) => (
          <div key={product.name} className="flex items-center gap-3">
            <span className="text-muted-foreground w-4 text-sm font-medium tabular-nums">
              {index + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{product.name}</span>
                <span className="text-muted-foreground tabular-nums">{product.revenue}</span>
              </div>
              <div className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-chart-1 h-full rounded-full"
                  style={{ width: `${(product.unitsSold / maxUnits) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
