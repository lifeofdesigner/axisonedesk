import { useNavigate } from "react-router-dom";
import { Plus, Truck } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { KpiCard } from "@/shared/components/data/KpiCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useSuppliers, usePurchaseOrders } from "@/modules/purchasing/hooks";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  ordered: "bg-warning/10 text-warning border-warning/20",
  received: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function PurchasingOverview() {
  const { data: orders, isLoading } = usePurchaseOrders();
  const { data: suppliers } = useSuppliers();
  const navigate = useNavigate();

  const outstanding = (orders ?? []).filter((o) => o.status === "ordered");

  return (
    <div>
      <PageHeader
        title="Purchasing"
        description="Purchase orders against your suppliers."
        actions={
          <Button size="sm" onClick={() => navigate("/purchasing/new")}>
            <Plus className="size-4" />
            New purchase order
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Outstanding orders" value={String(outstanding.length)} caption="awaiting receipt" />
        <KpiCard
          label="Outstanding value"
          value={`$${outstanding.reduce((s, o) => s + o.total, 0).toFixed(2)}`}
          caption="not yet received"
        />
        <KpiCard label="Suppliers" value={String(suppliers?.length ?? 0)} caption="on file" />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="No purchase orders yet"
            description="Create your first purchase order to restock from a supplier."
            action={
              <Button size="sm" onClick={() => navigate("/purchasing/new")}>
                <Plus className="size-4" />
                New purchase order
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((po) => (
                  <TableRow key={po.id} className="cursor-pointer" onClick={() => navigate(`/purchasing/${po.id}`)}>
                    <TableCell className="font-medium">
                      {suppliers?.find((s) => s.id === po.supplierId)?.name ?? "No supplier"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-normal capitalize", statusStyles[po.status])}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">${po.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
