import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { OrdersTable } from "@/modules/orders/components/OrdersTable";
import type { FulfillmentStatus, PaymentStatus } from "@/modules/orders/types";

export function OrdersListPage() {
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("all");

  return (
    <div>
      <PageHeader
        title="All orders"
        description="Search, filter, and drill into any order."
        actions={
          <Button asChild>
            <Link to="/orders/new">New order</Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by order number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment statuses</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partially_paid">Partially paid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={fulfillmentStatus} onValueChange={setFulfillmentStatus}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Fulfillment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fulfillment statuses</SelectItem>
            <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
            <SelectItem value="partially_fulfilled">Partially fulfilled</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrdersTable
        filters={{
          search: search || undefined,
          paymentStatus: paymentStatus === "all" ? undefined : (paymentStatus as PaymentStatus),
          fulfillmentStatus:
            fulfillmentStatus === "all" ? undefined : (fulfillmentStatus as FulfillmentStatus),
        }}
      />
    </div>
  );
}
