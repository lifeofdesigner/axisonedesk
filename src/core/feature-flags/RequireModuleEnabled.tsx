import { Navigate, Outlet } from "react-router-dom";
import { useEnabledModules } from "@/core/feature-flags/hooks";

/**
 * Route guard for flag-gated modules. Renders nothing while resolving (avoids
 * a flash of the module before the flag check lands) and redirects home if
 * the module is disabled for the active org — matching ARCHITECTURE.md §3's
 * "disabled module routes redirect ... never 404 silently."
 */
export function RequireModuleEnabled({ moduleKey }: { moduleKey: string }) {
  const { data: enabledModules, isLoading } = useEnabledModules();

  if (isLoading) {
    return null;
  }

  if (!enabledModules?.has(moduleKey)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
