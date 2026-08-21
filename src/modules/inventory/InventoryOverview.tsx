import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Boxes, DollarSign, PackageX, Tags } from "lucide-react";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { KpiCard } from "@/shared/components/data/KpiCard";
import { useCategories, useProducts } from "@/modules/inventory/hooks";
import { getStockStatus } from "@/modules/inventory/types";
import { StockMovementChart } from "@/modules/inventory/components/StockMovementChart";
import { resolveCategoryIcon } from "@/modules/inventory/lib/category-icons";
import { categorySoftBgClass, categoryTextClass } from "@/modules/inventory/lib/category-colors";

export function InventoryOverview() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const stats = useMemo(() => {
    if (!products) return null;
    const lowStock = products.filter((p) => getStockStatus(p) === "low_stock").length;
    const outOfStock = products.filter((p) => getStockStatus(p) === "out_of_stock").length;
    const inventoryValue = products.reduce((sum, p) => sum + p.costPrice * p.quantity, 0);
    return { total: products.length, lowStock, outOfStock, inventoryValue };
  }, [products]);

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock levels, categories, and movement across your business."
        actions={
          <Button asChild>
            <Link to="/inventory/products/new">Add product</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {isLoading || !stats ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : (
          <>
            <KpiCard label="Total products" value={String(stats.total)} icon={Boxes} />
            <KpiCard
              label="Low stock"
              value={String(stats.lowStock)}
              icon={AlertTriangle}
              tone="warning"
              caption="Below reorder point"
            />
            <KpiCard
              label="Out of stock"
              value={String(stats.outOfStock)}
              icon={PackageX}
              tone="destructive"
              caption="Needs restocking"
            />
            <KpiCard
              label="Categories"
              value={String(categories?.length ?? 0)}
              icon={Tags}
            />
            <KpiCard
              label="Inventory value"
              value={`$${stats.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={DollarSign}
              caption="At cost price"
            />
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StockMovementChart />
        </div>

        <div className="rounded-xl border">
          <div className="border-b p-5">
            <p className="text-sm font-semibold">Categories</p>
            <p className="text-muted-foreground mt-1 text-xs">Products by category</p>
          </div>
          <div className="flex flex-col divide-y">
            {categoriesLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="size-9 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))
              : categories?.map((category) => {
                  const Icon = resolveCategoryIcon(category.icon);
                  return (
                    <Link
                      key={category.id}
                      to="/inventory/categories"
                      className="hover:bg-muted/40 flex items-center gap-3 p-4 transition-colors"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${categorySoftBgClass(category.color)}`}
                      >
                        <Icon className={`size-4 ${categoryTextClass(category.color)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{category.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {category.productCount} products
                        </p>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
