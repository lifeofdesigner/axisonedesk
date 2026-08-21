import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useSuppliers } from "@/modules/inventory/hooks";
import type { AddProductForm } from "@/modules/inventory/components/add-product/schema";

const units = ["cup", "piece", "bag", "bottle", "carton", "pack", "unit"];

export function StepPricingInventory({ form }: { form: AddProductForm }) {
  const { data: suppliers } = useSuppliers();
  const cost = Number(form.watch("costPrice")) || 0;
  const selling = Number(form.watch("sellingPrice")) || 0;
  const margin = selling - cost;
  const marginPct = selling > 0 ? (margin / selling) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="costPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} value={field.value as string | number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} value={field.value as string | number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {selling > 0 ? (
        <div className="bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
          <span className="text-muted-foreground">Estimated margin</span>
          <span className="font-medium">
            ${margin.toFixed(2)} <span className="text-muted-foreground">({marginPct.toFixed(0)}%)</span>
          </span>
        </div>
      ) : null}

      <FormField
        control={form.control}
        name="supplierId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose supplier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {suppliers?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Back Storage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting quantity</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="1" {...field} value={field.value as string | number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reorderPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder point</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="1" {...field} value={field.value as string | number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
