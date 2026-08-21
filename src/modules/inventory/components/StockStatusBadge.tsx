import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { StockStatus } from "@/modules/inventory/types";

const styles: Record<StockStatus, string> = {
  in_stock: "bg-success/10 text-success border-success/20",
  low_stock: "bg-warning/10 text-warning border-warning/20",
  out_of_stock: "bg-destructive/10 text-destructive border-destructive/20",
};

const labels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

export function StockStatusBadge({ status }: { status: StockStatus }) {
  return (
    <Badge variant="outline" className={cn("font-normal", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
