import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building2, ScrollText, ArrowLeftRight, ShieldCheck, Flag, Palette, CreditCard, Users, KeyRound, LifeBuoy, ImageIcon, Bell, Sparkles, Activity, ShieldAlert, Code2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/platform-admin", icon: LayoutDashboard, end: true },
  { label: "Tenants", href: "/platform-admin/tenants", icon: Building2 },
  { label: "Users", href: "/platform-admin/users", icon: Users },
  { label: "Roles & permissions", href: "/platform-admin/roles", icon: KeyRound },
  { label: "Subscriptions", href: "/platform-admin/subscriptions", icon: CreditCard },
  { label: "Support tickets", href: "/platform-admin/tickets", icon: LifeBuoy },
  { label: "Media library", href: "/platform-admin/media", icon: ImageIcon },
  { label: "Notifications", href: "/platform-admin/notifications", icon: Bell },
  { label: "AI providers", href: "/platform-admin/ai-providers", icon: Sparkles },
  { label: "System health", href: "/platform-admin/system-health", icon: Activity },
  { label: "Security center", href: "/platform-admin/security", icon: ShieldAlert },
  { label: "Developer tools", href: "/platform-admin/developer-tools", icon: Code2 },
  { label: "Feature flags", href: "/platform-admin/feature-flags", icon: Flag },
  { label: "Branding", href: "/platform-admin/branding", icon: Palette },
  { label: "Audit log", href: "/platform-admin/audit-log", icon: ScrollText },
];

export function PlatformAdminSidebarNav() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
          <ShieldCheck className="size-4" />
        </div>
        <div>
          <span className="text-sidebar-foreground block text-sm font-semibold tracking-tight">
            Platform Owner
          </span>
          <span className="text-sidebar-muted block text-[11px]">AxisOneDesk</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <NavLink
          to="/"
          className="text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          <ArrowLeftRight className="size-4" />
          Exit to app
        </NavLink>
      </div>
    </div>
  );
}
