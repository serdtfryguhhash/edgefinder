import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // In production, create a Stripe customer portal session
    // const session = await createCustomerPortalSession(
    //   customerId,
    //   `${origin}/settings`
    // );

    const mockSession = {
      url: "/settings#billing",
    };

    return NextResponse.json({ data: mockSession, error: null });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
