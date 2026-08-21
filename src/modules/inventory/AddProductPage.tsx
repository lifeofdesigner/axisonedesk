import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Form } from "@/shared/components/ui/form";
import { PageHeader } from "@/shared/components/layout/PageHeader";

import {
  addProductSchema,
  stepFields,
  steps,
  type AddProductInput,
  type AddProductValues,
} from "@/modules/inventory/components/add-product/schema";
import { StepIndicator } from "@/modules/inventory/components/add-product/StepIndicator";
import { StepBasics } from "@/modules/inventory/components/add-product/StepBasics";
import { StepImages } from "@/modules/inventory/components/add-product/StepImages";
import { StepPricingInventory } from "@/modules/inventory/components/add-product/StepPricingInventory";
import { StepVariants } from "@/modules/inventory/components/add-product/StepVariants";
import { StepReview } from "@/modules/inventory/components/add-product/StepReview";
import { useCreateProduct } from "@/modules/inventory/hooks";

export function AddProductPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const createProduct = useCreateProduct();

  const form = useForm<AddProductInput, unknown, AddProductValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      description: "",
      images: [],
      costPrice: 0,
      sellingPrice: 0,
      supplierId: "",
      unit: "piece",
      location: "",
      quantity: 0,
      reorderPoint: 0,
      variants: [],
    },
  });

  async function goNext() {
    const fields = stepFields[step];
    const valid = fields?.length ? await form.trigger(fields) : true;
    if (!valid) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: AddProductValues) {
    try {
      const product = await createProduct.mutateAsync({
        name: values.name,
        sku: values.sku,
        description: values.description,
        categoryId: values.categoryId,
        supplierId: values.supplierId,
        images: values.images.map((i) => i.url),
        costPrice: Number(values.costPrice),
        sellingPrice: Number(values.sellingPrice),
        quantity: Number(values.quantity),
        reorderPoint: Number(values.reorderPoint),
        unit: values.unit,
        location: values.location,
        variants: values.variants.map((v) => ({
          name: v.name,
          sku: v.sku,
          priceDelta: Number(v.priceDelta),
          quantity: Number(v.quantity),
        })),
      });
      toast.success("Product created", { description: `${values.name} was added to inventory.` });
      navigate(`/inventory/products/${product.id}`);
    } catch {
      toast.error("Couldn't create product", { description: "Please try again." });
    }
  }

  const isLastStep = step === steps.length - 1;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add product" description="Create a new item in your inventory." />

      <StepIndicator current={step} />

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isLastStep) form.handleSubmit(onSubmit)();
                else void goNext();
              }}
            >
              {step === 0 ? <StepBasics form={form} /> : null}
              {step === 1 ? <StepImages form={form} /> : null}
              {step === 2 ? <StepPricingInventory form={form} /> : null}
              {step === 3 ? <StepVariants form={form} /> : null}
              {step === 4 ? <StepReview form={form} /> : null}

              <div className="mt-8 flex items-center justify-between border-t pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={step === 0 ? () => navigate("/inventory/products") : goBack}
                >
                  <ArrowLeft className="size-4" />
                  {step === 0 ? "Cancel" : "Back"}
                </Button>

                <Button type="submit" disabled={createProduct.isPending}>
                  {createProduct.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isLastStep ? "Create product" : "Continue"}
                  {!isLastStep ? <ArrowRight className="size-4" /> : null}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
