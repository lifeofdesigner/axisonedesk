import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ClipboardList, SlidersHorizontal } from "lucide-react";

import { DataTable } from "@/shared/components/data/DataTable";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Button } from "@/shared/components/ui/button";
import { useCustomers, useOrders } from "@/modules/orders/hooks";
import type { Order } from "@/modules/orders/types";
import { formatOrderNumber } from "@/modules/orders/types";
import { FulfillmentStatusBadge, PaymentStatusBadge } from "@/modules/orders/components/OrderStatusBadges";
import type { OrderFilters } from "@/modules/orders/api";

const columnHelper = createColumnHelper<Order & { customerName: string }>();

export function OrdersTable({ filters }: { filters: OrderFilters }) {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders(filters);
  const { data: customers } = useCustomers();

  const customerMap = useMemo(
    () => new Map((customers ?? []).map((c) => [c.id, c.name])),
    [customers],
  );

  const rows = useMemo(
    () =>
      (orders ?? []).map((o) => ({
        ...o,
        customerName: (o.customerId && customerMap.get(o.customerId)) || "Walk-in",
      })),
    [orders, customerMap],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "order",
        header: "Order",
        cell: ({ row }) => (
          <span className="text-sm font-medium">{formatOrderNumber(row.original.orderNumber)}</span>
        ),
      }),
      columnHelper.accessor("customerName", {
        header: "Customer",
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "payment",
        header: "Payment",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
      }),
      columnHelper.display({
        id: "fulfillment",
        header: "Fulfillment",
        cell: ({ row }) => <FulfillmentStatusBadge status={row.original.fulfillmentStatus} />,
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: (info) => (
          <span className="text-sm font-medium tabular-nums">${info.getValue().toFixed(2)}</span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
          <span className="text-muted-foreground text-xs">
            {new Date(info.getValue()).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      columnCount={columns.length}
      onRowClick={(row) => navigate(`/orders/${row.id}`)}
      emptyState={
        filters.paymentStatus || filters.fulfillmentStatus || filters.search ? (
          <EmptyState
            icon={SlidersHorizontal}
            title="No orders match your filters"
            description="Try adjusting your search term or clearing filters to see more results."
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No orders yet"
            description="Create your first order to start selling."
            action={
              <Button asChild size="sm">
                <a href="/orders/new">New order</a>
              </Button>
            }
          />
        )
      }
    />
  );
}
