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
import { useCreateCustomer } from "@/modules/orders/hooks";
import type { Customer } from "@/modules/orders/types";

const customerSchema = z.object({
  name: z.string().min(2, "Enter a name"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  phone: z.string(),
});

type CustomerValues = z.infer<typeof customerSchema>;

export function NewCustomerDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (customer: Customer) => void;
}) {
  const createCustomer = useCreateCustomer();
  const form = useForm<CustomerValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  async function onSubmit(values: CustomerValues) {
    try {
      const customer = await createCustomer.mutateAsync(values);
      toast.success("Customer created");
      onCreated(customer);
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Couldn't create customer", { description: "Please try again." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New customer</DialogTitle>
          <DialogDescription>Add a customer to select for this and future orders.</DialogDescription>
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
                    <Input placeholder="Jane Doe" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="jane@example.com" {...field} />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCustomer.isPending}>
                {createCustomer.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Create customer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
