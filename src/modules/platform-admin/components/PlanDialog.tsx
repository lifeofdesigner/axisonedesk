import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useUpsertPlan } from "@/core/platform-admin/subscription-hooks";
import type { Plan } from "@/core/platform-admin/subscription-api";

export function PlanDialog({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
}) {
  const upsertPlan = useUpsertPlan();
  const [form, setForm] = useState(() => ({
    key: plan?.key ?? "",
    name: plan?.name ?? "",
    priceMonthly: String(plan?.priceMonthly ?? 0),
    priceYearly: String(plan?.priceYearly ?? 0),
    seatLimit: plan?.seatLimit ? String(plan.seatLimit) : "",
    isActive: plan?.isActive ?? true,
  }));

  async function handleSave() {
    try {
      await upsertPlan.mutateAsync({
        id: plan?.id ?? null,
        key: form.key,
        name: form.name,
        priceMonthly: Number(form.priceMonthly) || 0,
        priceYearly: Number(form.priceYearly) || 0,
        seatLimit: form.seatLimit ? Number(form.seatLimit) : null,
        isActive: form.isActive,
      });
      toast.success(plan ? "Plan updated" : "Plan created");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save plan");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan ? "Edit plan" : "New plan"}</DialogTitle>
          <DialogDescription>Pricing tiers available to every tenant.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Key</Label>
              <Input value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} placeholder="growth" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Growth" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Monthly ($)</Label>
              <Input type="number" step="0.01" value={form.priceMonthly} onChange={(e) => setForm((f) => ({ ...f, priceMonthly: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Yearly ($)</Label>
              <Input type="number" step="0.01" value={form.priceYearly} onChange={(e) => setForm((f) => ({ ...f, priceYearly: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Seat limit</Label>
              <Input type="number" value={form.seatLimit} onChange={(e) => setForm((f) => ({ ...f, seatLimit: e.target.value }))} placeholder="Unlimited" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label>Active</Label>
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={upsertPlan.isPending}>
            {upsertPlan.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
