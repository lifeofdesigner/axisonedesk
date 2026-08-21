import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Loader2, PackageSearch } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { ProductCombobox } from "@/modules/inventory/components/ProductCombobox";
import { StockHistoryTimeline } from "@/modules/inventory/components/StockHistoryTimeline";
import { useAdjustStock, useProduct, useStockMovements } from "@/modules/inventory/hooks";
import type { StockMovementType } from "@/modules/inventory/types";

const reasonsByType: Record<StockMovementType, string[]> = {
  increase: ["Purchase order received", "Return from customer", "Inventory recount", "Other"],
  decrease: ["Damaged / spoiled", "Staff consumption", "Theft or loss", "Inventory recount", "Other"],
  transfer: ["Restock front counter", "Consolidate storage", "Seasonal relocation", "Other"],
};

const adjustmentSchema = z.object({
  quantity: z.coerce.number().int().positive("Enter a quantity greater than zero"),
  reason: z.string().min(1, "Choose a reason"),
  notes: z.string(),
  toLocation: z.string().optional(),
});

type AdjustmentValues = z.infer<typeof adjustmentSchema>;
type AdjustmentInput = z.input<typeof adjustmentSchema>;

export function StockAdjustmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const [type, setType] = useState<StockMovementType>("increase");

  const { data: product } = useProduct(productId);
  const { data: movements, isLoading: movementsLoading } = useStockMovements(productId);
  const adjustStock = useAdjustStock();

  const form = useForm<AdjustmentInput, unknown, AdjustmentValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { quantity: 1, reason: "", notes: "", toLocation: "" },
  });

  function selectProduct(id: string) {
    setSearchParams(id ? { productId: id } : {});
    form.reset({ quantity: 1, reason: "", notes: "", toLocation: "" });
  }

  async function onSubmit(values: AdjustmentValues) {
    if (!productId) return;
    try {
      await adjustStock.mutateAsync({
        productId,
        type,
        quantity: values.quantity,
        reason: values.reason,
        notes: values.notes,
        toLocation: type === "transfer" ? values.toLocation : undefined,
      });
      toast.success("Stock updated", {
        description: `${product?.name} ${type === "increase" ? "increased" : type === "decrease" ? "decreased" : "transferred"} by ${values.quantity}.`,
      });
      form.reset({ quantity: 1, reason: "", notes: "", toLocation: "" });
    } catch {
      toast.error("Couldn't update stock", { description: "Please try again." });
    }
  }

  return (
    <div>
      <PageHeader
        title="Stock adjustment"
        description="Increase, decrease, or transfer stock — every change is logged."
      />

      <div className="mb-6">
        <ProductCombobox value={productId} onChange={selectProduct} />
      </div>

      {!productId ? (
        <EmptyState
          icon={PackageSearch}
          title="Choose a product to adjust"
          description="Search by name or SKU above to view its stock and make an adjustment."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {product ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="bg-muted size-10 rounded-lg object-cover"
                  />
                ) : null}
                <div>
                  <CardTitle className="text-base">{product?.name}</CardTitle>
                  <p className="text-muted-foreground text-xs">
                    Current stock:{" "}
                    <span className="font-medium">
                      {product?.quantity} {product?.unit}s
                    </span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={type}
                onValueChange={(v) => {
                  setType(v as StockMovementType);
                  form.setValue("reason", "");
                }}
                className="mb-5"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="increase" className="flex-1">
                    <ArrowUpRight className="size-4" />
                    Increase
                  </TabsTrigger>
                  <TabsTrigger value="decrease" className="flex-1">
                    <ArrowDownLeft className="size-4" />
                    Decrease
                  </TabsTrigger>
                  <TabsTrigger value="transfer" className="flex-1">
                    <ArrowRightLeft className="size-4" />
                    Transfer
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            {...field}
                            value={field.value as string | number}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {type === "transfer" ? (
                    <FormField
                      control={form.control}
                      name="toLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transfer to</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Main Counter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reasonsByType[type].map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Add any extra context…" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={adjustStock.isPending} className="mt-1">
                    {adjustStock.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    Confirm {type}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">History</CardTitle>
              <p className="text-muted-foreground text-xs">Recent adjustments for this product</p>
            </CardHeader>
            <CardContent>
              <StockHistoryTimeline movements={movements} isLoading={movementsLoading} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
