import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, PackagePlus, PlusCircle, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/shared/components/data/DataTable";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useState } from "react";
import { useCategories, useDeleteProduct, useProducts } from "@/modules/inventory/hooks";
import { getStockStatus, type Product } from "@/modules/inventory/types";
import { StockStatusBadge } from "@/modules/inventory/components/StockStatusBadge";
import { ProductThumb } from "@/modules/inventory/components/ProductThumb";

const columnHelper = createColumnHelper<Product & { categoryName: string }>();

export function ProductsTable({
  search,
  categoryId,
  status,
}: {
  search: string;
  categoryId: string;
  status: string;
}) {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts({
    search: search || undefined,
    categoryId: categoryId === "all" ? undefined : categoryId,
    status: status === "all" ? undefined : (status as "in_stock" | "low_stock" | "out_of_stock"),
  });
  const deleteProduct = useDeleteProduct();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const categoryMap = useMemo(
    () => new Map((categories ?? []).map((c) => [c.id, c.name])),
    [categories],
  );

  const rows = useMemo(
    () =>
      (products ?? []).map((p) => ({
        ...p,
        categoryName: (p.categoryId && categoryMap.get(p.categoryId)) || "Uncategorized",
      })),
    [products, categoryMap],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <ProductThumb
              src={row.original.images[0]}
              alt={row.original.name}
              className="size-10"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.original.name}</p>
              <p className="text-muted-foreground text-xs">{row.original.sku}</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("categoryName", {
        header: "Category",
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      }),
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: (info) => (
          <span className="text-sm tabular-nums">
            {info.getValue()} {info.row.original.unit}
            {info.getValue() === 1 ? "" : "s"}
          </span>
        ),
      }),
      columnHelper.accessor("costPrice", {
        header: "Cost price",
        cell: (info) => (
          <span className="text-sm tabular-nums">${info.getValue().toFixed(2)}</span>
        ),
      }),
      columnHelper.accessor("sellingPrice", {
        header: "Selling price",
        cell: (info) => (
          <span className="text-sm font-medium tabular-nums">${info.getValue().toFixed(2)}</span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => <StockStatusBadge status={getStockStatus(row.original)} />,
      }),
      columnHelper.accessor("updatedAt", {
        header: "Last updated",
        cell: (info) => (
          <span className="text-muted-foreground text-xs">
            {new Date(info.getValue()).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => e.stopPropagation()}
                aria-label="Product actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => navigate(`/inventory/products/${row.original.id}`)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/inventory/adjustments?productId=${row.original.id}`)
                }
              >
                Adjust stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setPendingDeleteId(row.original.id)}
              >
                <Trash2 className="size-4" />
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [navigate],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const pendingProduct = rows.find((r) => r.id === pendingDeleteId);

  return (
    <>
      <DataTable
        table={table}
        isLoading={isLoading}
        columnCount={columns.length}
        onRowClick={(row) => navigate(`/inventory/products/${row.id}`)}
        emptyState={
          search || categoryId !== "all" || status !== "all" ? (
            <EmptyState
              icon={SlidersHorizontal}
              title="No products match your filters"
              description="Try adjusting your search term or clearing filters to see more results."
            />
          ) : (
            <EmptyState
              icon={PackagePlus}
              title="No products yet"
              description="Add your first product to start tracking stock, pricing, and sales."
              action={
                <Button asChild size="sm">
                  <a href="/inventory/products/new">
                    <PlusCircle className="size-4" />
                    Add product
                  </a>
                </Button>
              }
            />
          )
        }
      />

      <AlertDialog open={Boolean(pendingDeleteId)} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingProduct?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from your inventory. This action can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (!pendingDeleteId) return;
                await deleteProduct.mutateAsync(pendingDeleteId);
                toast.success("Product deleted");
                setPendingDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
