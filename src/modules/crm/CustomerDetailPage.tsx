import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { useCustomer, useCustomerDeals } from "@/modules/crm/hooks";
import { CustomerNotesPanel } from "@/modules/crm/components/CustomerNotesPanel";
import { dealStages } from "@/modules/crm/types";

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(customerId ?? "");
  const { data: deals, isLoading: dealsLoading } = useCustomerDeals(customerId ?? "");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <EmptyState
        icon={Users}
        title="Customer not found"
        description="This customer may have been removed."
        action={
          <Button size="sm" onClick={() => navigate("/crm/customers")}>
            Back to customers
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate("/crm/customers")}>
        <ArrowLeft className="size-4" />
        Back to customers
      </Button>

      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{customer.name}</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {customer.email ?? "No email"} · {customer.phone ?? "No phone"}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerNotesPanel customerId={customer.id} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Deals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {dealsLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : !deals || deals.length === 0 ? (
                <p className="text-muted-foreground text-sm">No deals linked to this customer.</p>
              ) : (
                deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{deal.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {dealStages.find((s) => s.key === deal.stage)?.label}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">${deal.value.toFixed(2)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
