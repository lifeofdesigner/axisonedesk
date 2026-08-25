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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useUpsertCoupon } from "@/core/platform-admin/subscription-hooks";
import type { Coupon } from "@/core/platform-admin/subscription-api";

export function CouponDialog({
  open,
  onOpenChange,
  coupon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
}) {
  const upsertCoupon = useUpsertCoupon();
  const [form, setForm] = useState(() => ({
    code: coupon?.code ?? "",
    discountType: coupon?.discountType ?? ("percent" as "percent" | "fixed"),
    discountValue: String(coupon?.discountValue ?? 10),
    maxRedemptions: coupon?.maxRedemptions ? String(coupon.maxRedemptions) : "",
    validUntil: coupon?.validUntil ?? "",
  }));

  async function handleSave() {
    try {
      await upsertCoupon.mutateAsync({
        id: coupon?.id ?? null,
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue) || 0,
        maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : null,
        validUntil: form.validUntil || null,
        isActive: true,
      });
      toast.success(coupon ? "Coupon updated" : "Coupon created");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save coupon");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit coupon" : "New coupon"}</DialogTitle>
          <DialogDescription>Discount codes — not yet applied at checkout (Stripe not connected).</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Code</Label>
            <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="LAUNCH20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <Select value={form.discountType} onValueChange={(v) => setForm((f) => ({ ...f, discountType: v as "percent" | "fixed" }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percent off</SelectItem>
                  <SelectItem value="fixed">Fixed amount off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{form.discountType === "percent" ? "Percent" : "Amount ($)"}</Label>
              <Input type="number" value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Max redemptions</Label>
              <Input type="number" value={form.maxRedemptions} onChange={(e) => setForm((f) => ({ ...f, maxRedemptions: e.target.value }))} placeholder="Unlimited" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Valid until</Label>
              <Input type="date" value={form.validUntil} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={upsertCoupon.isPending}>
            {upsertCoupon.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
