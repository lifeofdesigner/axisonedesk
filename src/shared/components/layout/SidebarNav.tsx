import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { bottomNavItems, navItems, type NavItem } from "@/shared/components/layout/nav-items";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon;

  if (item.comingSoon) {
    return (
      <div
        aria-disabled
        className="text-sidebar-muted flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm"
      >
        <span className="flex items-center gap-3">
          <Icon className="size-4" />
          {item.label}
        </span>
        <Badge
          variant="outline"
          className="border-sidebar-border text-sidebar-muted h-5 px-1.5 text-[10px] font-normal"
        >
          Soon
        </Badge>
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      end={item.href === "/"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground",
        )
      }
    >
      <Icon className="size-4" />
      {item.label}
    </NavLink>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { activeOrg, isLoading } = useCurrentOrganization();

  return (
    <div className="flex h-full flex-col" onClick={onNavigate}>
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-8 items-center justify-center rounded-lg">
          <Sparkles className="size-4" />
        </div>
        <span className="text-sidebar-foreground text-base font-semibold tracking-tight">
          AxisOneDesk
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {navItems.map((item) => (
          <NavRow key={item.href} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 px-3 pb-3">
        {bottomNavItems.map((item) => (
          <NavRow key={item.href} item={item} />
        ))}
      </div>

      <div className="border-sidebar-border mx-3 mb-4 rounded-lg border p-3">
        {isLoading ? (
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24 bg-white/10" />
            <Skeleton className="h-3 w-32 bg-white/10" />
          </div>
        ) : activeOrg ? (
          <>
            <p className="text-sidebar-foreground truncate text-xs font-medium">
              {activeOrg.name}
            </p>
            <p className="text-sidebar-muted mt-0.5 text-xs capitalize">
              {activeOrg.businessType} workspace
            </p>
          </>
        ) : (
          <p className="text-sidebar-muted text-xs">No workspace selected</p>
        )}
      </div>
    </div>
  );
}
