import { NextRequest, NextResponse } from "next/server";
import { strategySchema } from "@/lib/validations";

const sampleStrategies = [
  {
    id: "str_1",
    user_id: "user_1",
    name: "Momentum Alpha v3",
    description: "Multi-factor momentum strategy combining RSI, MACD, and volume confirmation.",
    market: "stocks",
    timeframe: "1d",
    indicators: [],
    entry_rules: [],
    exit_rules: [],
    risk_management: {
      position_size_type: "percent",
      position_size_value: 5,
      stop_loss_type: "atr",
      stop_loss_value: 2.0,
      take_profit_type: "risk_reward",
      take_profit_value: 3.0,
      max_open_positions: 5,
      max_daily_trades: 10,
      max_drawdown_percent: 15,
    },
    is_public: true,
    is_published: true,
    clone_count: 1847,
    likes_count: 342,
    performance_score: 92.4,
    tags: ["momentum", "trend-following"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-12-15T10:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const market = searchParams.get("market");
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "20");

  let strategies = [...sampleStrategies];

  if (market && market !== "all") {
    strategies = strategies.filter((s) => s.market === market);
  }

  const total = strategies.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = strategies.slice(start, start + perPage);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    per_page: perPage,
    total_pages: totalPages,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = strategySchema.parse(body);

    const newStrategy = {
      id: `str_${Date.now()}`,
      user_id: "user_1",
      ...validated,
      indicators: [],
      entry_rules: [],
      exit_rules: [],
      risk_management: {
        position_size_type: "percent",
        position_size_value: 5,
        stop_loss_type: "atr",
        stop_loss_value: 2.0,
        take_profit_type: "risk_reward",
        take_profit_value: 3.0,
        max_open_positions: 5,
        max_daily_trades: 10,
        max_drawdown_percent: 15,
      },
      is_published: false,
      clone_count: 0,
      likes_count: 0,
      performance_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ data: newStrategy, error: null }, { status: 201 });
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
