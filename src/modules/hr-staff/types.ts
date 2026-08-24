export interface StaffMember {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  roleTitle: string | null;
  hourlyRate: number | null;
  status: "active" | "inactive";
}

export interface Shift {
  id: string;
  staffId: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "completed" | "missed";
}

export interface Timesheet {
  id: string;
  staffId: string;
  workDate: string;
  hoursWorked: number;
  notes: string | null;
}
