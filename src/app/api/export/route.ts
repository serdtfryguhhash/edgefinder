import { NextRequest, NextResponse } from "next/server";
import { exportSchema } from "@/lib/validations";
import { SAMPLE_BACKTEST_RESULTS, SAMPLE_TRADES } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = exportSchema.parse(body);

    const exportData: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      format: validated.format,
    };

    if (validated.include_trades) {
      exportData.trades = SAMPLE_TRADES;
    }

    if (validated.include_monthly_returns) {
      exportData.monthly_returns = SAMPLE_BACKTEST_RESULTS.monthly_returns;
    }

    exportData.results = SAMPLE_BACKTEST_RESULTS;

    if (validated.format === "csv") {
      const headers = ["entry_date", "exit_date", "direction", "entry_price", "exit_price", "pnl", "pnl_pct", "exit_reason"];
      const csvRows = [headers.join(",")];
      
      if (validated.include_trades) {
        SAMPLE_TRADES.forEach((trade) => {
          csvRows.push(
            [
              trade.entry_date,
              trade.exit_date,
              trade.direction,
              trade.entry_price,
              trade.exit_price,
              trade.pnl,
              trade.pnl_pct,
              trade.exit_reason,
            ].join(",")
          );
        });
      }

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="backtest-export-${Date.now()}.csv"`,
        },
      });
    }

    // JSON format (default)
    return NextResponse.json({
      data: exportData,
      error: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data: null, error: "Export failed" },
      { status: 500 }
    );
  }
}
