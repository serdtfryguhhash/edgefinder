import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategies, backtests, journalEntries, weekStart, weekEnd } = body;

    const strategySummary = strategies && strategies.length > 0
      ? strategies.map((s: { name: string; status: string }) => `${s.name} (${s.status})`).join(", ")
      : "No strategies modified";

    const backtestSummary = backtests && backtests.length > 0
      ? backtests
          .map(
            (b: { strategyName: string; totalReturn: number; sharpeRatio: number; winRate: number }) =>
              `${b.strategyName}: ${b.totalReturn.toFixed(1)}% return, ${b.sharpeRatio.toFixed(2)} Sharpe, ${b.winRate.toFixed(1)}% win rate`
          )
          .join("\n")
      : "No backtests run";

    const journalSummary = journalEntries && journalEntries.length > 0
      ? journalEntries
          .map(
            (j: { emotionalState: string; outcome: string; lessons: string }) =>
              `Emotion: ${j.emotionalState}, Outcome: ${j.outcome}, Lesson: ${j.lessons}`
          )
          .join("\n")
      : "No journal entries";

    const response = await chat(
      [
        {
          role: "system",
          content: `You are EdgeFinder's weekly performance analyst. Generate a comprehensive weekly performance report.

Structure your report as:
## Weekly Summary
Brief overview of the week's trading activity.

## Strategy Performance
Analysis of backtest results and strategy modifications.

## Best & Worst Performers
Highlight the best and worst performing strategies.

## Behavioral Insights
Patterns from journal entries, emotional tendencies.

## Recommendations
3-5 specific recommendations for the coming week.

## Weekly Score
Rate the week on a scale of 1-10 with reasoning.

Be specific, data-driven, and constructive.
Disclaimer: For educational purposes only, not financial advice.`,
        },
        {
          role: "user",
          content: `Generate a weekly performance report for ${weekStart || "this"} to ${weekEnd || "this"} week.

Strategies Modified: ${strategySummary}

Backtest Results:
${backtestSummary}

Journal Entries:
${journalSummary}`,
        },
      ],
      { maxTokens: 3000, temperature: 0.5 }
    );

    return NextResponse.json({
      success: true,
      report: response,
      weekStart: weekStart || new Date().toISOString(),
      weekEnd: weekEnd || new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Weekly report generation failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
