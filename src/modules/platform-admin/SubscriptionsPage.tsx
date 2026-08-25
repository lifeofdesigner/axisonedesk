import { useState } from "react";
import { Plus, Info } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useCoupons, useInvoices, usePlans } from "@/core/platform-admin/subscription-hooks";
import { PlanDialog } from "@/modules/platform-admin/components/PlanDialog";
import { CouponDialog } from "@/modules/platform-admin/components/CouponDialog";
import { InvoiceDialog } from "@/modules/platform-admin/components/InvoiceDialog";
import type { Plan, Coupon, Invoice } from "@/core/platform-admin/subscription-api";

export function SubscriptionsPage() {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  const [planDialog, setPlanDialog] = useState<{ open: boolean; plan: Plan | null }>({ open: false, plan: null });
  const [couponDialog, setCouponDialog] = useState<{ open: boolean; coupon: Coupon | null }>({ open: false, coupon: null });
  const [invoiceDialog, setInvoiceDialog] = useState<{ open: boolean; invoice: Invoice | null }>({ open: false, invoice: null });

  return (
    <div>
      <PageHeader title="Subscriptions & licensing" description="Plans, coupons, and invoicing across the platform." />

      <div className="bg-muted/50 mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm">
        <Info className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-muted-foreground">
          Plans, coupons, and invoices below are real and stored live. Stripe sync (automated billing, payment
          collection, coupon redemption at checkout) is not connected in this environment — invoices are a manual
          record-keeping ledger until that integration exists.
        </p>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setPlanDialog({ open: true, plan: null })}>
              <Plus className="size-4" />
              New plan
            </Button>
          </div>
          {plansLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Monthly</TableHead>
                    <TableHead>Yearly</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans?.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell className="tabular-nums">${plan.priceMonthly.toFixed(2)}</TableCell>
                      <TableCell className="tabular-nums">${plan.priceYearly.toFixed(2)}</TableCell>
                      <TableCell className="tabular-nums">{plan.seatLimit ?? "Unlimited"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setPlanDialog({ open: true, plan })}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="coupons" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setCouponDialog({ open: true, coupon: null })}>
              <Plus className="size-4" />
              New coupon
            </Button>
          </div>
          {couponsLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : !coupons || coupons.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No coupons yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Redemptions</TableHead>
                    <TableHead>Valid until</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.discountType === "percent" ? `${coupon.discountValue}%` : `$${coupon.discountValue.toFixed(2)}`}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {coupon.timesRedeemed} / {coupon.maxRedemptions ?? "∞"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "No expiry"}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setCouponDialog({ open: true, coupon })}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setInvoiceDialog({ open: true, invoice: null })}>
              <Plus className="size-4" />
              New invoice
            </Button>
          </div>
          {invoicesLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : !invoices || invoices.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.orgName}</TableCell>
                      <TableCell className="tabular-nums">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal capitalize">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setInvoiceDialog({ open: true, invoice })}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {planDialog.open && (
        <PlanDialog open={planDialog.open} onOpenChange={(open) => setPlanDialog({ open, plan: open ? planDialog.plan : null })} plan={planDialog.plan} />
      )}
      {couponDialog.open && (
        <CouponDialog
          open={couponDialog.open}
          onOpenChange={(open) => setCouponDialog({ open, coupon: open ? couponDialog.coupon : null })}
          coupon={couponDialog.coupon}
        />
      )}
      {invoiceDialog.open && (
        <InvoiceDialog
          open={invoiceDialog.open}
          onOpenChange={(open) => setInvoiceDialog({ open, invoice: open ? invoiceDialog.invoice : null })}
          invoice={invoiceDialog.invoice}
        />
      )}
    </div>
  );
}
