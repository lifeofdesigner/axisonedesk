import { CheckCircle2, Info } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePlans, useSubscription } from "@/modules/billing/hooks";
import { cn } from "@/shared/lib/utils";

export function BillingOverview() {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription, isLoading: subLoading } = useSubscription();

  const currentPlan = plans?.find((p) => p.id === subscription?.planId);

  return (
    <div>
      <PageHeader title="Billing" description="Your plan, usage, and available tiers." />

      <div className="bg-muted/50 mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm">
        <Info className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-muted-foreground">
          Plan and subscription data below is real (queried from the database, not mocked). Upgrade
          buttons are disabled — this environment has no Stripe secret key or webhook Edge Function
          configured, per ARCHITECTURE.md §8's decision to use Stripe Checkout/Customer Portal
          rather than a custom billing UI. Wiring that is real future work, not built here.
        </p>
      </div>

      <Card className="mb-6 max-w-md">
        <CardHeader>
          <CardTitle className="text-sm">Current plan</CardTitle>
        </CardHeader>
        <CardContent>
          {subLoading || plansLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">{currentPlan?.name ?? "Starter"}</span>
                <Badge variant="outline" className="font-normal capitalize">
                  {subscription?.status ?? "trialing"}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {subscription?.seats ?? 1} seat{(subscription?.seats ?? 1) === 1 ? "" : "s"} in use
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plansLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
          : plans?.map((plan) => {
              const isCurrent = plan.id === subscription?.planId;
              return (
                <Card key={plan.id} className={cn(isCurrent && "border-primary")}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      {plan.name}
                      {isCurrent ? <Badge>Current</Badge> : null}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <span className="text-2xl font-semibold">${plan.priceMonthly}</span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                    </div>
                    <ul className="flex flex-col gap-1.5 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-success size-4" />
                        {plan.seatLimit ? `${plan.seatLimit} seats` : "Unlimited seats"}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-success size-4" />
                        {plan.modules.includes("*") ? "All modules" : `${plan.modules.length} modules`}
                      </li>
                    </ul>
                    <Button variant="outline" disabled={isCurrent} className="mt-auto">
                      {isCurrent ? "Current plan" : "Upgrade (requires Stripe)"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
