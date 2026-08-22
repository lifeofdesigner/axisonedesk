import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { FulfillmentStatus, PaymentStatus } from "@/modules/orders/types";

const paymentStyles: Record<PaymentStatus, string> = {
  unpaid: "bg-destructive/10 text-destructive border-destructive/20",
  partially_paid: "bg-warning/10 text-warning border-warning/20",
  paid: "bg-success/10 text-success border-success/20",
  refunded: "bg-muted text-muted-foreground border-border",
};

const paymentLabels: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially paid",
  paid: "Paid",
  refunded: "Refunded",
};

const fulfillmentStyles: Record<FulfillmentStatus, string> = {
  unfulfilled: "bg-muted text-muted-foreground border-border",
  partially_fulfilled: "bg-warning/10 text-warning border-warning/20",
  fulfilled: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const fulfillmentLabels: Record<FulfillmentStatus, string> = {
  unfulfilled: "Unfulfilled",
  partially_fulfilled: "Partially fulfilled",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={cn("font-normal", paymentStyles[status])}>
      {paymentLabels[status]}
    </Badge>
  );
}

export function FulfillmentStatusBadge({ status }: { status: FulfillmentStatus }) {
  return (
    <Badge variant="outline" className={cn("font-normal", fulfillmentStyles[status])}>
      {fulfillmentLabels[status]}
    </Badge>
  );
}
