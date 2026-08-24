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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useCreateStaff } from "@/modules/hr-staff/hooks";

const staffSchema = z.object({
  fullName: z.string().min(2, "Enter a name"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  phone: z.string(),
  roleTitle: z.string(),
  hourlyRate: z.string(),
});

type StaffValues = z.infer<typeof staffSchema>;

export function NewStaffDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createStaff = useCreateStaff();
  const form = useForm<StaffValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { fullName: "", email: "", phone: "", roleTitle: "", hourlyRate: "" },
  });

  async function onSubmit(values: StaffValues) {
    try {
      await createStaff.mutateAsync({
        fullName: values.fullName,
        email: values.email || null,
        phone: values.phone || null,
        roleTitle: values.roleTitle || null,
        hourlyRate: values.hourlyRate ? Number(values.hourlyRate) : null,
      });
      toast.success("Staff member added");
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Couldn't add staff member");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New staff member</DialogTitle>
          <DialogDescription>Add someone to your team directory.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jordan Lee" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role title (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Shift supervisor" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="jordan@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly rate (optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="18.00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createStaff.isPending}>
                {createStaff.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Add staff member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
