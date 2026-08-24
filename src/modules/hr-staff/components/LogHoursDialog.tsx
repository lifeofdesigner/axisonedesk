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
import { useLogTimesheet } from "@/modules/hr-staff/hooks";

const timesheetSchema = z.object({
  workDate: z.string().min(1, "Choose a date"),
  hoursWorked: z.string().refine((v) => Number(v) > 0, "Must be greater than 0"),
  notes: z.string(),
});

type TimesheetValues = z.infer<typeof timesheetSchema>;

export function LogHoursDialog({
  staffId,
  open,
  onOpenChange,
}: {
  staffId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const logTimesheet = useLogTimesheet();
  const form = useForm<TimesheetValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: { workDate: new Date().toISOString().slice(0, 10), hoursWorked: "8", notes: "" },
  });

  async function onSubmit(values: TimesheetValues) {
    try {
      await logTimesheet.mutateAsync({
        staffId,
        workDate: values.workDate,
        hoursWorked: Number(values.hoursWorked),
        notes: values.notes || null,
      });
      toast.success("Hours logged");
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Couldn't log hours");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log hours</DialogTitle>
          <DialogDescription>Record hours worked for this staff member.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="workDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hoursWorked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={logTimesheet.isPending}>
                {logTimesheet.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Log hours
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
