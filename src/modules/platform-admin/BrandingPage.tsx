import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
  useUploadBrandingAsset,
} from "@/core/platform-admin/branding-hooks";
import type { PlatformSettings } from "@/core/platform-settings/api";

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </div>
  );
}

// Only ever mounted once `settings` has loaded (see BrandingPage below), so
// the form's initial state can be derived directly in useState's lazy
// initializer — no effect syncing external data into local state needed.
function BrandingForm({ initialSettings }: { initialSettings: PlatformSettings }) {
  const updateSettings = useUpdatePlatformSettings();
  const uploadAsset = useUploadBrandingAsset();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => ({
    platform_name: initialSettings.platformName,
    logo_url: initialSettings.logoUrl ?? "",
    favicon_url: initialSettings.faviconUrl ?? "",
    primary_color: initialSettings.primaryColor,
    secondary_color: initialSettings.secondaryColor,
    accent_color: initialSettings.accentColor,
    support_email: initialSettings.supportEmail ?? "",
  }));

  async function handleFileUpload(file: File, field: "logo_url" | "favicon_url") {
    try {
      const url = await uploadAsset.mutateAsync({ file, folder: field === "logo_url" ? "logos" : "favicons" });
      setForm((f) => ({ ...f, [field]: url }));
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    }
  }

  async function handleSave() {
    try {
      await updateSettings.mutateAsync(form);
      toast.success("Platform branding updated");
    } catch {
      toast.error("Couldn't update branding");
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-sm">Platform identity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Platform name</Label>
          <Input value={form.platform_name} onChange={(e) => setForm((f) => ({ ...f, platform_name: e.target.value }))} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              {form.logo_url ? (
                <img src={form.logo_url} alt="" className="bg-muted size-10 rounded object-contain" />
              ) : (
                <div className="bg-muted size-10 rounded" />
              )}
              <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={uploadAsset.isPending}>
                {uploadAsset.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Upload
              </Button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo_url")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Favicon</Label>
            <div className="flex items-center gap-3">
              {form.favicon_url ? (
                <img src={form.favicon_url} alt="" className="bg-muted size-10 rounded object-contain" />
              ) : (
                <div className="bg-muted size-10 rounded" />
              )}
              <Button type="button" variant="outline" size="sm" onClick={() => faviconInputRef.current?.click()} disabled={uploadAsset.isPending}>
                {uploadAsset.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Upload
              </Button>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "favicon_url")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <ColorField label="Primary color" value={form.primary_color} onChange={(v) => setForm((f) => ({ ...f, primary_color: v }))} />
          <ColorField label="Secondary color" value={form.secondary_color} onChange={(v) => setForm((f) => ({ ...f, secondary_color: v }))} />
          <ColorField label="Accent color" value={form.accent_color} onChange={(v) => setForm((f) => ({ ...f, accent_color: v }))} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Support email</Label>
          <Input
            type="email"
            value={form.support_email}
            onChange={(e) => setForm((f) => ({ ...f, support_email: e.target.value }))}
            placeholder="support@example.com"
          />
        </div>

        <div>
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandingPage() {
  const { data: settings, isLoading } = usePlatformSettings();

  return (
    <div>
      <PageHeader title="White-label & branding" description="Global platform identity — every visual asset editable, no code changes." />

      {isLoading || !settings ? (
        <Skeleton className="h-96 w-full max-w-2xl" />
      ) : (
        <BrandingForm initialSettings={settings} />
      )}
    </div>
  );
}
