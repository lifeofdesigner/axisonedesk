import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Layers } from "lucide-react";
import type { AddProductForm } from "@/modules/inventory/components/add-product/schema";

export function StepVariants({ form }: { form: AddProductForm }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "variants" });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Variants (optional)</p>
          <p className="text-muted-foreground text-xs">
            Add sizes, flavors, or formats sold at different prices or stock levels.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", sku: "", priceDelta: 0, quantity: 0 })}
        >
          <Plus className="size-4" />
          Add variant
        </Button>
      </div>

      {fields.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No variants added"
          description="Skip this step if this product doesn't need size or flavor options."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 items-end gap-3 rounded-lg border p-3 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
            >
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Name</Label>
                <Input placeholder="e.g. Large" {...form.register(`variants.${index}.name`)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">SKU</Label>
                <Input placeholder="e.g. -L" {...form.register(`variants.${index}.sku`)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Price delta</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register(`variants.${index}.priceDelta`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Quantity</Label>
                <Input type="number" min="0" {...form.register(`variants.${index}.quantity`)} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => remove(index)}
                aria-label="Remove variant"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
