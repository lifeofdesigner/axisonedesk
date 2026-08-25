import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, RequireOrg, RequirePlatformAdmin, RedirectIfAuthed } from "@/core/auth/RequireAuth";
import { RequireModuleEnabled } from "@/core/feature-flags/RequireModuleEnabled";
import { PlatformAdminShell } from "@/modules/platform-admin/PlatformAdminShell";
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
        element: <RequirePlatformAdmin />,
        children: [
          {
            element: <PlatformAdminShell />,
            children: [
              {
                path: "/platform-admin",
                lazy: () => import("@/pages/PlatformDashboardPage"),
              },
              {
                path: "/platform-admin/tenants",
                lazy: () => import("@/pages/PlatformTenantsPage"),
              },
              {
                path: "/platform-admin/tenants/:orgId",
                lazy: () => import("@/pages/PlatformTenantDetailPage"),
              },
              {
                path: "/platform-admin/audit-log",
                lazy: () => import("@/pages/PlatformAuditLogPage"),
              },
              {
                path: "/platform-admin/feature-flags",
                lazy: () => import("@/pages/PlatformFeatureFlagsPage"),
              },
              {
                path: "/platform-admin/branding",
                lazy: () => import("@/pages/PlatformBrandingPage"),
              },
              {
                path: "/platform-admin/subscriptions",
                lazy: () => import("@/pages/PlatformSubscriptionsPage"),
              },
              {
                path: "/platform-admin/users",
                lazy: () => import("@/pages/PlatformUsersPage"),
              },
              {
                path: "/platform-admin/roles",
                lazy: () => import("@/pages/PlatformRolesPage"),
              },
              {
                path: "/platform-admin/tickets",
                lazy: () => import("@/pages/PlatformTicketsPage"),
              },
              {
                path: "/platform-admin/tickets/:ticketId",
                lazy: () => import("@/pages/PlatformTicketDetailPage"),
              },
              {
                path: "/platform-admin/media",
                lazy: () => import("@/pages/PlatformMediaLibraryPage"),
              },
            ],
          },
        ],
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
                element: <RequireModuleEnabled moduleKey="inventory" />,
                children: [
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
              {
                element: <RequireModuleEnabled moduleKey="orders" />,
                children: [
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
                ],
              },
              {
                element: <RequireModuleEnabled moduleKey="crm" />,
                children: [
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
                ],
              },
              {
                element: <RequireModuleEnabled moduleKey="bookings" />,
                children: [
                  {
                    path: "/bookings",
                    lazy: () => import("@/pages/BookingsOverviewPage"),
                  },
                ],
              },
              {
                element: <RequireModuleEnabled moduleKey="purchasing" />,
                children: [
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
                ],
              },
              {
                element: <RequireModuleEnabled moduleKey="hr-staff" />,
                children: [
                  {
                    path: "/hr-staff",
                    lazy: () => import("@/pages/HrOverviewPage"),
                  },
                ],
              },
              {
                element: <RequireModuleEnabled moduleKey="reports" />,
                children: [
                  {
                    path: "/reports",
                    lazy: () => import("@/pages/ReportsOverviewPage"),
                  },
                ],
              },
              {
                path: "/billing",
                lazy: () => import("@/pages/BillingOverviewPage"),
              },
              {
                element: <RequireModuleEnabled moduleKey="ai-assistant" />,
                children: [
                  {
                    path: "/ai-assistant",
                    lazy: () => import("@/pages/AiAssistantOverviewPage"),
                  },
                ],
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
                  {
                    path: "/settings/support",
                    lazy: () => import("@/pages/SettingsSupportPage"),
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
