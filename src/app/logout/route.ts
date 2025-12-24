import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const redirectTarget = process.env.NEXT_PUBLIC_APP_URL || "/";
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  await supabase.auth.signOut();
  cookieStore.delete({ name: "sb-access-token" });
  cookieStore.delete({ name: "sb-refresh-token" });

  const destination = redirectTarget.startsWith("http")
    ? redirectTarget
    : new URL(redirectTarget, request.url).toString();

  return NextResponse.redirect(destination);
}
