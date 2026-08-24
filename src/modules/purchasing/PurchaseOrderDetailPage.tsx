import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useSuppliers, usePurchaseOrder, usePurchaseOrderItems, useReceivePurchaseOrder } from "@/modules/purchasing/hooks";

export function PurchaseOrderDetailPage() {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const navigate = useNavigate();
  const { data: po, isLoading } = usePurchaseOrder(purchaseOrderId ?? "");
  const { data: items, isLoading: itemsLoading } = usePurchaseOrderItems(purchaseOrderId ?? "");
  const { data: suppliers } = useSuppliers();
  const receivePO = useReceivePurchaseOrder();

  async function handleReceive() {
    if (!purchaseOrderId) return;
    try {
      await receivePO.mutateAsync(purchaseOrderId);
      toast.success("Purchase order received — stock updated");
    } catch {
      toast.error("Couldn't receive purchase order");
    }
  }

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!po) {
    return (
      <EmptyState
        icon={Truck}
        title="Purchase order not found"
        description="This order may have been removed."
        action={
          <Button size="sm" onClick={() => navigate("/purchasing")}>
            Back to purchasing
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate("/purchasing")}>
        <ArrowLeft className="size-4" />
        Back to purchasing
      </Button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {suppliers?.find((s) => s.id === po.supplierId)?.name ?? "No supplier"}
            </h1>
            <Badge variant="outline" className="font-normal capitalize">
              {po.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {po.expectedDate ? `Expected ${new Date(po.expectedDate).toLocaleDateString()}` : "No expected date"}
          </p>
        </div>
        {po.status === "ordered" ? (
          <Button onClick={handleReceive} disabled={receivePO.isPending}>
            <PackageCheck className="size-4" />
            Mark received
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Items</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-2">
          {itemsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">${item.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">${item.lineTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {po.notes ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{po.notes}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
