import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Hotel,
  Loader2,
  Package,
  Pill,
  ShoppingBag,
  ShoppingCart,
  Truck,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";

import { createOrganization } from "@/core/tenant/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { cn } from "@/shared/lib/utils";

const businessTypes = [
  { value: "retail", label: "Retail Store", icon: ShoppingBag },
  { value: "fashion", label: "Fashion Store", icon: ShoppingBag },
  { value: "supermarket", label: "Supermarket", icon: ShoppingCart },
  { value: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { value: "pharmacy", label: "Pharmacy", icon: Pill },
  { value: "warehouse", label: "Warehouse", icon: Warehouse },
  { value: "logistics", label: "Logistics", icon: Truck },
  { value: "hotel", label: "Hotel", icon: Hotel },
  { value: "school", label: "School", icon: GraduationCap },
  { value: "sme", label: "General SME", icon: Building2 },
  { value: "wholesale", label: "Wholesale / Distribution", icon: Package },
] as const;

const onboardingSchema = z.object({
  organizationName: z.string().min(2, "Enter your organization's name"),
  businessType: z.string().min(1, "Choose the option closest to your business"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { organizationName: "", businessType: "" },
  });

  async function onSubmit(values: OnboardingValues) {
    setSubmitting(true);
    try {
      await createOrganization({
        name: values.organizationName,
        businessType: values.businessType,
      });
      toast.success("Organization created", {
        description: `${values.organizationName} is ready to go.`,
      });
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Couldn't create your organization", {
        description:
          error instanceof Error
            ? error.message
            : "The workspace backend isn't connected yet.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Northgate Retail Co." autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What best describes your business?</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {businessTypes.map((type) => {
                    const Icon = type.icon;
                    const selected = field.value === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => field.onChange(type.value)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                          selected
                            ? "border-primary bg-accent ring-primary ring-1"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4.5",
                            selected ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-1 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Create organization
        </Button>
      </form>
    </Form>
  );
}
