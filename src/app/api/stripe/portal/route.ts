import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json({ url: "/settings#billing" });
    }

    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await createCustomerPortalSession(customerId, `${origin}/settings`);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json({ error: error.message || "Failed to create portal session" }, { status: 500 });
  }
}
