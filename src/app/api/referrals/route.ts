import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") || "user_1";

  const referrals = [
    {
      id: "ref_1",
      referrer_id: userId,
      referred_id: "user_2",
      referral_code: "EF-DEMO01",
      status: "completed",
      reward_amount: 30,
      reward_paid: true,
      created_at: "2024-12-10T10:00:00Z",
      completed_at: "2024-12-12T10:00:00Z",
      referred_user: {
        full_name: "Sarah Mitchell",
        avatar_url: null,
        created_at: "2024-12-10T10:00:00Z",
      },
    },
    {
      id: "ref_2",
      referrer_id: userId,
      referred_id: "user_3",
      referral_code: "EF-DEMO01",
      status: "pending",
      reward_amount: 30,
      reward_paid: false,
      created_at: "2024-11-20T10:00:00Z",
      completed_at: null,
      referred_user: {
        full_name: "Lisa Wang",
        avatar_url: null,
        created_at: "2024-11-20T10:00:00Z",
      },
    },
  ];

  const stats = {
    total_referrals: 12,
    converted: 8,
    total_earnings: 240,
    pending_earnings: 60,
  };

  return NextResponse.json({ data: { referrals, stats }, error: null });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referral_code, email } = body;

    if (!referral_code || !email) {
      return NextResponse.json(
        { error: "Referral code and email are required" },
        { status: 400 }
      );
    }

    // Validate referral code and create referral record
    const referral = {
      id: `ref_${Date.now()}`,
      referral_code,
      email,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ data: referral, error: null }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create referral" },
      { status: 500 }
    );
  }
}
