import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useStockMovementTrend } from "@/modules/inventory/hooks";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-semibold">{entry.value} units</span>
        </div>
      ))}
    </div>
  );
}

export function StockMovementChart() {
  const { data, isLoading } = useStockMovementTrend();
  const hasActivity = data?.some((day) => day.stockIn > 0 || day.stockOut > 0);

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Stock movement</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">Units in vs. out, last 14 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="bg-chart-1 size-2 rounded-full" />
            Stock in
          </span>
          <span className="flex items-center gap-1.5">
            <span className="bg-chart-2 size-2 rounded-full" />
            Stock out
          </span>
        </div>
      </CardHeader>
      <CardContent className="h-72 px-2 sm:px-4">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : !hasActivity ? (
          <EmptyState
            icon={BarChart3}
            title="No stock movement yet"
            description="Adjustments you make will show up here as daily in/out totals."
            className="h-full justify-center border-none py-0"
          />
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar
              dataKey="stockIn"
              name="Stock in"
              fill="hsl(var(--chart-1))"
              radius={[3, 3, 0, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="stockOut"
              name="Stock out"
              fill="hsl(var(--chart-2))"
              radius={[3, 3, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
