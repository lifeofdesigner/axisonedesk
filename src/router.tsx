import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, RequireOrg, RedirectIfAuthed } from "@/core/auth/RequireAuth";
import { AppShell } from "@/shared/components/layout/AppShell";
import { InventoryLayout } from "@/modules/inventory/InventoryLayout";
import { OrdersLayout } from "@/modules/orders/OrdersLayout";
import { CrmLayout } from "@/modules/crm/CrmLayout";
import { SettingsLayout } from "@/modules/settings/SettingsLayout";

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
        element: <RequireOrg />,
        children: [
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
              {
                element: <OrdersLayout />,
                children: [
                  {
                    path: "/orders",
                    lazy: () => import("@/pages/OrdersOverviewPage"),
                  },
                  {
                    path: "/orders/list",
                    lazy: () => import("@/pages/OrdersListPage"),
                  },
                  {
                    path: "/orders/customers",
                    lazy: () => import("@/pages/OrdersCustomersPage"),
                  },
                ],
              },
              {
                path: "/orders/new",
                lazy: () => import("@/pages/CreateOrderPage"),
              },
              {
                path: "/orders/:orderId",
                lazy: () => import("@/pages/OrderDetailPage"),
              },
              {
                element: <CrmLayout />,
                children: [
                  {
                    path: "/crm",
                    lazy: () => import("@/pages/CrmOverviewPage"),
                  },
                  {
                    path: "/crm/customers",
                    lazy: () => import("@/pages/CrmCustomersPage"),
                  },
                ],
              },
              {
                path: "/crm/customers/:customerId",
                lazy: () => import("@/pages/CrmCustomerDetailPage"),
              },
              {
                path: "/bookings",
                lazy: () => import("@/pages/BookingsOverviewPage"),
              },
              {
                path: "/purchasing",
                lazy: () => import("@/pages/PurchasingOverviewPage"),
              },
              {
                path: "/purchasing/new",
                lazy: () => import("@/pages/CreatePurchaseOrderPage"),
              },
              {
                path: "/purchasing/:purchaseOrderId",
                lazy: () => import("@/pages/PurchaseOrderDetailPage"),
              },
              {
                path: "/hr-staff",
                lazy: () => import("@/pages/HrOverviewPage"),
              },
              {
                path: "/reports",
                lazy: () => import("@/pages/ReportsOverviewPage"),
              },
              {
                path: "/billing",
                lazy: () => import("@/pages/BillingOverviewPage"),
              },
              {
                path: "/ai-assistant",
                lazy: () => import("@/pages/AiAssistantOverviewPage"),
              },
              {
                element: <SettingsLayout />,
                children: [
                  {
                    path: "/settings",
                    lazy: () => import("@/pages/SettingsOrgProfilePage"),
                  },
                  {
                    path: "/settings/members",
                    lazy: () => import("@/pages/SettingsMembersPage"),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
