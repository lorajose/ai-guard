import { createSupabaseMiddlewareClient } from "@/lib/supabase";
import { checkUserPlan } from "@/lib/subscription";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];
const PRO_FEATURE_ROUTES = ["/agentguard", "/shield"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(req, res);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = Boolean(session?.user);
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const needsPro = PRO_FEATURE_ROUTES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAuthenticated && isProtected) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthenticated && needsPro) {
    const planInfo = await checkUserPlan(session.user.id);
    if (!planInfo.isPro) {
      const upgrade = new URL("/pricing", req.url);
      upgrade.searchParams.set("upgrade", "pro");
      return NextResponse.redirect(upgrade);
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/agentguard/:path*", "/shield/:path*"],
};
