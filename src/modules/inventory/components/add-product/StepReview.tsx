import { Badge } from "@/shared/components/ui/badge";
import { useCategories, useSuppliers } from "@/modules/inventory/hooks";
import type { AddProductForm } from "@/modules/inventory/components/add-product/schema";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function StepReview({ form }: { form: AddProductForm }) {
  const values = form.getValues();
  const { data: categories } = useCategories();
  const { data: suppliers } = useSuppliers();
  const category = categories?.find((c) => c.id === values.categoryId);
  const supplier = suppliers?.find((s) => s.id === values.supplierId);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        {values.images[0] ? (
          <img
            src={values.images[0].url}
            alt=""
            className="bg-muted size-20 shrink-0 rounded-lg object-cover"
          />
        ) : null}
        <div>
          <p className="text-base font-semibold">{values.name}</p>
          <p className="text-muted-foreground text-sm">{values.sku}</p>
          {category ? (
            <Badge variant="secondary" className="mt-1.5 font-normal">
              {category.name}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border px-4">
        <Row label="Cost price" value={`$${Number(values.costPrice).toFixed(2)}`} />
        <Row label="Selling price" value={`$${Number(values.sellingPrice).toFixed(2)}`} />
        <Row label="Supplier" value={supplier?.name ?? "—"} />
        <Row label="Starting quantity" value={`${values.quantity} ${values.unit}s`} />
        <Row label="Reorder point" value={`${values.reorderPoint} ${values.unit}s`} />
        <Row label="Location" value={values.location} />
        <Row label="Variants" value={values.variants.length ? `${values.variants.length} added` : "None"} />
        <Row label="Images" value={`${values.images.length} added`} />
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">{values.description}</p>
    </div>
  );
}
