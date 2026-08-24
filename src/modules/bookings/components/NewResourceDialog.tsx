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
import { useCreateResource } from "@/modules/bookings/hooks";

const resourceSchema = z.object({
  name: z.string().min(2, "Enter a name"),
  resourceType: z.string().min(2, "Enter a type"),
  capacity: z.string().refine((v) => Number(v) >= 1, "Must be at least 1"),
});

type ResourceValues = z.infer<typeof resourceSchema>;

export function NewResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createResource = useCreateResource();
  const form = useForm<ResourceValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { name: "", resourceType: "room", capacity: "1" },
  });

  async function onSubmit(values: ResourceValues) {
    try {
      await createResource.mutateAsync({
        name: values.name,
        resourceType: values.resourceType,
        capacity: Number(values.capacity),
      });
      toast.success("Resource created");
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Couldn't create resource");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New resource</DialogTitle>
          <DialogDescription>Rooms, tables, staff, or equipment that can be booked.</DialogDescription>
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
                    <Input placeholder="Conference Room A" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resourceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createResource.isPending}>
                {createResource.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Create resource
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
