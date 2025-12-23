import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkUserPlan } from "@/lib/subscription";

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

export async function GET(request: Request) {
  try {
    const response = NextResponse.json({ success: true });
    const requestCookies = parseCookieHeader(request.headers.get("cookie"));
    const supabase = createServerClient(
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await checkUserPlan(user.id);
    return NextResponse.json({ plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
