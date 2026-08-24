import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useOrgProfile, useUpdateOrgProfile } from "@/modules/settings/hooks";

const profileSchema = z.object({
  name: z.string().min(2, "Enter an organization name"),
  timezone: z.string().min(1, "Enter a timezone"),
  currency: z.string().length(3, "Use a 3-letter currency code, e.g. USD"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function OrgProfilePage() {
  const { data: profile, isLoading } = useOrgProfile();
  const updateProfile = useUpdateOrgProfile();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", timezone: "UTC", currency: "USD" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ name: profile.name, timezone: profile.timezone, currency: profile.currency });
    }
  }, [profile, form]);

  async function onSubmit(values: ProfileValues) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Organization profile updated");
    } catch {
      toast.error("Couldn't update profile", { description: "Please try again." });
    }
  }

  return (
    <div>
      <PageHeader title="Organization" description="Your organization's profile and defaults." />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-sm">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input placeholder="UTC" {...field} />
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
                        <Input placeholder="USD" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    Save changes
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
