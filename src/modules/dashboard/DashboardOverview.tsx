import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { KpiCard } from "@/shared/components/data/KpiCard";
import { RevenueChart } from "@/modules/dashboard/components/RevenueChart";
import { RecentOrdersTable } from "@/modules/dashboard/components/RecentOrdersTable";
import { LowStockPanel } from "@/modules/dashboard/components/LowStockPanel";
import { TopProductsPanel } from "@/modules/dashboard/components/TopProductsPanel";
import { useDashboardKpis } from "@/modules/dashboard/hooks";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";
import { useActiveOrgExperienceConfig } from "@/core/industries/hooks";

function pctDelta(current: number, previous: number): { delta: string; trend: "up" | "down" } | null {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return { delta: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`, trend: change >= 0 ? "up" : "down" };
}

export function DashboardOverview() {
  const { activeOrg } = useCurrentOrganization();
  const { data: kpis, isLoading } = useDashboardKpis();
  // Dynamic Experience Engine (Industry Module Engine Phase 4 slice 1) —
  // renders only when the active org's type has real seeded quick actions;
  // absent for orgs with no organization_type_key or an unconfigured type,
  // by design (see ADR-011, docs/00_ADOS/DECISIONS.md).
  const { data: experienceConfig } = useActiveOrgExperienceConfig();
  const quickActions = experienceConfig?.quickActions ?? [];

  const cards = kpis
    ? [
        {
          label: "Revenue (30d)",
          value: `$${kpis.revenue30d.toFixed(2)}`,
          ...pctDelta(kpis.revenue30d, kpis.revenuePrev30d),
          caption: "vs. previous 30 days",
        },
        {
          label: "Orders",
          value: String(kpis.orders30d),
          ...pctDelta(kpis.orders30d, kpis.ordersPrev30d),
          caption: "vs. previous 30 days",
        },
        {
          label: "Avg. order value",
          value: `$${kpis.avgOrderValue30d.toFixed(2)}`,
          ...pctDelta(kpis.avgOrderValue30d, kpis.avgOrderValuePrev30d),
          caption: "vs. previous 30 days",
        },
        {
          label: "Active customers",
          value: String(kpis.activeCustomers30d),
          ...pctDelta(kpis.activeCustomers30d, kpis.activeCustomersPrev30d),
          caption: "vs. previous 30 days",
        },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title={activeOrg ? `Welcome back — ${activeOrg.name}` : "Welcome back"}
        description="Here's how your business is performing today."
        actions={<Button variant="outline">Export report</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
          : cards.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {quickActions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button key={action.key} variant="outline" size="sm" asChild>
              <Link to={action.route}>{action.label}</Link>
            </Button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <LowStockPanel />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrdersTable />
        </div>
        <TopProductsPanel />
      </div>
    </div>
  );
}
