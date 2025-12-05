import { createSupabaseServerClient } from "@/lib/supabase";

export async function createClient() {
  return createSupabaseServerClient();
}
