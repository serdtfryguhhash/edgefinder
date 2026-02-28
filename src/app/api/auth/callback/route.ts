import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    // In production, exchange the code for a session using Supabase
    // const supabase = createRouteHandlerClient({ cookies });
    // await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
