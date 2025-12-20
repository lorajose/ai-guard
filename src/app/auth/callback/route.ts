// src/app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function createSupabaseForRoute(
  request: Request,
  response: NextResponse
) {
  const requestCookies = new Map(
    request.headers
      .get("cookie")
      ?.split(";")
      .map((item) => item.trim().split("=")) || []
  );

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return requestCookies.get(name);
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = createSupabaseForRoute(request, response);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, request.url), {
    headers: response.headers,
  });
}

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  const supabase = createSupabaseForRoute(request, response);
  const { event, session } = await request.json();

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
    return response;
  }

  if (session) {
    await supabase.auth.setSession(session);
  }

  return response;
}
