import { toast } from "sonner";
import { Activity, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  useErrorLogs,
  usePlatformIntegrations,
  useResolveErrorLog,
  useSetIntegrationConnected,
  useSystemHealth,
} from "@/core/platform-admin/system-health-hooks";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return seconds <= 1 ? "just now" : `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function SystemHealthPage() {
  const { data: health, isLoading: healthLoading, refetch, isFetching } = useSystemHealth();
  const { data: errorLogs, isLoading: errorLogsLoading } = useErrorLogs();
  const { data: integrations, isLoading: integrationsLoading } = usePlatformIntegrations();
  const resolveError = useResolveErrorLog();
  const setIntegrationConnected = useSetIntegrationConnected();

  async function handleResolve(id: string, resolved: boolean) {
    try {
      await resolveError.mutateAsync({ id, resolved });
    } catch {
      toast.error("Couldn't update error log");
    }
  }

  async function handleToggleIntegration(key: string, isConnected: boolean) {
    try {
      await setIntegrationConnected.mutateAsync({ key, isConnected });
      toast.success(isConnected ? "Marked as connected" : "Marked as not connected");
    } catch {
      toast.error("Couldn't update integration");
    }
  }

  return (
    <div>
      <PageHeader
        title="System Health & Monitoring"
        description="Live counts from the real database — no synthetic uptime or fabricated incident history."
      />

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Database</CardTitle>
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {healthLoading || !health ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 rounded-lg border p-3">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <p className="text-sm font-medium">Connected — {health.dbLatencyMs}ms round-trip</p>
                <span className="text-muted-foreground ml-auto text-xs">Checked {timeAgo(health.checkedAt)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Organizations", value: health.organizationsCount },
                  { label: "Users", value: health.usersCount },
                  { label: "Active subscriptions", value: health.activeSubscriptionsCount },
                  { label: "Orders", value: health.ordersCount },
                  { label: "Products", value: health.productsCount },
                  { label: "Open tickets", value: health.openTicketsCount },
                  { label: "Unresolved errors", value: health.unresolvedErrorCount },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border p-3">
                    <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                    <p className="text-muted-foreground text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Monitoring &amp; billing integrations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {integrationsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            integrations?.map((i) => (
              <div key={i.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{i.label}</span>
                    <Badge variant="outline" className="font-normal">
                      {i.isConnected ? "Connected" : "Ready for connection"}
                    </Badge>
                  </div>
                  {i.docsUrl ? (
                    <a
                      href={i.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 text-xs"
                    >
                      Docs <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>
                <Switch checked={i.isConnected} onCheckedChange={(v) => handleToggleIntegration(i.key, v)} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Client-side error log</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {errorLogsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : !errorLogs || errorLogs.length === 0 ? (
            <p className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-center text-sm">
              <Activity className="size-4" />
              No errors captured yet.
            </p>
          ) : (
            errorLogs.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{e.message}</span>
                    {e.resolved ? (
                      <Badge variant="outline" className="font-normal">
                        Resolved
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {e.url} · {timeAgo(e.createdAt)}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleResolve(e.id, !e.resolved)}>
                  {e.resolved ? "Reopen" : "Resolve"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
