import { FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { FileDropzone, type DroppedImage } from "@/shared/components/forms/FileDropzone";
import type { AddProductForm } from "@/modules/inventory/components/add-product/schema";

export function StepImages({ form }: { form: AddProductForm }) {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product images</FormLabel>
          <FileDropzone
            images={field.value as DroppedImage[]}
            onChange={(images) => field.onChange(images)}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
