import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { KpiCard } from "@/shared/components/data/KpiCard";
import { RevenueChart } from "@/modules/dashboard/components/RevenueChart";
import { RecentOrdersTable } from "@/modules/dashboard/components/RecentOrdersTable";
import { LowStockPanel } from "@/modules/dashboard/components/LowStockPanel";
import { TopProductsPanel } from "@/modules/dashboard/components/TopProductsPanel";
import { kpis } from "@/modules/dashboard/data/mock";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export function DashboardOverview() {
  const { activeOrg } = useCurrentOrganization();

  return (
    <div>
      <PageHeader
        title={activeOrg ? `Welcome back — ${activeOrg.name}` : "Welcome back"}
        description="Here's how your business is performing today."
        actions={<Button variant="outline">Export report</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

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
