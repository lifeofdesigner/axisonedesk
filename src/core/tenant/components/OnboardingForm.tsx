import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
import { organizationsQueryKey } from "@/core/tenant/OrganizationProvider";
import { useGlobalFlag } from "@/core/feature-flags/hooks";
import { useOrganizationTypes } from "@/core/industries/hooks";
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

// Flag key from supabase/migrations/0029_onboarding_industry_picker.sql —
// off by default, see ADR-009 in docs/00_ADOS/DECISIONS.md. When on, the
// picker below is replaced with one backed by the real organization_types
// registry (docs/18_REFERENCE/INDUSTRY_REGISTRY.md) instead of this legacy
// hardcoded list. This legacy list and its values are unchanged either way.
const INDUSTRY_REGISTRY_PICKER_FLAG = "onboarding.industry_registry_picker";

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
  // Full-profile fields — only rendered/required when the registry picker
  // flag is on (see 0032_onboarding_full_profile.sql). Kept optional in the
  // schema itself since the legacy (flag-off) form never renders them.
  companySize: z.string().optional(),
  employeeCount: z.string().optional(),
  branchCount: z.string().optional(),
  warehouseCount: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  preferredLanguage: z.string().optional(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

function toOptionalInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function OnboardingForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const { data: useRegistryPicker } = useGlobalFlag(INDUSTRY_REGISTRY_PICKER_FLAG);
  const { data: organizationTypes } = useOrganizationTypes();
  const registryOptions = (organizationTypes ?? []).filter((t) => !t.archivedAt);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      organizationName: "",
      businessType: "",
      companySize: "",
      employeeCount: "",
      branchCount: "",
      warehouseCount: "",
      country: "",
      timezone: "",
      currency: "",
      preferredLanguage: "",
    },
  });

  async function onSubmit(values: OnboardingValues) {
    setSubmitting(true);
    try {
      await createOrganization({
        name: values.organizationName,
        businessType: values.businessType,
        // Only set when the registry picker is actually in use — selected
        // value is one of organization_types.key in that case, matching
        // business_type 1:1 by construction. See ADR-009.
        organizationTypeKey: useRegistryPicker ? values.businessType : undefined,
        // Full-profile fields likewise only sent under the new flagged
        // experience — omitted (left null) for the legacy flow.
        companySize: useRegistryPicker ? values.companySize || undefined : undefined,
        employeeCount: useRegistryPicker ? toOptionalInt(values.employeeCount) : undefined,
        branchCount: useRegistryPicker ? toOptionalInt(values.branchCount) : undefined,
        warehouseCount: useRegistryPicker ? toOptionalInt(values.warehouseCount) : undefined,
        country: useRegistryPicker ? values.country || undefined : undefined,
        timezone: useRegistryPicker ? values.timezone || undefined : undefined,
        currency: useRegistryPicker ? values.currency || undefined : undefined,
        preferredLanguage: useRegistryPicker ? values.preferredLanguage || undefined : undefined,
      });
      toast.success("Organization created", {
        description: `${values.organizationName} is ready to go.`,
      });
      await queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
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
                <Input placeholder="e.g. Retail Admin" autoFocus {...field} />
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
                  {useRegistryPicker
                    ? registryOptions.map((type) => {
                        const selected = field.value === type.key;
                        return (
                          <button
                            key={type.key}
                            type="button"
                            onClick={() => field.onChange(type.key)}
                            className={cn(
                              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                              selected
                                ? "border-primary bg-accent ring-primary ring-1"
                                : "border-border hover:bg-muted/50",
                            )}
                          >
                            <Building2
                              className={cn(
                                "size-4.5",
                                selected ? "text-primary" : "text-muted-foreground",
                              )}
                            />
                            <span className="text-sm font-medium">{type.name}</span>
                          </button>
                        );
                      })
                    : businessTypes.map((type) => {
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

        {useRegistryPicker ? (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 1-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employees</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g. 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branches</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g. 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warehouseCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouses</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g. 0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nigeria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Africa/Lagos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. USD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : null}

        <Button type="submit" className="mt-1 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Create organization
        </Button>
      </form>
    </Form>
  );
}
