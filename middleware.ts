import { createServerClient } from "@supabase/ssr";
import { checkUserPlan } from "@/lib/subscription";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];
const PRO_FEATURE_ROUTES = ["/agentguard", "/shield"];
const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          res.cookies.delete({ name, ...options });
        },
      },
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id ?? null;
  const superAdminId = process.env.SUPERADMIN_ID;
  const superAdminEmail = process.env.SUPERADMIN_EMAIL?.toLowerCase();
  const isSuperAdmin =
    (Boolean(superAdminId) && session?.user?.id === superAdminId) ||
    (Boolean(superAdminEmail) &&
      session?.user?.email?.toLowerCase() === superAdminEmail);
  const isAuthenticated = Boolean(userId);
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const needsPro = PRO_FEATURE_ROUTES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const allowAuthRoute = req.nextUrl.searchParams.get("guest") === "1";

  let planInfo: Awaited<ReturnType<typeof checkUserPlan>> | null = null;
  async function ensurePlanInfo() {
    if (!planInfo && userId) {
      planInfo = await checkUserPlan(userId);
    }
    return planInfo;
  }

  if (!isAuthenticated && isProtected) {
    const hasAuthCookie = req.cookies
      .getAll()
      .some(
        (cookie) =>
          cookie.name.startsWith("sb-") &&
          cookie.name.endsWith("-auth-token")
      );
    if (hasAuthCookie) {
      return res;
    }
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute && !allowAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthenticated && needsPro && userId && !isSuperAdmin) {
    const planData = await ensurePlanInfo();
    if (!planData?.isPro) {
      const upgrade = new URL("/pricing", req.url);
      upgrade.searchParams.set("upgrade", "pro");
      return NextResponse.redirect(upgrade);
    }
  }

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup", "/agentguard/:path*", "/shield/:path*"],
};
