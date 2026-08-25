import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { useUpdateOrgBranding } from "@/core/platform-admin/branding-hooks";

// Keyed by orgId from the parent (see TenantDetailPage) so switching tenants
// remounts this with fresh initial state — lazy useState initializer, no
// effect syncing external props into local state needed.
export function TenantBrandingCard({
  orgId,
  logoUrl,
  primaryColor,
}: {
  orgId: string;
  logoUrl: string | null;
  primaryColor: string | null;
}) {
  const updateBranding = useUpdateOrgBranding();
  const [form, setForm] = useState(() => ({ logoUrl: logoUrl ?? "", primaryColor: primaryColor ?? "" }));

  async function handleSave() {
    try {
      await updateBranding.mutateAsync({
        orgId,
        logoUrl: form.logoUrl || null,
        primaryColor: form.primaryColor || null,
      });
      toast.success("Tenant branding updated");
    } catch {
      toast.error("Couldn't update tenant branding");
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">White-label overrides</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Logo URL (overrides platform default)</Label>
          <Input
            value={form.logoUrl}
            onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Primary color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.primaryColor || "#8484f5"}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className="h-9 w-12 cursor-pointer rounded border"
            />
            <Input
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              placeholder="Inherit platform default"
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div>
          <Button size="sm" onClick={handleSave} disabled={updateBranding.isPending}>
            {updateBranding.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
