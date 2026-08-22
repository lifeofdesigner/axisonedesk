import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CustomerCombobox } from "@/modules/orders/components/CustomerCombobox";
import { OrderItemsBuilder, type DraftOrderItem } from "@/modules/orders/components/OrderItemsBuilder";
import { useCreateOrder } from "@/modules/orders/hooks";

export function CreateOrderPage() {
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [items, setItems] = useState<DraftOrderItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState("0");
  const [taxAmount, setTaxAmount] = useState("0");
  const [shippingAmount, setShippingAmount] = useState("0");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );
  const discount = Number(discountAmount) || 0;
  const tax = Number(taxAmount) || 0;
  const shipping = Number(shippingAmount) || 0;
  const total = subtotal - discount + tax + shipping;

  async function handleSubmit() {
    if (items.length === 0) {
      toast.error("Add at least one item before creating the order.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder.mutateAsync({
        customerId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        discountAmount: discount,
        taxAmount: tax,
        shippingAmount: shipping,
      });
      toast.success("Order created");
      navigate(`/orders/${order.id}`);
    } catch (error) {
      toast.error("Couldn't create order", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New order" description="Build an order from your current inventory." />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerCombobox value={customerId} onChange={setCustomerId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderItemsBuilder items={items} onChange={setItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Discount, tax & shipping</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Discount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Tax</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Shipping</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={shippingAmount}
                onChange={(e) => setShippingAmount(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-2 py-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="tabular-nums">-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="tabular-nums">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="tabular-nums">${shipping.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => navigate("/orders")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || items.length === 0}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Create order
          </Button>
        </div>
      </div>
    </div>
  );
}
