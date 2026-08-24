import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { KpiCard } from "@/shared/components/data/KpiCard";
import { EmptyState } from "@/shared/components/data/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCustomers, useDeals, useUpdateDealStage } from "@/modules/crm/hooks";
import { NewDealDialog } from "@/modules/crm/components/NewDealDialog";
import { dealStages, type DealStage } from "@/modules/crm/types";

export function CrmOverview() {
  const { data: deals, isLoading } = useDeals();
  const { data: customers } = useCustomers();
  const updateStage = useUpdateDealStage();
  const [dialogOpen, setDialogOpen] = useState(false);

  const customerName = (id: string | null) =>
    id ? (customers?.find((c) => c.id === id)?.name ?? null) : null;

  const openDeals = (deals ?? []).filter((d) => d.stage !== "won" && d.stage !== "lost");
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonThisMonth = (deals ?? []).filter((d) => {
    if (d.stage !== "won") return false;
    const now = new Date();
    const created = new Date(d.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  });

  return (
    <div>
      <PageHeader
        title="CRM"
        description="Customers and the deals moving through your pipeline."
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            New deal
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Open pipeline value" value={`$${pipelineValue.toFixed(2)}`} caption={`${openDeals.length} open deals`} />
        <KpiCard label="Won this month" value={String(wonThisMonth.length)} caption="deals closed" />
        <KpiCard label="Customers" value={String(customers?.length ?? 0)} caption="total on file" />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : !deals || deals.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No deals yet"
            description="Create your first deal to start tracking the pipeline."
            action={
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                <Plus className="size-4" />
                New deal
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {dealStages.map((stageDef) => {
              const stageDeals = deals.filter((d) => d.stage === stageDef.key);
              return (
                <div key={stageDef.key} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stageDef.label}</span>
                    <span className="text-muted-foreground text-xs">{stageDeals.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {stageDeals.map((deal) => (
                      <div key={deal.id} className="flex flex-col gap-2">
                        <div className="rounded-lg border bg-card p-3">
                          <p className="text-sm font-medium">{deal.title}</p>
                          {customerName(deal.customerId) ? (
                            <p className="text-muted-foreground text-xs">
                              {customerName(deal.customerId)}
                            </p>
                          ) : null}
                          <p className="mt-2 text-sm font-semibold tabular-nums">
                            ${deal.value.toFixed(2)}
                          </p>
                          <Select
                            value={deal.stage}
                            onValueChange={(v) =>
                              updateStage.mutate({ id: deal.id, stage: v as DealStage })
                            }
                          >
                            <SelectTrigger className="mt-2 h-8 w-full text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dealStages.map((s) => (
                                <SelectItem key={s.key} value={s.key}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewDealDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
