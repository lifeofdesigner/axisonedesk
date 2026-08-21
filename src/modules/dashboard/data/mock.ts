/**
 * Realistic demo data for the dashboard. Replace with live TanStack Query
 * hooks against `orders`, `products`, and `stock_levels` once those module
 * tables and RLS policies exist (see ARCHITECTURE.md §4).
 */

export const kpis = [
  {
    label: "Revenue (30d)",
    value: "$48,231",
    delta: "+12.4%",
    trend: "up" as const,
    caption: "vs. previous 30 days",
  },
  {
    label: "Orders",
    value: "1,284",
    delta: "+6.8%",
    trend: "up" as const,
    caption: "vs. previous 30 days",
  },
  {
    label: "Avg. order value",
    value: "$37.56",
    delta: "-1.2%",
    trend: "down" as const,
    caption: "vs. previous 30 days",
  },
  {
    label: "Active customers",
    value: "612",
    delta: "+3.1%",
    trend: "up" as const,
    caption: "vs. previous 30 days",
  },
];

// 30 days of daily revenue, trending gently upward with realistic weekday/weekend noise.
export const revenueSeries = [
  { date: "Jul 23", revenue: 1120 },
  { date: "Jul 24", revenue: 1340 },
  { date: "Jul 25", revenue: 1280 },
  { date: "Jul 26", revenue: 1510 },
  { date: "Jul 27", revenue: 1890 },
  { date: "Jul 28", revenue: 2040 },
  { date: "Jul 29", revenue: 1720 },
  { date: "Jul 30", revenue: 1360 },
  { date: "Jul 31", revenue: 1490 },
  { date: "Aug 1", revenue: 1610 },
  { date: "Aug 2", revenue: 1580 },
  { date: "Aug 3", revenue: 1950 },
  { date: "Aug 4", revenue: 2210 },
  { date: "Aug 5", revenue: 1870 },
  { date: "Aug 6", revenue: 1420 },
  { date: "Aug 7", revenue: 1560 },
  { date: "Aug 8", revenue: 1690 },
  { date: "Aug 9", revenue: 1730 },
  { date: "Aug 10", revenue: 2080 },
  { date: "Aug 11", revenue: 2340 },
  { date: "Aug 12", revenue: 1990 },
  { date: "Aug 13", revenue: 1540 },
  { date: "Aug 14", revenue: 1610 },
  { date: "Aug 15", revenue: 1780 },
  { date: "Aug 16", revenue: 1860 },
  { date: "Aug 17", revenue: 2150 },
  { date: "Aug 18", revenue: 2430 },
  { date: "Aug 19", revenue: 2020 },
  { date: "Aug 20", revenue: 1690 },
  { date: "Aug 21", revenue: 1840 },
];

export type OrderStatus = "completed" | "pending" | "cancelled";

export const recentOrders: {
  id: string;
  customer: string;
  channel: string;
  amount: string;
  status: OrderStatus;
  date: string;
}[] = [
  {
    id: "#4821",
    customer: "Maria Santos",
    channel: "In-store",
    amount: "$142.00",
    status: "completed",
    date: "Today, 2:41 PM",
  },
  {
    id: "#4820",
    customer: "David Okafor",
    channel: "Online",
    amount: "$76.50",
    status: "pending",
    date: "Today, 1:58 PM",
  },
  {
    id: "#4819",
    customer: "Chen Wei",
    channel: "In-store",
    amount: "$310.25",
    status: "completed",
    date: "Today, 12:07 PM",
  },
  {
    id: "#4818",
    customer: "Amara Johnson",
    channel: "Online",
    amount: "$54.00",
    status: "cancelled",
    date: "Today, 10:22 AM",
  },
  {
    id: "#4817",
    customer: "Lucas Ferreira",
    channel: "In-store",
    amount: "$98.75",
    status: "completed",
    date: "Yesterday, 6:14 PM",
  },
  {
    id: "#4816",
    customer: "Priya Patel",
    channel: "Online",
    amount: "$212.00",
    status: "completed",
    date: "Yesterday, 4:03 PM",
  },
];

export const lowStockItems = [
  { name: "Espresso Beans 1kg", sku: "SKU-1042", remaining: 4, reorderAt: 15 },
  { name: "Oat Milk 1L", sku: "SKU-2288", remaining: 7, reorderAt: 20 },
  { name: "Paper Cups 12oz (100pk)", sku: "SKU-3391", remaining: 2, reorderAt: 10 },
  { name: "Vanilla Syrup 750ml", sku: "SKU-1875", remaining: 5, reorderAt: 12 },
];

export const topProducts = [
  { name: "Signature Cold Brew", unitsSold: 342, revenue: "$3,762" },
  { name: "Iced Caramel Latte", unitsSold: 298, revenue: "$3,278" },
  { name: "Butter Croissant", unitsSold: 265, revenue: "$1,325" },
  { name: "Almond Matcha Latte", unitsSold: 211, revenue: "$2,532" },
];
