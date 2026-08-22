import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import {
  useCustomers,
  useOrder,
  useOrderEvents,
  useOrderItems,
  useUpdateOrderStatus,
} from "@/modules/orders/hooks";
import { formatOrderNumber, type FulfillmentStatus, type PaymentStatus } from "@/modules/orders/types";
import { FulfillmentStatusBadge, PaymentStatusBadge } from "@/modules/orders/components/OrderStatusBadges";
import { OrderTimeline } from "@/modules/orders/components/OrderTimeline";
import { OrderNotesPanel } from "@/modules/orders/components/OrderNotesPanel";

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useOrder(orderId ?? "");
  const { data: items, isLoading: itemsLoading } = useOrderItems(orderId ?? "");
  const { data: events, isLoading: eventsLoading } = useOrderEvents(orderId ?? "");
  const { data: customers } = useCustomers();
  const updateStatus = useUpdateOrderStatus();

  const customer = customers?.find((c) => c.id === order?.customerId);

  async function handlePaymentStatusChange(value: string) {
    if (!orderId) return;
    try {
      await updateStatus.mutateAsync({ orderId, paymentStatus: value as PaymentStatus });
      toast.success("Payment status updated");
    } catch {
      toast.error("Couldn't update payment status");
    }
  }

  async function handleFulfillmentStatusChange(value: string) {
    if (!orderId) return;
    try {
      await updateStatus.mutateAsync({ orderId, fulfillmentStatus: value as FulfillmentStatus });
      toast.success(
        value === "cancelled" ? "Order cancelled — stock restocked" : "Fulfillment status updated",
      );
    } catch {
      toast.error("Couldn't update fulfillment status");
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-64 lg:col-span-4" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Order not found"
        description="This order may have been removed."
        action={
          <Button onClick={() => navigate("/orders")} size="sm">
            Back to orders
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate("/orders/list")}>
        <ArrowLeft className="size-4" />
        Back to orders
      </Button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {formatOrderNumber(order.orderNumber)}
            </h1>
            <PaymentStatusBadge status={order.paymentStatus} />
            <FulfillmentStatusBadge status={order.fulfillmentStatus} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {customer?.name ?? "Walk-in customer"} ·{" "}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Items</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-2">
              {itemsLoading ? (
                <div className="space-y-2 px-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Unit price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            ${item.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            ${item.lineTotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 py-0">
            <Tabs defaultValue="timeline">
              <div className="border-b px-5 pt-4">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="timeline" className="p-5">
                <OrderTimeline events={events} isLoading={eventsLoading} />
              </TabsContent>
              <TabsContent value="notes" className="p-5">
                <OrderNotesPanel orderId={order.id} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs">Payment</span>
                <Select value={order.paymentStatus} onValueChange={handlePaymentStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partially_paid">Partially paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs">Fulfillment</span>
                <Select value={order.fulfillmentStatus} onValueChange={handleFulfillmentStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                    <SelectItem value="partially_fulfilled">Partially fulfilled</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="tabular-nums">-${order.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="tabular-nums">${order.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="tabular-nums">${order.shippingAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {customer ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{customer.name}</p>
                {customer.email ? <p className="text-muted-foreground">{customer.email}</p> : null}
                {customer.phone ? <p className="text-muted-foreground">{customer.phone}</p> : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
