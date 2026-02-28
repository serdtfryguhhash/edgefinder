import { NextRequest, NextResponse } from "next/server";
import { backtestSchema } from "@/lib/validations";
import { SAMPLE_BACKTEST_RESULTS, SAMPLE_EQUITY_CURVE, SAMPLE_TRADES } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = backtestSchema.parse(body);

    // Simulate backtest processing
    const backtest = {
      id: `bt_${Date.now()}`,
      strategy_id: validated.strategy_id,
      user_id: "user_1",
      status: "completed" as const,
      start_date: validated.start_date,
      end_date: validated.end_date,
      initial_capital: validated.initial_capital,
      market: "stocks" as const,
      timeframe: "1d" as const,
      symbol: validated.symbol,
      results: SAMPLE_BACKTEST_RESULTS,
      equity_curve: SAMPLE_EQUITY_CURVE,
      trades: SAMPLE_TRADES,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      error_message: null,
    };

    return NextResponse.json({ data: backtest, error: null }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data: null, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const strategyId = searchParams.get("strategy_id");

  const backtests = [
    {
      id: "bt_1",
      strategy_id: strategyId || "str_1",
      user_id: "user_1",
      status: "completed",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      initial_capital: 100000,
      market: "stocks",
      timeframe: "1d",
      symbol: "AAPL",
      results: SAMPLE_BACKTEST_RESULTS,
      created_at: "2024-12-15T10:00:00Z",
      completed_at: "2024-12-15T10:00:30Z",
      error_message: null,
    },
  ];

  return NextResponse.json({
    data: backtests,
    total: backtests.length,
    page: 1,
    per_page: 20,
    total_pages: 1,
  });
}
