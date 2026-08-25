import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface Plan {
  id: string;
  key: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  seatLimit: number | null;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  maxRedemptions: number | null;
  timesRedeemed: number;
  validUntil: string | null;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  orgId: string;
  orgName: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
}

export async function listPlans(): Promise<Plan[]> {
  const { data, error } = await supabase.rpc("platform_list_plans");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    key: r.key,
    name: r.name,
    priceMonthly: Number(r.price_monthly),
    priceYearly: Number(r.price_yearly),
    seatLimit: r.seat_limit,
    isActive: r.is_active,
  }));
}

export interface UpsertPlanInput {
  id: string | null;
  key: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  seatLimit: number | null;
  isActive: boolean;
}

export async function upsertPlan(input: UpsertPlanInput): Promise<void> {
  const { error } = await supabase.rpc("platform_upsert_plan", {
    p_id: input.id as unknown as string,
    p_key: input.key,
    p_name: input.name,
    p_price_monthly: input.priceMonthly,
    p_price_yearly: input.priceYearly,
    p_seat_limit: input.seatLimit as unknown as number,
    p_module_limits: {},
    p_is_active: input.isActive,
  });
  if (error) throw toAppError(error);
}

export async function listCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase.rpc("platform_list_coupons");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    discountType: r.discount_type as "percent" | "fixed",
    discountValue: Number(r.discount_value),
    maxRedemptions: r.max_redemptions,
    timesRedeemed: r.times_redeemed,
    validUntil: r.valid_until,
    isActive: r.is_active,
  }));
}

export interface UpsertCouponInput {
  id: string | null;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  maxRedemptions: number | null;
  validUntil: string | null;
  isActive: boolean;
}

export async function upsertCoupon(input: UpsertCouponInput): Promise<void> {
  const { error } = await supabase.rpc("platform_upsert_coupon", {
    p_id: input.id as unknown as string,
    p_code: input.code,
    p_discount_type: input.discountType,
    p_discount_value: input.discountValue,
    p_max_redemptions: input.maxRedemptions as unknown as number,
    p_valid_until: input.validUntil as unknown as string,
    p_is_active: input.isActive,
  });
  if (error) throw toAppError(error);
}

export async function listInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase.rpc("platform_list_invoices");
  if (error) throw toAppError(error);
  return (data ?? []).map((r) => ({
    id: r.id,
    orgId: r.org_id,
    orgName: r.org_name,
    invoiceNumber: r.invoice_number,
    amount: Number(r.amount),
    status: r.status,
    dueDate: r.due_date,
    paidAt: r.paid_at,
    notes: r.notes,
    createdAt: r.created_at,
  }));
}

export interface UpsertInvoiceInput {
  id: string | null;
  orgId: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string | null;
  notes: string | null;
}

export async function upsertInvoice(input: UpsertInvoiceInput): Promise<void> {
  const { error } = await supabase.rpc("platform_upsert_invoice", {
    p_id: input.id as unknown as string,
    p_org_id: input.orgId,
    p_invoice_number: input.invoiceNumber,
    p_amount: input.amount,
    p_status: input.status,
    p_due_date: input.dueDate as unknown as string,
    p_notes: input.notes as unknown as string,
  });
  if (error) throw toAppError(error);
}

export async function updateSubscription(
  orgId: string,
  planId: string,
  status: string,
  seats: number,
  currentPeriodEnd: string | null,
): Promise<void> {
  const { error } = await supabase.rpc("platform_update_subscription", {
    p_org_id: orgId,
    p_plan_id: planId,
    p_status: status,
    p_seats: seats,
    p_current_period_end: currentPeriodEnd as unknown as string,
  });
  if (error) throw toAppError(error);
}
