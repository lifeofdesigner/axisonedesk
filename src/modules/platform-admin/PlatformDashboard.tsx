import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { KpiCard } from "@/shared/components/data/KpiCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePlatformDashboardStats } from "@/core/platform-admin/hooks";

function pctDelta(current: number, previous: number): { delta: string; trend: "up" | "down" } | null {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return { delta: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`, trend: change >= 0 ? "up" : "down" };
}

export function PlatformDashboard() {
  const { data: stats, isLoading } = usePlatformDashboardStats();

  const statusData = stats
    ? [
        { name: "Active", value: stats.activeCompanies, fill: "hsl(var(--chart-1))" },
        { name: "Trialing", value: stats.trialingCompanies, fill: "hsl(var(--chart-2))" },
        { name: "Past due", value: stats.pastDueCompanies, fill: "hsl(var(--warning))" },
        { name: "Suspended", value: stats.suspendedCompanies, fill: "hsl(var(--destructive))" },
        { name: "Archived", value: stats.archivedCompanies, fill: "hsl(var(--muted-foreground))" },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Platform dashboard" description="Real-time metrics across every tenant." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !stats ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          <>
            <KpiCard label="Total companies" value={String(stats.totalCompanies)} caption="all statuses" />
            <KpiCard label="Active companies" value={String(stats.activeCompanies)} caption="currently active" />
            <KpiCard label="Trialing" value={String(stats.trialingCompanies)} caption="in trial" />
            <KpiCard label="Suspended" value={String(stats.suspendedCompanies)} caption="access blocked" />
            <KpiCard label="MRR" value={`$${stats.mrr.toFixed(2)}`} caption="from active subscriptions" />
            <KpiCard label="ARR" value={`$${stats.arr.toFixed(2)}`} caption="MRR × 12" />
            <KpiCard label="Total users" value={String(stats.totalUsers)} caption="across all tenants" />
            <KpiCard
              label="New signups (30d)"
              value={String(stats.newSignups30d)}
              {...(pctDelta(stats.newSignups30d, stats.newSignupsPrev30d) ?? {})}
              caption="vs. previous 30 days"
            />
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Companies by status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} allowDecimals={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Plan breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : !stats || stats.planBreakdown.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">No subscriptions yet.</p>
            ) : (
              stats.planBreakdown.map((p) => (
                <div key={p.plan} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{p.plan}</span>
                  <span className="text-muted-foreground text-sm tabular-nums">{p.count} companies</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
