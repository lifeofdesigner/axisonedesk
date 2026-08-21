import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Boxes } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/data/EmptyState";

import {
  useActivityLog,
  useCategories,
  useProduct,
  useStockMovements,
  useSuppliers,
  useVariants,
} from "@/modules/inventory/hooks";
import { getStockStatus } from "@/modules/inventory/types";
import { StockStatusBadge } from "@/modules/inventory/components/StockStatusBadge";
import { ProductGallery } from "@/modules/inventory/components/ProductGallery";
import { ProductInfoCards } from "@/modules/inventory/components/ProductInfoCards";
import { ProductBarcodeCard } from "@/modules/inventory/components/ProductBarcodeCard";
import { StockHistoryTimeline } from "@/modules/inventory/components/StockHistoryTimeline";
import { VariantsTable } from "@/modules/inventory/components/VariantsTable";
import { ActivityLogList } from "@/modules/inventory/components/ActivityLogList";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useProduct(productId ?? "");
  const { data: categories } = useCategories();
  const { data: suppliers } = useSuppliers();
  const { data: movements, isLoading: movementsLoading } = useStockMovements(productId ?? "");
  const { data: variants, isLoading: variantsLoading } = useVariants(productId ?? "");
  const { data: activity, isLoading: activityLoading } = useActivityLog(productId ?? "");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Skeleton className="aspect-square w-full rounded-xl" />
        </div>
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon={Boxes}
        title="Product not found"
        description="This product may have been removed."
        action={
          <Button onClick={() => navigate("/inventory/products")} size="sm">
            Back to products
          </Button>
        }
      />
    );
  }

  const category = categories?.find((c) => c.id === product.categoryId);
  const supplier = suppliers?.find((s) => s.id === product.supplierId);

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-3 -ml-2"
        onClick={() => navigate("/inventory/products")}
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{product.name}</h1>
            <StockStatusBadge status={getStockStatus(product)} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {product.sku} {category ? <>· {category.name}</> : null}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline">
            <Link to={`/inventory/adjustments?productId=${product.id}`}>Adjust stock</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <ProductGallery images={product.images} name={product.name} />
          <ProductBarcodeCard barcode={product.barcode} sku={product.sku} />
        </div>

        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {product.description}
              </p>
              {category ? (
                <Badge variant="secondary" className="mt-3 font-normal">
                  {category.name}
                </Badge>
              ) : null}
            </CardContent>
          </Card>

          <ProductInfoCards product={product} supplier={supplier} />

          <Card className="gap-0 py-0">
            <Tabs defaultValue="history">
              <div className="border-b px-5 pt-4">
                <TabsList>
                  <TabsTrigger value="history">Stock history</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="activity">Activity log</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="history" className="p-5">
                <StockHistoryTimeline movements={movements} isLoading={movementsLoading} />
              </TabsContent>
              <TabsContent value="variants" className="p-5">
                <VariantsTable variants={variants} isLoading={variantsLoading} baseProduct={product} />
              </TabsContent>
              <TabsContent value="activity" className="p-5">
                <ActivityLogList entries={activity} isLoading={activityLoading} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
