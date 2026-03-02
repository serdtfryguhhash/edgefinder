import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entries } = body;

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        success: true,
        analysis: "Not enough journal entries to analyze. Start logging your trades to get personalized behavioral insights.",
      });
    }

    const entrySummaries = entries
      .slice(-20)
      .map(
        (e: {
          date: string;
          strategyUsed: string;
          marketConditions: string;
          emotionalState: string;
          outcome: string;
          rationale: string;
          lessons: string;
        }) =>
          `Date: ${e.date} | Strategy: ${e.strategyUsed} | Conditions: ${e.marketConditions} | Emotion: ${e.emotionalState} | Outcome: ${e.outcome} | Rationale: ${e.rationale} | Lesson: ${e.lessons}`
      )
      .join("\n");

    const response = await chat(
      [
        {
          role: "system",
          content: `You are EdgeFinder's trading psychology analyst. Analyze the trader's journal entries and provide behavioral insights.

Focus on:
1. **Emotional Patterns**: How emotions correlate with outcomes
2. **Decision Quality**: Patterns in rationale quality vs outcomes
3. **Recurring Mistakes**: Common errors or biases
4. **Strengths**: What the trader does well
5. **Actionable Advice**: Specific, practical recommendations

Be direct but encouraging. Use data from the entries to support your analysis.
Reference specific entries when pointing out patterns.
Disclaimer: For educational purposes only, not financial advice.`,
        },
        {
          role: "user",
          content: `Analyze these ${entries.length} trading journal entries:\n\n${entrySummaries}`,
        },
      ],
      { maxTokens: 2500, temperature: 0.5 }
    );

    return NextResponse.json({ success: true, analysis: response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Journal analysis failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
