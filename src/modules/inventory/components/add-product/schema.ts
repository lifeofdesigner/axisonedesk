import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  priceDelta: z.coerce.number(),
  quantity: z.coerce.number().int().min(0),
});

export const addProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  categoryId: z.string(),
  description: z.string().min(10, "Add at least a short description"),
  images: z.array(z.object({ id: z.string(), url: z.string() })).min(1, "Add at least one image"),
  costPrice: z.coerce.number().positive("Enter a cost price"),
  sellingPrice: z.coerce.number().positive("Enter a selling price"),
  supplierId: z.string(),
  unit: z.string().min(1, "Unit is required"),
  location: z.string().min(1, "Storage location is required"),
  quantity: z.coerce.number().int().min(0),
  reorderPoint: z.coerce.number().int().min(0),
  variants: z.array(variantSchema),
});

export type AddProductValues = z.infer<typeof addProductSchema>;
export type AddProductInput = z.input<typeof addProductSchema>;
export type AddProductForm = UseFormReturn<AddProductInput, unknown, AddProductValues>;

export const stepFields: Record<number, (keyof AddProductValues)[]> = {
  0: ["name", "sku", "categoryId", "description"],
  1: ["images"],
  2: ["costPrice", "sellingPrice", "supplierId", "unit", "location", "quantity", "reorderPoint"],
  3: ["variants"],
  4: [],
};

export const steps = [
  { key: "basics", label: "Basic info" },
  { key: "images", label: "Images" },
  { key: "pricing", label: "Pricing & inventory" },
  { key: "variants", label: "Variants" },
  { key: "review", label: "Review" },
] as const;
