import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // In production, create a Stripe checkout session
    // const session = await createCheckoutSession(
    //   customerId,
    //   priceId,
    //   `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    //   `${origin}/pricing`,
    // );

    const mockSession = {
      id: `cs_${Date.now()}`,
      url: "/dashboard?checkout=success",
    };

    return NextResponse.json({ data: mockSession, error: null });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
