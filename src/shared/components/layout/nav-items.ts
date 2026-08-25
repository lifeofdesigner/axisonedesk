import {
  BarChart3,
  Boxes,
  CalendarClock,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  Sparkles,
  Truck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Modules not yet built in this milestone — visible for IA, not yet clickable. */
  comingSoon?: boolean;
  /** Matches feature_flags.module_key — gates visibility via useEnabledModules(). Omit for core, non-flaggable items. */
  moduleKey?: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Boxes, moduleKey: "inventory" },
  { label: "Orders", href: "/orders", icon: ClipboardList, moduleKey: "orders" },
  { label: "Bookings", href: "/bookings", icon: CalendarClock, moduleKey: "bookings" },
  { label: "CRM", href: "/crm", icon: Users, moduleKey: "crm" },
  { label: "Purchasing", href: "/purchasing", icon: Truck, moduleKey: "purchasing" },
  { label: "Reports", href: "/reports", icon: BarChart3, moduleKey: "reports" },
  { label: "HR & Staff", href: "/hr-staff", icon: UserCog, moduleKey: "hr-staff" },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles, moduleKey: "ai-assistant" },
];

export const bottomNavItems: NavItem[] = [
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];
