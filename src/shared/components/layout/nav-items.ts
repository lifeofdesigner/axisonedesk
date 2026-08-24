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
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Bookings", href: "/bookings", icon: CalendarClock },
  { label: "CRM", href: "/crm", icon: Users },
  { label: "Purchasing", href: "/purchasing", icon: Truck },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "HR & Staff", href: "/hr-staff", icon: UserCog },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

export const bottomNavItems: NavItem[] = [
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];
