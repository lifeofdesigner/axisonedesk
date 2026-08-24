import { supabase } from "@/core/supabase/client";
import { toAppError } from "@/core/error/AppError";

export interface Plan {
  id: string;
  key: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  seatLimit: number | null;
  modules: string[];
}

export interface Subscription {
  planId: string;
  status: string;
  seats: number;
  currentPeriodEnd: string | null;
}

export async function listPlans(): Promise<Plan[]> {
  const { data, error } = await supabase.from("plans").select("*").eq("is_active", true).order("price_monthly");

  if (error) throw toAppError(error);
  return (data as {
    id: string;
    key: string;
    name: string;
    price_monthly: number;
    price_yearly: number;
    seat_limit: number | null;
    module_limits: { modules?: string[] };
  }[]).map((r) => ({
    id: r.id,
    key: r.key,
    name: r.name,
    priceMonthly: Number(r.price_monthly),
    priceYearly: Number(r.price_yearly),
    seatLimit: r.seat_limit,
    modules: r.module_limits?.modules ?? [],
  }));
}

export async function getSubscription(orgId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_id, status, seats, current_period_end")
    .eq("org_id", orgId)
    .maybeSingle();

  if (error) throw toAppError(error);
  if (!data) return null;
  return {
    planId: data.plan_id,
    status: data.status,
    seats: data.seats,
    currentPeriodEnd: data.current_period_end,
  };
}
