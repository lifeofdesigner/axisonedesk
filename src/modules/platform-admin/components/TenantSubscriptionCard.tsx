import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePlans, useUpdateSubscription } from "@/core/platform-admin/subscription-hooks";

export function TenantSubscriptionCard({
  orgId,
  currentPlanName,
  currentStatus,
}: {
  orgId: string;
  currentPlanName: string | null;
  currentStatus: string | null;
}) {
  const { data: plans } = usePlans();
  const updateSubscription = useUpdateSubscription();
  const currentPlan = plans?.find((p) => p.name === currentPlanName);

  const [form, setForm] = useState(() => ({
    planId: currentPlan?.id ?? "",
    status: currentStatus ?? "trialing",
    seats: "1",
    currentPeriodEnd: "",
  }));

  async function handleSave() {
    if (!form.planId) {
      toast.error("Select a plan");
      return;
    }
    try {
      await updateSubscription.mutateAsync({
        orgId,
        planId: form.planId,
        status: form.status,
        seats: Number(form.seats) || 1,
        currentPeriodEnd: form.currentPeriodEnd || null,
      });
      toast.success("Subscription updated");
    } catch {
      toast.error("Couldn't update subscription");
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Plan</Label>
            <Select value={form.planId} onValueChange={(v) => setForm((f) => ({ ...f, planId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="past_due">Past due</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Seats</Label>
            <Input type="number" min="1" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Current period end</Label>
            <Input type="date" value={form.currentPeriodEnd} onChange={(e) => setForm((f) => ({ ...f, currentPeriodEnd: e.target.value }))} />
          </div>
        </div>
        <div>
          <Button size="sm" onClick={handleSave} disabled={updateSubscription.isPending}>
            {updateSubscription.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
