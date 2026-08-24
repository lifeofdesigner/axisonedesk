import { Outlet } from "react-router-dom";
import { PlatformAdminSidebarNav } from "@/modules/platform-admin/components/PlatformAdminSidebarNav";

export function PlatformAdminShell() {
  return (
    <div className="bg-muted/20 flex min-h-svh">
      <aside className="bg-sidebar border-sidebar-border hidden w-64 shrink-0 border-r lg:block">
        <div className="sticky top-0 h-svh">
          <PlatformAdminSidebarNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-amber-500/5 px-4 py-2.5 sm:px-6 lg:px-8">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Platform Owner Portal — cross-tenant view, not a business workspace
          </span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
