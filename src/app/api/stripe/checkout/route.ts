import { NextRequest, NextResponse } from "next/server";
import { STRIPE_PRICES, createCheckoutSession, createOrRetrieveCustomer, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json({
        url: "/dashboard?checkout=demo",
        message: "Stripe not configured. Running in demo mode."
      });
    }

    const body = await request.json();
    const { planId, billing, email, name, userId } = body;

    // Map planId + billing to Stripe price ID
    const priceKey = `${planId}_${billing}` as keyof typeof STRIPE_PRICES;
    const priceId = STRIPE_PRICES[priceKey];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan or billing period" }, { status: 400 });
    }

    const customer = await createOrRetrieveCustomer(email || "demo@edgefinder.io", name || "EdgeFinder User", userId || "demo");
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&checkout=success`,
      `${origin}/pricing?checkout=canceled`
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
