import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/modules/hr-staff/api";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";

export const hrKeys = {
  staff: (orgId: string | null) => ["hr", "staff", orgId] as const,
  shifts: (orgId: string | null) => ["hr", "shifts", orgId] as const,
  timesheets: (orgId: string | null, staffId: string) => ["hr", "timesheets", orgId, staffId] as const,
};

export function useStaff() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: hrKeys.staff(activeOrgId),
    queryFn: () => api.listStaff(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateStaff() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateStaffInput) => api.createStaff(activeOrgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hrKeys.staff(activeOrgId) }),
  });
}

export function useShifts() {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: hrKeys.shifts(activeOrgId),
    queryFn: () => api.listShifts(activeOrgId!),
    enabled: Boolean(activeOrgId),
  });
}

export function useCreateShift() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateShiftInput) => api.createShift(activeOrgId!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hrKeys.shifts(activeOrgId) }),
  });
}

export function useTimesheets(staffId: string) {
  const { activeOrgId } = useCurrentOrganization();
  return useQuery({
    queryKey: hrKeys.timesheets(activeOrgId, staffId),
    queryFn: () => api.listTimesheets(activeOrgId!, staffId),
    enabled: Boolean(activeOrgId) && Boolean(staffId),
  });
}

export function useLogTimesheet() {
  const { activeOrgId } = useCurrentOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.LogTimesheetInput) => api.logTimesheet(activeOrgId!, input),
    onSuccess: (_d, variables) =>
      queryClient.invalidateQueries({ queryKey: hrKeys.timesheets(activeOrgId, variables.staffId) }),
  });
}
