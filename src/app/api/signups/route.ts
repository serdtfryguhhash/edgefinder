import { NextRequest, NextResponse } from "next/server";
import { logSignup, getSignupStats } from "@/lib/excel-tracker";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, referralCode } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    logSignup({ email, name, referralCode });
    
    return NextResponse.json({ success: true, message: "Signup logged successfully" });
  } catch (error) {
    console.error("Error logging signup:", error);
    return NextResponse.json({ error: "Failed to log signup" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = getSignupStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error getting signup stats:", error);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
