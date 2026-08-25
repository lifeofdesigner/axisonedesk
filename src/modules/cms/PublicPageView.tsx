import { useParams } from "react-router-dom";
import { FileQuestion, Loader2 } from "lucide-react";
import { usePublishedPage } from "@/core/cms/hooks";
import { usePlatformSettings } from "@/core/platform-settings/hooks";

export function PublicPageView() {
  const { slug = "" } = useParams();
  const { data: page, isLoading } = usePublishedPage(slug);
  const { data: settings } = usePlatformSettings();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
        <FileQuestion className="text-muted-foreground size-8" />
        <p className="text-lg font-semibold">Page not found</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          This page doesn't exist or hasn't been published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-muted-foreground mb-2 text-sm font-medium">{settings?.platformName ?? "AxisOneDesk"}</p>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-balance">{page.title}</h1>
      <div className="text-sm leading-relaxed whitespace-pre-wrap">{page.body}</div>
    </div>
  );
}
