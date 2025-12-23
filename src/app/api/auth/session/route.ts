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

function createSupabaseForRoute(request: Request, response: NextResponse) {
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

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json();
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: "Missing access_token or refresh_token" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });
    const supabase = createSupabaseForRoute(request, response);
    await supabase.auth.setSession({ access_token, refresh_token });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
