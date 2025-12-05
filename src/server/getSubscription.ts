// src/server/getSubscription.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getUserSubscription(userId: string) {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("plan_name,status,current_period_end")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}
