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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useUpsertInvoice } from "@/core/platform-admin/subscription-hooks";
import { usePlatformOrganizations } from "@/core/platform-admin/hooks";
import type { Invoice } from "@/core/platform-admin/subscription-api";

export function InvoiceDialog({
  open,
  onOpenChange,
  invoice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}) {
  const upsertInvoice = useUpsertInvoice();
  const { data: orgs } = usePlatformOrganizations();
  const [form, setForm] = useState(() => ({
    orgId: invoice?.orgId ?? "",
    invoiceNumber: invoice?.invoiceNumber ?? `INV-${Date.now().toString().slice(-6)}`,
    amount: String(invoice?.amount ?? 0),
    status: invoice?.status ?? "draft",
    dueDate: invoice?.dueDate ?? "",
    notes: invoice?.notes ?? "",
  }));

  async function handleSave() {
    if (!form.orgId) {
      toast.error("Select a company");
      return;
    }
    try {
      await upsertInvoice.mutateAsync({
        id: invoice?.id ?? null,
        orgId: form.orgId,
        invoiceNumber: form.invoiceNumber,
        amount: Number(form.amount) || 0,
        status: form.status,
        dueDate: form.dueDate || null,
        notes: form.notes || null,
      });
      toast.success(invoice ? "Invoice updated" : "Invoice created");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save invoice");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit invoice" : "New invoice"}</DialogTitle>
          <DialogDescription>Manual invoice record — Stripe sync not connected in this environment.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Company</Label>
            <Select value={form.orgId} onValueChange={(v) => setForm((f) => ({ ...f, orgId: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {orgs?.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Invoice number</Label>
              <Input value={form.invoiceNumber} onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Amount ($)</Label>
              <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Due date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={upsertInvoice.isPending}>
            {upsertInvoice.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
