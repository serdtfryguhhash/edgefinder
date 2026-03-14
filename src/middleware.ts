import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasValidSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("placeholder") || key.includes("placeholder")) return false;
  return true;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // If Supabase is not configured, allow all requests through
  if (!hasValidSupabaseConfig()) {
    return res;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();

    // Protected routes
    const protectedPaths = ["/dashboard", "/strategies", "/indicators", "/leaderboard", "/briefing", "/journal", "/alerts", "/challenges", "/reports", "/referrals", "/settings", "/support", "/pricing"];
    const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtected && !session) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect logged-in users away from auth pages
    const authPaths = ["/login", "/signup"];
    const isAuthPage = authPaths.some(path => req.nextUrl.pathname === path);

    if (isAuthPage && session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (error) {
    // If Supabase auth fails, allow the request through
    console.error("Middleware auth error:", error);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};
