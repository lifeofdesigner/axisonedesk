import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { label: "Organization", href: "/settings", end: true },
  { label: "Members & roles", href: "/settings/members" },
  { label: "Support", href: "/settings/support" },
];

export function SettingsLayout() {
  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "shrink-0 border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
