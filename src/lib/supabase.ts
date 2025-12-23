import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase URL o Anon Key no configurados. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };
}

export function createSupabaseBrowserClient() {
  const { url, key } = assertSupabaseEnv();
  return createBrowserClient(url, key, {
    auth: {
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

export function createSupabaseServerClient() {
  const { url, key } = assertSupabaseEnv();
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export function createSupabaseMiddlewareClient() {
  return createSupabaseServerClient();
}

export async function getServerUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
