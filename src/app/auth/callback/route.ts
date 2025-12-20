// src/app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function parseCookieHeader(header: string | null) {
  const map = new Map<string, string>();
  if (!header) return map;
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const name = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1);
    map.set(name, value);
  }
  return map;
}

function createSupabaseForRoute(
  request: Request,
  response: NextResponse
) {
  const requestCookies = parseCookieHeader(request.headers.get("cookie"));

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
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  const response = NextResponse.redirect(new URL(next, request.url));

  if (code) {
    const supabase = createSupabaseForRoute(request, response);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
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
