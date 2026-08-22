import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/auth/AuthProvider";
import { listMyOrganizations, type MyOrganization } from "@/core/tenant/api";

interface OrganizationContextValue {
  organizations: MyOrganization[];
  activeOrg: MyOrganization | null;
  activeOrgId: string | null;
  setActiveOrgId: (orgId: string) => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);
const STORAGE_KEY = "axiondesk-active-org-id";

export const organizationsQueryKey = ["tenant", "organizations"] as const;

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: organizationsQueryKey,
    queryFn: listMyOrganizations,
    enabled: Boolean(session),
  });

  // Explicit user selection only — auto-fallback to the first membership is
  // derived below, not written back here, so this never needs an effect.
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(() =>
    typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null,
  );

  const activeOrg = useMemo(() => {
    if (!organizations?.length) return null;
    return organizations.find((org) => org.id === selectedOrgId) ?? organizations[0]!;
  }, [organizations, selectedOrgId]);

  // Persist the effective selection (explicit or auto-fallback) — this only
  // syncs an external system (localStorage), it never calls setState.
  useEffect(() => {
    if (activeOrg) window.localStorage.setItem(STORAGE_KEY, activeOrg.id);
  }, [activeOrg]);

  useEffect(() => {
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      queryClient.removeQueries({ queryKey: organizationsQueryKey });
    }
  }, [session, queryClient]);

  function setActiveOrgId(orgId: string) {
    setSelectedOrgId(orgId);
  }

  const value: OrganizationContextValue = {
    organizations: organizations ?? [],
    activeOrg,
    activeOrgId: activeOrg?.id ?? null,
    setActiveOrgId,
    isLoading: authLoading || orgsLoading,
  };

  return (
    <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
  );
}

export function useCurrentOrganization() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error("useCurrentOrganization must be used within an OrganizationProvider");
  }
  return ctx;
}
