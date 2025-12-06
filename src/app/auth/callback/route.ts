// src/app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getSupabaseForRoute() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        remove(name) {
          cookieStore.delete(name);
        },
      },
    }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await getSupabaseForRoute();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, request.url));
}

export async function POST(request: Request) {
  const supabase = await getSupabaseForRoute();
  const { event, session } = await request.json();

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  }

  if (session) {
    await supabase.auth.setSession(session);
  }

  return NextResponse.json({ success: true });
}
