import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useRecentOrders } from "@/modules/dashboard/hooks";
import { cn } from "@/shared/lib/utils";
import { ClipboardList } from "lucide-react";

const paymentStyles: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20",
  partially_paid: "bg-warning/10 text-warning border-warning/20",
  unpaid: "bg-muted text-muted-foreground border-border",
  refunded: "bg-destructive/10 text-destructive border-destructive/20",
};

const fulfillmentStyles: Record<string, string> = {
  fulfilled: "bg-success/10 text-success border-success/20",
  partially_fulfilled: "bg-warning/10 text-warning border-warning/20",
  unfulfilled: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

function formatLabel(status: string) {
  return status
    .split("_")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
}

export function RecentOrdersTable() {
  const { data: orders, isLoading } = useRecentOrders();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">Recent orders</CardTitle>
        <p className="text-muted-foreground text-xs">Latest activity across all channels</p>
      </CardHeader>
      <CardContent className="px-0 sm:px-2">
        {isLoading ? (
          <div className="space-y-2 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders yet"
            description="Orders will show up here as soon as one is created."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      ORD-{String(order.orderNumber).padStart(5, "0")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{order.customerName}</span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={cn("font-normal", paymentStyles[order.paymentStatus])}
                      >
                        {formatLabel(order.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-normal", fulfillmentStyles[order.fulfillmentStatus])}
                      >
                        {formatLabel(order.fulfillmentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ${order.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
