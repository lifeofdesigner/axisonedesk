import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Package } from "lucide-react";
import { ProductPickerCombobox } from "@/modules/orders/components/ProductPickerCombobox";
import { useSellableProducts } from "@/modules/orders/hooks";

export interface DraftOrderItem {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  maxAvailable: number;
}

export function OrderItemsBuilder({
  items,
  onChange,
}: {
  items: DraftOrderItem[];
  onChange: (items: DraftOrderItem[]) => void;
}) {
  const { data: products } = useSellableProducts();

  function addProduct(productId: string) {
    const product = products?.find((p) => p.id === productId);
    if (!product) return;
    onChange([
      ...items,
      {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        unitPrice: product.sellingPrice,
        quantity: 1,
        maxAvailable: product.quantityAvailable,
      },
    ]);
  }

  function setQuantity(productId: string, quantity: number) {
    const clamped = Math.max(1, Math.min(quantity, items.find((i) => i.productId === productId)?.maxAvailable ?? 1));
    onChange(items.map((i) => (i.productId === productId ? { ...i, quantity: clamped } : i)));
  }

  function removeItem(productId: string) {
    onChange(items.filter((i) => i.productId !== productId));
  }

  return (
    <div className="flex flex-col gap-4">
      <ProductPickerCombobox excludeIds={items.map((i) => i.productId)} onSelect={addProduct} />

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No items yet"
          description="Search for a product above to add it to this order."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-muted-foreground text-xs">
                  {item.sku} · ${item.unitPrice.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={item.maxAvailable}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.productId, Number(e.target.value) || 1)}
                  className="w-16 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  aria-label="Increase quantity"
                  disabled={item.quantity >= item.maxAvailable}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>

              <p className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </p>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive"
                onClick={() => removeItem(item.productId)}
                aria-label="Remove item"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
