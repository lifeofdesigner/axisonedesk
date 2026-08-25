import { Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Topbar } from "@/shared/components/layout/Topbar";
import { AnnouncementBanner } from "@/shared/components/layout/AnnouncementBanner";

export function AppShell() {
  return (
    <div className="bg-muted/20 flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <AnnouncementBanner />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
