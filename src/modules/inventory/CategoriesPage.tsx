import { useState } from "react";
import { MoreHorizontal, PlusCircle, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { EmptyState } from "@/shared/components/data/EmptyState";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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

import { useCategories, useDeleteCategory } from "@/modules/inventory/hooks";
import { resolveCategoryIcon } from "@/modules/inventory/lib/category-icons";
import { categorySoftBgClass, categoryTextClass } from "@/modules/inventory/lib/category-colors";
import { CategoryFormDialog } from "@/modules/inventory/components/CategoryFormDialog";
import type { Category } from "@/modules/inventory/types";

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [pendingDelete, setPendingDelete] = useState<Category | undefined>();

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your products into groups."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <PlusCircle className="size-4" />
            New category
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : !categories?.length ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Create your first category to start organizing products."
          action={
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="size-4" />
              New category
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = resolveCategoryIcon(category.icon);
            return (
              <Card key={category.id} className="gap-3">
                <CardContent className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${categorySoftBgClass(category.color)}`}
                    >
                      <Icon className={`size-5 ${categoryTextClass(category.color)}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{category.name}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{category.description}</p>
                      <p className="text-muted-foreground mt-2 text-xs font-medium">
                        {category.productCount} product{category.productCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Category actions">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditing(category);
                          setDialogOpen(true);
                        }}
                      >
                        Edit category
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setPendingDelete(category)}
                      >
                        <Trash2 className="size-4" />
                        Delete category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CategoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} />

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Products in this category will need to be reassigned. This action can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (!pendingDelete) return;
                await deleteCategory.mutateAsync(pendingDelete.id);
                toast.success("Category deleted");
                setPendingDelete(undefined);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
