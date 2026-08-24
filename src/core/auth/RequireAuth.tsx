import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/core/auth/AuthProvider";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";
import { useIsPlatformAdmin } from "@/core/platform-admin/hooks";

export function RequireAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequireOrg() {
  const { activeOrg, isLoading } = useCurrentOrganization();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!activeOrg && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export function RequirePlatformAdmin() {
  const { isPlatformAdmin, isLoading } = useIsPlatformAdmin();

  if (isLoading) {
    return null;
  }

  if (!isPlatformAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthed() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
