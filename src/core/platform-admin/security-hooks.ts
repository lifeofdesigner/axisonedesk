import { useQuery } from "@tanstack/react-query";
import * as api from "@/core/platform-admin/security-api";

export function useRlsCoverage() {
  return useQuery({ queryKey: ["platform-admin", "rls-coverage"], queryFn: api.getRlsCoverage });
}

export function useSecurityEvents() {
  return useQuery({ queryKey: ["platform-admin", "security-events"], queryFn: () => api.listSecurityEvents() });
}
