import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategies, markets, date } = body;

    const strategySummary = strategies && strategies.length > 0
      ? strategies
          .map((s: { name: string; market: string; timeframe: string }) => `${s.name} (${s.market}, ${s.timeframe})`)
          .join(", ")
      : "No active strategies";

    const watchedMarkets = markets && markets.length > 0
      ? markets.join(", ")
      : "stocks, forex, crypto";

    const response = await chat(
      [
        {
          role: "system",
          content: `You are EdgeFinder's market briefing analyst. Generate a comprehensive morning market briefing.
          
Format your response in these sections:
## Market Overview
Brief summary of overall market conditions.

## Key Levels to Watch
Specific price levels and zones for the user's watched markets.

## Potential Setups
2-3 potential trade setups aligned with the user's active strategies.

## Risk Warnings
Current risk factors and what to be cautious about.

## Today's Focus
1-2 key things the trader should focus on today.

Keep the analysis actionable and specific. Use bullet points within each section.
Disclaimer: For educational purposes only, not financial advice.`,
        },
        {
          role: "user",
          content: `Generate a morning market briefing for ${date || new Date().toLocaleDateString()}.

Active Strategies: ${strategySummary}
Watched Markets: ${watchedMarkets}

Provide analysis relevant to these strategies and markets.`,
        },
      ],
      { maxTokens: 3000, temperature: 0.6 }
    );

    return NextResponse.json({ success: true, briefing: response, date: date || new Date().toISOString() });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Briefing generation failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
