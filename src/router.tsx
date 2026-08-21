import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, RedirectIfAuthed } from "@/core/auth/RequireAuth";
import { AppShell } from "@/shared/components/layout/AppShell";
import { InventoryLayout } from "@/modules/inventory/InventoryLayout";

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuthed />,
    children: [
      {
        path: "/login",
        lazy: () => import("@/pages/LoginPage"),
      },
      {
        path: "/signup",
        lazy: () => import("@/pages/SignupPage"),
      },
      {
        path: "/forgot-password",
        lazy: () => import("@/pages/ForgotPasswordPage"),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/onboarding",
        lazy: () => import("@/pages/OnboardingPage"),
      },
      {
        element: <AppShell />,
        children: [
          {
            path: "/",
            lazy: () => import("@/pages/DashboardPage"),
          },
          {
            element: <InventoryLayout />,
            children: [
              {
                path: "/inventory",
                lazy: () => import("@/pages/InventoryOverviewPage"),
              },
              {
                path: "/inventory/products",
                lazy: () => import("@/pages/InventoryProductsPage"),
              },
              {
                path: "/inventory/categories",
                lazy: () => import("@/pages/InventoryCategoriesPage"),
              },
              {
                path: "/inventory/adjustments",
                lazy: () => import("@/pages/InventoryAdjustmentsPage"),
              },
            ],
          },
          {
            path: "/inventory/products/new",
            lazy: () => import("@/pages/InventoryAddProductPage"),
          },
          {
            path: "/inventory/products/:productId",
            lazy: () => import("@/pages/InventoryProductDetailPage"),
          },
        ],
      },
    ],
  },
]);
