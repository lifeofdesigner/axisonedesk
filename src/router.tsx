import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, RedirectIfAuthed } from "@/core/auth/RequireAuth";
import { AppShell } from "@/shared/components/layout/AppShell";

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
        ],
      },
    ],
  },
]);
