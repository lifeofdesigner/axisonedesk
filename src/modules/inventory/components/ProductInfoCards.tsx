import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Product, Supplier } from "@/modules/inventory/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function ProductInfoCards({
  product,
  supplier,
}: {
  product: Product;
  supplier?: Supplier;
}) {
  const margin = product.sellingPrice - product.costPrice;
  const marginPct = product.sellingPrice > 0 ? (margin / product.sellingPrice) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-sm">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <Row label="Cost price" value={`$${product.costPrice.toFixed(2)}`} />
          <Row label="Selling price" value={`$${product.sellingPrice.toFixed(2)}`} />
          <Row label="Margin" value={`$${margin.toFixed(2)} (${marginPct.toFixed(0)}%)`} />
        </CardContent>
      </Card>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-sm">Inventory</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <Row label="Quantity" value={`${product.quantity} ${product.unit}s`} />
          <Row label="Reorder point" value={`${product.reorderPoint} ${product.unit}s`} />
          <Row label="Location" value={product.location} />
        </CardContent>
      </Card>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-sm">Supplier</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <Row label="Name" value={supplier?.name ?? "—"} />
          <Row label="Contact" value={supplier?.contactName ?? "—"} />
          <Row label="Phone" value={supplier?.phone ?? "—"} />
        </CardContent>
      </Card>
    </div>
  );
}
