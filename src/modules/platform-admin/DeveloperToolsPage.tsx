import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Key, Plus, Trash2, Webhook } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  useApiKeys,
  useDeleteWebhook,
  useEdgeFunctions,
  useRevokeApiKey,
  useSetEdgeFunctionDeployed,
  useSetWebhookActive,
  useWebhooks,
} from "@/core/platform-admin/developer-tools-hooks";
import { NewApiKeyDialog } from "@/modules/platform-admin/components/NewApiKeyDialog";
import { NewWebhookDialog } from "@/modules/platform-admin/components/NewWebhookDialog";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return seconds <= 1 ? "just now" : `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function DeveloperToolsPage() {
  const { data: apiKeys, isLoading: apiKeysLoading } = useApiKeys();
  const revokeKey = useRevokeApiKey();
  const { data: webhooks, isLoading: webhooksLoading } = useWebhooks();
  const setWebhookActive = useSetWebhookActive();
  const deleteWebhook = useDeleteWebhook();
  const { data: edgeFunctions, isLoading: edgeFunctionsLoading } = useEdgeFunctions();
  const setEdgeFunctionDeployed = useSetEdgeFunctionDeployed();

  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;

  async function handleRevokeKey(id: string) {
    try {
      await revokeKey.mutateAsync(id);
      toast.success("Key revoked");
    } catch {
      toast.error("Couldn't revoke key");
    }
  }

  async function handleToggleWebhook(id: string, isActive: boolean) {
    try {
      await setWebhookActive.mutateAsync({ id, isActive });
    } catch {
      toast.error("Couldn't update webhook");
    }
  }

  async function handleDeleteWebhook(id: string) {
    try {
      await deleteWebhook.mutateAsync(id);
      toast.success("Webhook deleted");
    } catch {
      toast.error("Couldn't delete webhook");
    }
  }

  async function handleToggleDeployed(key: string, isDeployed: boolean) {
    try {
      await setEdgeFunctionDeployed.mutateAsync({ key, isDeployed });
    } catch {
      toast.error("Couldn't update deployment status");
    }
  }

  return (
    <div>
      <PageHeader
        title="Developer Tools"
        description="Platform-owner tooling — API keys, outgoing webhooks, and Edge Function deployment status."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Project connection</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5">
          <Label>Supabase project URL</Label>
          <Input readOnly value={supabaseUrl ?? "Not configured"} className="font-mono text-xs" />
          <p className="text-muted-foreground text-xs">
            The auto-generated PostgREST API — per ARCHITECTURE.md, there is no custom REST/GraphQL backend at MVP;
            this URL plus RLS is the actual data interface.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">API keys</CardTitle>
          <Button size="sm" onClick={() => setKeyDialogOpen(true)}>
            <Plus className="size-4" />
            New key
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-muted-foreground mb-1 text-xs">
            Real, hashed, revocable tokens — but not yet enforced by an API gateway, since none exists yet.
          </p>
          {apiKeysLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : !apiKeys || apiKeys.length === 0 ? (
            <p className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-center text-sm">
              <Key className="size-4" />
              No API keys issued yet.
            </p>
          ) : (
            apiKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{k.label}</span>
                    <Badge variant="outline" className="font-mono font-normal">
                      {k.keyPrefix}…
                    </Badge>
                    {k.revokedAt ? (
                      <Badge variant="destructive" className="font-normal">
                        Revoked
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Created {timeAgo(k.createdAt)}
                    {k.lastUsedAt ? ` · Last used ${timeAgo(k.lastUsedAt)}` : " · Never used"}
                  </p>
                </div>
                {!k.revokedAt ? (
                  <Button size="sm" variant="outline" onClick={() => handleRevokeKey(k.id)}>
                    Revoke
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Outgoing webhooks</CardTitle>
          <Button size="sm" onClick={() => setWebhookDialogOpen(true)}>
            <Plus className="size-4" />
            New webhook
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-muted-foreground mb-1 text-xs">
            Configuration is real and stored — delivery requires the webhook-dispatcher Edge Function below, which
            isn't built yet.
          </p>
          {webhooksLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : !webhooks || webhooks.length === 0 ? (
            <p className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-center text-sm">
              <Webhook className="size-4" />
              No webhooks configured yet.
            </p>
          ) : (
            webhooks.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{w.label}</span>
                    {w.eventTypes.map((e) => (
                      <Badge key={e} variant="outline" className="font-normal">
                        {e}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-1 truncate text-xs">{w.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={w.isActive} onCheckedChange={(v) => handleToggleWebhook(w.id, v)} />
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteWebhook(w.id)}>
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Edge Functions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {edgeFunctionsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            edgeFunctions?.map((fn) => (
              <div key={fn.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{fn.label}</span>
                    <Badge variant="outline" className="font-normal">
                      {fn.isDeployed ? "Deployed" : "Not deployed"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{fn.description}</p>
                  {fn.docsUrl ? (
                    <a
                      href={fn.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 text-xs"
                    >
                      Docs <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>
                <Switch checked={fn.isDeployed} onCheckedChange={(v) => handleToggleDeployed(fn.key, v)} />
              </div>
            ))
          )}
          <p className="text-muted-foreground mt-1 text-xs">
            This switch only records operator-confirmed deployment status after running `supabase functions deploy`
            — it doesn't deploy anything itself.
          </p>
        </CardContent>
      </Card>

      <NewApiKeyDialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen} />
      <NewWebhookDialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen} />
    </div>
  );
}
