import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { cn } from "@/shared/lib/utils";
import { useCreateCategory, useUpdateCategory } from "@/modules/inventory/hooks";
import {
  categoryIconOptions,
  resolveCategoryIcon,
} from "@/modules/inventory/lib/category-icons";
import {
  categoryColorOptions,
  categorySwatchClass,
} from "@/modules/inventory/lib/category-colors";
import type { Category } from "@/modules/inventory/types";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Add a short description"),
  icon: z.string().min(1),
  color: z.string().min(1),
});

type CategoryValues = z.infer<typeof categorySchema>;

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}) {
  const isEdit = Boolean(category);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", icon: "Package", color: "chart-1" },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        category
          ? {
              name: category.name,
              description: category.description,
              icon: category.icon,
              color: category.color,
            }
          : { name: "", description: "", icon: "Package", color: "chart-1" },
      );
    }
  }, [open, category, form]);

  async function onSubmit(values: CategoryValues) {
    try {
      if (isEdit && category) {
        await updateCategory.mutateAsync({ id: category.id, input: values });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(values);
        toast.success("Category created");
      }
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong", { description: "Please try again." });
    }
  }

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this category's details." : "Group related products together."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Beverages" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Short description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {categoryIconOptions.map((name) => {
                      const Icon = resolveCategoryIcon(name);
                      const selected = field.value === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => field.onChange(name)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg border-2 transition-colors",
                            selected ? "border-primary bg-accent" : "border-border hover:bg-muted/50",
                          )}
                        >
                          <Icon className="size-4.5" />
                        </button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {categoryColorOptions.map((opt) => {
                      const selected = field.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          title={opt.label}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg border-2 transition-colors",
                            selected ? "border-primary" : "border-transparent",
                          )}
                        >
                          <span
                            className={cn("block size-5 rounded-full", categorySwatchClass(opt.value))}
                          />
                        </button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
