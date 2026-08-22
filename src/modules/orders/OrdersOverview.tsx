import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CreditCard, DollarSign, PackageX } from "lucide-react";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { KpiCard } from "@/shared/components/data/KpiCard";
import { useOrders } from "@/modules/orders/hooks";
import { OrdersTable } from "@/modules/orders/components/OrdersTable";

export function OrdersOverview() {
  const { data: orders, isLoading } = useOrders();

  const stats = useMemo(() => {
    if (!orders) return null;
    const unpaid = orders.filter((o) => o.paymentStatus === "unpaid").length;
    const unfulfilled = orders.filter(
      (o) => o.fulfillmentStatus === "unfulfilled" || o.fulfillmentStatus === "partially_fulfilled",
    ).length;
    const revenue = orders
      .filter((o) => o.fulfillmentStatus !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    return { total: orders.length, unpaid, unfulfilled, revenue };
  }, [orders]);

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Every sale, its status, and how it affects stock."
        actions={
          <Button asChild>
            <Link to="/orders/new">New order</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : (
          <>
            <KpiCard label="Total orders" value={String(stats.total)} icon={ClipboardList} />
            <KpiCard
              label="Awaiting payment"
              value={String(stats.unpaid)}
              icon={CreditCard}
              tone="warning"
              caption="Unpaid orders"
            />
            <KpiCard
              label="Awaiting fulfillment"
              value={String(stats.unfulfilled)}
              icon={PackageX}
              tone={stats.unfulfilled > 0 ? "warning" : "default"}
              caption="Not yet fulfilled"
            />
            <KpiCard
              label="Revenue"
              value={`$${stats.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={DollarSign}
              caption="Excludes cancelled orders"
            />
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Recent orders</h2>
        <OrdersTable filters={{}} />
      </div>
    </div>
  );
}
