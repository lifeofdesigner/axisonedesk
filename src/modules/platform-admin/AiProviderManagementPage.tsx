import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Pencil } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
  useAiProviders,
  useAiPromptTemplates,
  useAiSettings,
  useAiUsageSummary,
  useSetAiProviderConnected,
  useUpdateAiSettings,
} from "@/core/platform-admin/ai-provider-hooks";
import { PromptTemplateDialog } from "@/modules/platform-admin/components/PromptTemplateDialog";
import type { AiPromptTemplate, AiProvider, AiSettings } from "@/core/platform-admin/ai-provider-api";

export function AiProviderManagementPage() {
  const { data: providers, isLoading: providersLoading } = useAiProviders();
  const { data: templates, isLoading: templatesLoading } = useAiPromptTemplates();
  const { data: settings, isLoading: settingsLoading } = useAiSettings();
  const { data: usage } = useAiUsageSummary();
  const setConnected = useSetAiProviderConnected();

  const [editingTemplate, setEditingTemplate] = useState<AiPromptTemplate | null>(null);

  async function handleToggleConnected(key: string, isConnected: boolean) {
    try {
      await setConnected.mutateAsync({ key, isConnected, notes: null });
      toast.success(isConnected ? "Marked as connected" : "Marked as not connected");
    } catch {
      toast.error("Couldn't update provider");
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Provider Management"
        description="Configuration layer for the assistant — no live model calls yet, per ARCHITECTURE.md §15: provider API keys live only in Supabase Edge Function secrets, never in this database or the client bundle."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Assistant settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {settingsLoading || !settings || !providers ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <AssistantSettingsForm initialSettings={settings} providers={providers} />
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Providers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {providersLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            providers?.map((p) => (
              <div key={p.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.label}</span>
                    <Badge variant="outline" className="font-normal">
                      {p.isConnected ? "Connected" : "Ready for connection"}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {p.models.length > 0 ? <span>{p.models.join(", ")}</span> : <span>No preset models</span>}
                    {p.docsUrl ? (
                      <a
                        href={p.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground inline-flex items-center gap-1"
                      >
                        Docs <ExternalLink className="size-3" />
                      </a>
                    ) : null}
                  </div>
                </div>
                <Switch
                  checked={p.isConnected}
                  onCheckedChange={(v) => handleToggleConnected(p.key, v)}
                />
              </div>
            ))
          )}
          <p className="text-muted-foreground mt-1 text-xs">
            This switch only records operator-confirmed status — set the provider's API key as a Supabase Edge
            Function secret (`supabase secrets set {"{"}PROVIDER{"}"}_API_KEY=...`) before marking it connected.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Prompt templates</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {templatesLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            templates?.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  {t.description ? <p className="text-muted-foreground text-xs">{t.description}</p> : null}
                  {!t.template.trim() ? (
                    <Badge variant="outline" className="mt-1 font-normal">
                      Not written yet
                    </Badge>
                  ) : null}
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingTemplate(t)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Usage &amp; cost</CardTitle>
        </CardHeader>
        <CardContent>
          {!usage || usage.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No usage recorded yet — this table populates once a provider is connected and the Edge Function
              begins logging calls.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Input tokens</TableHead>
                  <TableHead>Output tokens</TableHead>
                  <TableHead>Cost (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usage.map((row) => (
                  <TableRow key={row.providerKey ?? "unknown"}>
                    <TableCell>{row.providerKey ?? "—"}</TableCell>
                    <TableCell>{row.callCount}</TableCell>
                    <TableCell>{row.totalInputTokens}</TableCell>
                    <TableCell>{row.totalOutputTokens}</TableCell>
                    <TableCell>${row.totalCostUsd.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editingTemplate ? (
        <PromptTemplateDialog
          open={!!editingTemplate}
          onOpenChange={(open) => setEditingTemplate(open ? editingTemplate : null)}
          template={editingTemplate}
        />
      ) : null}
    </div>
  );
}

// Local state (lazily initialized from the loaded settings) rather than
// deriving each mutation's payload from the query cache: two edits fired in
// quick succession (change provider, then flip the enable switch) can race
// with the first mutation's cache invalidation, silently dropping the
// second field if it were spread from stale query data instead.
function AssistantSettingsForm({ initialSettings, providers }: { initialSettings: AiSettings; providers: AiProvider[] }) {
  const updateSettings = useUpdateAiSettings();
  const [form, setForm] = useState<AiSettings>(initialSettings);

  const activeProvider = providers.find((p) => p.key === form.activeProvider);

  function commit(next: AiSettings) {
    setForm(next);
    updateSettings.mutate(next, {
      onError: () => toast.error("Couldn't update AI settings"),
    });
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Enable AI Assistant module</p>
          <p className="text-muted-foreground text-xs">
            Turns on the tenant-facing "Ask AxisOneDesk" shell. Real responses still require an Edge Function
            wired to a connected provider.
          </p>
        </div>
        <Switch checked={form.enabled} onCheckedChange={(v) => commit({ ...form, enabled: v })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Active provider</Label>
          <Select
            value={form.activeProvider ?? ""}
            onValueChange={(v) => commit({ ...form, activeProvider: v, defaultModel: null })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.key} value={p.key}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Default model</Label>
          <Select
            value={form.defaultModel ?? ""}
            onValueChange={(v) => commit({ ...form, defaultModel: v })}
            disabled={!activeProvider || activeProvider.models.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {activeProvider?.models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {form.enabled && activeProvider && !activeProvider.isConnected ? (
        <p className="text-muted-foreground text-xs">
          Module enabled with an unconnected provider — tenants will see the honest disabled shell, not a
          fabricated response.
        </p>
      ) : null}
    </>
  );
}
