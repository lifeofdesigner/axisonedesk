import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { revenueSeries } from "@/modules/dashboard/data/mock";

const ranges = [
  { key: "7d", label: "7D", days: 7 },
  { key: "30d", label: "30D", days: 30 },
] as const;

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  if (!point) return null;

  return (
    <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-semibold">${point.value.toLocaleString()}</p>
    </div>
  );
}

export function RevenueChart() {
  const [range, setRange] = useState<(typeof ranges)[number]["key"]>("30d");

  const data = useMemo(() => {
    const days = ranges.find((r) => r.key === range)?.days ?? 30;
    return revenueSeries.slice(-days);
  }, [range]);

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Revenue</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">Daily revenue across all channels</p>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as typeof range)}>
          <TabsList>
            {ranges.map((r) => (
              <TabsTrigger key={r.key} value={r.key} className="text-xs">
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-72 px-2 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(v) => `$${v / 1000}k`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              strokeLinecap="round"
              fill="url(#revenueFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(var(--chart-1))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
