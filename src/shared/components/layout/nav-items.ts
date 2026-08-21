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
  { label: "Inventory", href: "/inventory", icon: Boxes, comingSoon: true },
  { label: "Orders", href: "/orders", icon: ClipboardList, comingSoon: true },
  { label: "Bookings", href: "/bookings", icon: CalendarClock, comingSoon: true },
  { label: "CRM", href: "/crm", icon: Users, comingSoon: true },
  { label: "Purchasing", href: "/purchasing", icon: Truck, comingSoon: true },
  { label: "Reports", href: "/reports", icon: BarChart3, comingSoon: true },
  { label: "HR & Staff", href: "/hr-staff", icon: UserCog, comingSoon: true },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles, comingSoon: true },
];

export const bottomNavItems: NavItem[] = [
  { label: "Billing", href: "/billing", icon: CreditCard, comingSoon: true },
  { label: "Settings", href: "/settings", icon: Settings, comingSoon: true },
];
