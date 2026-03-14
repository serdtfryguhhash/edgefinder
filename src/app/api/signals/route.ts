import { NextRequest, NextResponse } from "next/server";
import { generateSignals } from "@/lib/signal-engine";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const market = searchParams.get("market") as 'stocks' | 'forex' | 'crypto' | 'metals' | undefined || undefined;
  const timeframe = searchParams.get("timeframe") as '1H' | '4H' | '1D' | '1W' | undefined || undefined;
  const strategy = searchParams.get("strategy") as 'momentum' | 'meanReversion' | 'trendFollowing' | 'breakout' | 'multiConfluence' | undefined || undefined;
  const count = parseInt(searchParams.get("count") || "8");

  try {
    const signals = generateSignals({ market, timeframe, strategy, count });
    return NextResponse.json({
      signals,
      generatedAt: new Date().toISOString(),
      count: signals.length,
    });
  } catch (error) {
    console.error("Signal generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate signals" },
      { status: 500 }
    );
  }
}
