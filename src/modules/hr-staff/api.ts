import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";
import type { Database } from "@/core/supabase/database.types";
import type { Shift, StaffMember, Timesheet } from "@/modules/hr-staff/types";

type StaffRow = Database["public"]["Tables"]["staff"]["Row"];
type ShiftRow = Database["public"]["Tables"]["shifts"]["Row"];
type TimesheetRow = Database["public"]["Tables"]["timesheets"]["Row"];

function mapStaff(row: StaffRow): StaffMember {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    roleTitle: row.role_title,
    hourlyRate: row.hourly_rate !== null ? Number(row.hourly_rate) : null,
    status: row.status as StaffMember["status"],
  };
}

function mapShift(row: ShiftRow): Shift {
  return {
    id: row.id,
    staffId: row.staff_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status as Shift["status"],
  };
}

function mapTimesheet(row: TimesheetRow): Timesheet {
  return {
    id: row.id,
    staffId: row.staff_id,
    workDate: row.work_date,
    hoursWorked: Number(row.hours_worked),
    notes: row.notes,
  };
}

export async function listStaff(orgId: string): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("org_id", orgId)
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (error) throw toAppError(error);
  return (data as StaffRow[]).map(mapStaff);
}

export interface CreateStaffInput {
  fullName: string;
  email: string | null;
  phone: string | null;
  roleTitle: string | null;
  hourlyRate: number | null;
}

export async function createStaff(orgId: string, input: CreateStaffInput): Promise<StaffMember> {
  const { data, error } = await supabase
    .from("staff")
    .insert({
      org_id: orgId,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      role_title: input.roleTitle,
      hourly_rate: input.hourlyRate,
    })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapStaff(data as StaffRow);
}

export async function listShifts(orgId: string): Promise<Shift[]> {
  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .eq("org_id", orgId)
    .order("starts_at", { ascending: true });

  if (error) throw toAppError(error);
  return (data as ShiftRow[]).map(mapShift);
}

export interface CreateShiftInput {
  staffId: string;
  startsAt: string;
  endsAt: string;
}

export async function createShift(orgId: string, input: CreateShiftInput): Promise<Shift> {
  const { data, error } = await supabase
    .from("shifts")
    .insert({ org_id: orgId, staff_id: input.staffId, starts_at: input.startsAt, ends_at: input.endsAt })
    .select("*")
    .single();

  if (error) throw toAppError(error);
  return mapShift(data as ShiftRow);
}

export async function listTimesheets(orgId: string, staffId: string): Promise<Timesheet[]> {
  const { data, error } = await supabase
    .from("timesheets")
    .select("*")
    .eq("org_id", orgId)
    .eq("staff_id", staffId)
    .order("work_date", { ascending: false });

  if (error) throw toAppError(error);
  return (data as TimesheetRow[]).map(mapTimesheet);
}

export interface LogTimesheetInput {
  staffId: string;
  workDate: string;
  hoursWorked: number;
  notes: string | null;
}

export async function logTimesheet(orgId: string, input: LogTimesheetInput): Promise<void> {
  const { error } = await supabase.from("timesheets").insert({
    org_id: orgId,
    staff_id: input.staffId,
    work_date: input.workDate,
    hours_worked: input.hoursWorked,
    notes: input.notes,
  });

  if (error) throw toAppError(error);
}
