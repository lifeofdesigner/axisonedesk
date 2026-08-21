import { Layers } from "lucide-react";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Product, ProductVariant } from "@/modules/inventory/types";

export function VariantsTable({
  variants,
  isLoading,
  baseProduct,
}: {
  variants?: ProductVariant[];
  isLoading?: boolean;
  baseProduct: Product;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!variants?.length) {
    return (
      <EmptyState
        icon={Layers}
        title="No variants"
        description="This product doesn't have size, flavor, or format variants."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Variant</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-medium">{v.name}</TableCell>
            <TableCell className="text-muted-foreground">{v.sku}</TableCell>
            <TableCell className="tabular-nums">
              ${(baseProduct.sellingPrice + v.priceDelta).toFixed(2)}
              {v.priceDelta !== 0 ? (
                <span className="text-muted-foreground ml-1 text-xs">
                  ({v.priceDelta > 0 ? "+" : ""}
                  {v.priceDelta.toFixed(2)})
                </span>
              ) : null}
            </TableCell>
            <TableCell className="text-right tabular-nums">{v.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
