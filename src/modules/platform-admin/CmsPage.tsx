import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useCmsPages, useDeleteCmsPage } from "@/core/platform-admin/cms-hooks";
import { CmsPageDialog } from "@/modules/platform-admin/components/CmsPageDialog";
import type { CmsPage as CmsPageRow } from "@/core/platform-admin/cms-api";

const TYPE_LABELS: Record<string, string> = {
  legal: "Legal",
  help: "Help center",
  marketing: "Marketing",
  other: "Other",
};

export function CmsPage() {
  const { data: pages, isLoading } = useCmsPages();
  const deletePage = useDeleteCmsPage();

  const [dialog, setDialog] = useState<{ open: boolean; page: CmsPageRow | null }>({ open: false, page: null });
  const [pendingDelete, setPendingDelete] = useState<CmsPageRow | null>(null);

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deletePage.mutateAsync(pendingDelete.id);
      toast.success("Page deleted");
    } catch {
      toast.error("Couldn't delete page");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="CMS"
        description="Legal, help center, and marketing pages — draft here, publish when ready. Published pages are live at /pages/:slug."
        actions={
          <Button onClick={() => setDialog({ open: true, page: null })}>
            <Plus className="size-4" />
            New page
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-2 pt-6">
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : !pages || pages.length === 0 ? (
            <p className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-center text-sm">
              <FileText className="size-4" />
              No pages yet — create one to get started.
            </p>
          ) : (
            pages.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.title}</span>
                    <Badge variant="outline" className="font-normal">
                      {TYPE_LABELS[p.pageType] ?? p.pageType}
                    </Badge>
                    <Badge variant={p.status === "published" ? "outline" : "secondary"} className="font-normal">
                      {p.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2 truncate text-xs">
                    <span className="font-mono">/pages/{p.slug}</span>
                    {p.status === "published" ? (
                      <a
                        href={`/pages/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground inline-flex items-center gap-1"
                      >
                        View <ExternalLink className="size-3" />
                      </a>
                    ) : null}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="outline" onClick={() => setDialog({ open: true, page: p })}>
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setPendingDelete(p)}>
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {dialog.open ? (
        <CmsPageDialog
          open={dialog.open}
          onOpenChange={(open) => setDialog({ open, page: open ? dialog.page : null })}
          page={dialog.page}
        />
      ) : null}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the page permanently. If it's published, the public URL will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
