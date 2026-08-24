import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Package } from "lucide-react";
import { useCreatePurchaseOrder, usePurchasableProducts, useSuppliers } from "@/modules/purchasing/hooks";

interface DraftItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
}

export function CreatePurchaseOrderPage() {
  const navigate = useNavigate();
  const { data: suppliers } = useSuppliers();
  const { data: products } = usePurchasableProducts();
  const createPO = useCreatePurchaseOrder();

  const [supplierId, setSupplierId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  function addItem() {
    const product = products?.find((p) => p.id === selectedProductId);
    if (!product) return;
    if (items.some((i) => i.productId === product.id)) return;
    setItems((prev) => [
      ...prev,
      { productId: product.id, productName: product.name, sku: product.sku, quantity: 1, unitCost: product.costPrice },
    ]);
    setSelectedProductId("");
  }

  function updateItem(productId: string, patch: Partial<DraftItem>) {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, ...patch } : i)));
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  async function handleSubmit() {
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    try {
      const po = await createPO.mutateAsync({
        supplierId: supplierId || null,
        expectedDate: expectedDate || null,
        notes: notes || null,
        items,
      });
      toast.success("Purchase order created");
      navigate(`/purchasing/${po.id}`);
    } catch {
      toast.error("Couldn't create purchase order", { description: "Please try again." });
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">New purchase order</h1>
      <p className="text-muted-foreground mt-1 text-sm">Order stock from a supplier.</p>

      <div className="mt-6 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Supplier &amp; details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            <Textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="sm:col-span-2"
              rows={2}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add a product..." />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" onClick={addItem} disabled={!selectedProductId}>
                <Plus className="size-4" />
              </Button>
            </div>

            {items.length === 0 ? (
              <EmptyState icon={Package} title="No items yet" description="Search for a product above to add it." />
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-muted-foreground text-xs">{item.sku}</p>
                    </div>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.productId, { quantity: Math.max(1, Number(e.target.value)) })}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitCost}
                      onChange={(e) => updateItem(item.productId, { unitCost: Math.max(0, Number(e.target.value)) })}
                      className="w-24"
                    />
                    <span className="w-20 text-right text-sm font-medium tabular-nums">
                      ${(item.quantity * item.unitCost).toFixed(2)}
                    </span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between border-t pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/purchasing")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createPO.isPending}>
            {createPO.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Create purchase order
          </Button>
        </div>
      </div>
    </div>
  );
}
