import { supabaseAdmin } from "@/lib/supabaseAdmin";

type PlanInfo = {
  plan: "FREE" | "LITE" | "PRO";
  status: string;
  currentPeriodEnd?: string | null;
  isTrialing: boolean;
  cancelAtPeriodEnd: boolean;
  isPro: boolean;
};

export async function checkUserPlan(userId: string): Promise<PlanInfo> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("plan_name,status,current_period_end,cancel_at_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  const plan = (data?.plan_name ?? "FREE").toUpperCase() as PlanInfo["plan"];
  const status = data?.status ?? "inactive";
  const isTrialing = status === "trialing";
  const cancelAtPeriodEnd = Boolean(data?.cancel_at_period_end);
  const isPro = plan === "PRO" && status !== "canceled" && status !== "incomplete";

  return {
    plan,
    status,
    currentPeriodEnd: data?.current_period_end ?? null,
    isTrialing,
    cancelAtPeriodEnd,
    isPro,
  };
}
