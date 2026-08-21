import { SidebarNav } from "@/shared/components/layout/SidebarNav";

export function Sidebar() {
  return (
    <aside className="bg-sidebar border-sidebar-border hidden w-64 shrink-0 border-r lg:block">
      <div className="sticky top-0 h-svh">
        <SidebarNav />
      </div>
    </aside>
  );
}
