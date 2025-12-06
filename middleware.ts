import { checkUserPlan } from "@/lib/subscription";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];
const PRO_FEATURE_ROUTES = ["/agentguard", "/shield"];
const SUPABASE_COOKIE_NAME = getSupabaseCookieName();

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = getSessionFromCookie(req);

  const isAuthenticated = Boolean(session?.userId);
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

  if (isAuthenticated && needsPro && session?.userId) {
    const planInfo = await checkUserPlan(session.userId);
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

function getSupabaseCookieName() {
  try {
    const projectRef = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    ).hostname.split(".")[0];
    return `sb-${projectRef}-auth-token`;
  } catch {
    return null;
  }
}

function getSessionFromCookie(req: NextRequest) {
  if (!SUPABASE_COOKIE_NAME) return null;
  const rawValue = req.cookies.get(SUPABASE_COOKIE_NAME)?.value;
  if (!rawValue) return null;
  try {
    const parsed = tryParseJson(rawValue);
    const session =
      parsed?.currentSession ||
      parsed?.session ||
      parsed?.data?.session;
    const user =
      session?.user ||
      parsed?.currentUser ||
      parsed?.user ||
      parsed?.data?.user;
    if (user?.id) {
      return { userId: user.id, session };
    }
  } catch (error) {
    console.warn("Unable to parse Supabase auth cookie", error);
  }
  return null;
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return JSON.parse(decodeURIComponent(value));
  }
}
