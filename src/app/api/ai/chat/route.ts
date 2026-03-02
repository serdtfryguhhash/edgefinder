import { NextRequest, NextResponse } from "next/server";
import { chat, analyzeStrategy, explainIndicator, generateMarketCommentary } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, strategy, indicator, market, memoryContext } = body;

    let response: string;

    const memorySection = memoryContext
      ? `\n\nUser Context (from their trading history):\n${memoryContext}\n\nUse this context to provide personalized advice. Reference their past strategies and preferences when relevant.`
      : "";

    switch (action) {
      case "analyze-strategy":
        response = await analyzeStrategy(strategy);
        break;
      case "explain-indicator":
        response = await explainIndicator(indicator || message);
        break;
      case "market-commentary":
        response = await generateMarketCommentary(market || message);
        break;
      case "chat":
      default:
        response = await chat([
          {
            role: "system",
            content: `You are EdgeFinder's trading strategy assistant. Help traders analyze strategies, understand indicators, and make data-driven decisions. Always include the disclaimer: For educational purposes only, not financial advice.${memorySection}`,
          },
          { role: "user", content: message },
        ]);
        break;
    }

    return NextResponse.json({ success: true, response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({
    available: hasKey,
    model: "claude-sonnet-4-20250514",
    ...(!hasKey && { error: "ANTHROPIC_API_KEY is not set" }),
  });
}
