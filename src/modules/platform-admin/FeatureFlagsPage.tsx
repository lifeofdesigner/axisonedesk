import { useState } from "react";
import { toast } from "sonner";
import { Flag } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  usePlatformFlags,
  useAllFlagOverrides,
  useSetFlagDefault,
  useSetOrgFlagOverride,
  useClearOrgFlagOverride,
} from "@/core/platform-admin/feature-flags-hooks";
import { usePlatformOrganizations } from "@/core/platform-admin/hooks";

export function FeatureFlagsPage() {
  const { data: flags, isLoading: flagsLoading } = usePlatformFlags();
  const { data: overrides } = useAllFlagOverrides();
  const { data: orgs } = usePlatformOrganizations();
  const setDefault = useSetFlagDefault();
  const setOverride = useSetOrgFlagOverride();
  const clearOverride = useClearOrgFlagOverride();
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  async function handleDefaultToggle(flagId: string, enabled: boolean) {
    try {
      await setDefault.mutateAsync({ flagId, enabled });
      toast.success("Default updated");
    } catch {
      toast.error("Couldn't update default");
    }
  }

  async function handleOverrideChange(flagId: string, value: string) {
    if (!selectedOrgId) return;
    try {
      if (value === "inherit") {
        await clearOverride.mutateAsync({ orgId: selectedOrgId, flagId });
      } else {
        await setOverride.mutateAsync({ orgId: selectedOrgId, flagId, enabled: value === "on" });
      }
      toast.success("Override updated");
    } catch {
      toast.error("Couldn't update override");
    }
  }

  const overridesForSelectedOrg = new Map(
    (overrides ?? []).filter((o) => o.orgId === selectedOrgId).map((o) => [o.flagId, o.enabled]),
  );

  return (
    <div>
      <PageHeader title="Feature flags" description="Global defaults and per-tenant module overrides." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Global defaults</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {flagsLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            flags?.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{flag.description}</p>
                  <p className="text-muted-foreground font-mono text-xs">{flag.key}</p>
                </div>
                <Switch
                  checked={flag.defaultEnabled}
                  onCheckedChange={(checked) => handleDefaultToggle(flag.id, checked)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Per-tenant overrides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
            <SelectTrigger className="w-full max-w-xs">
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

          {selectedOrgId ? (
            <div className="flex flex-col gap-2">
              {flags?.map((flag) => {
                const override = overridesForSelectedOrg.get(flag.id);
                const value = override === undefined ? "inherit" : override ? "on" : "off";
                return (
                  <div key={flag.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{flag.description}</p>
                      <p className="text-muted-foreground text-xs">
                        Default: {flag.defaultEnabled ? "on" : "off"}
                      </p>
                    </div>
                    <Select value={value} onValueChange={(v) => handleOverrideChange(flag.id, v)}>
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inherit">Inherit default</SelectItem>
                        <SelectItem value="on">Force on</SelectItem>
                        <SelectItem value="off">Force off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
              <Flag className="size-6" />
              Select a company to set module overrides.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
