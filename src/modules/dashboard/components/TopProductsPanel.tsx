import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTopProducts } from "@/modules/dashboard/hooks";

export function TopProductsPanel() {
  const { data: topProducts, isLoading } = useTopProducts();
  const maxUnits = Math.max(1, ...(topProducts ?? []).map((p) => p.unitsSold));

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">Top products</CardTitle>
        <p className="text-muted-foreground text-xs">By units sold, last 30 days</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
        ) : !topProducts || topProducts.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No sales in the last 30 days yet.
          </p>
        ) : (
          topProducts.map((product, index) => (
            <div key={product.productName} className="flex items-center gap-3">
              <span className="text-muted-foreground w-4 text-sm font-medium tabular-nums">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{product.productName}</span>
                  <span className="text-muted-foreground tabular-nums">
                    ${product.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-chart-1 h-full rounded-full"
                    style={{ width: `${(product.unitsSold / maxUnits) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
