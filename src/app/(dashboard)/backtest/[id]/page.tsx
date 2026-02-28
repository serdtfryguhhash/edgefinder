"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Share2, RotateCcw, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPercent, formatCurrency, formatNumber } from "@/lib/utils";
import { SAMPLE_BACKTEST_RESULTS, SAMPLE_EQUITY_CURVE, SAMPLE_TRADES } from "@/constants";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BacktestDetailPage() {
  const results = SAMPLE_BACKTEST_RESULTS;
  const equityData = SAMPLE_EQUITY_CURVE.filter((_, i) => i % 3 === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/strategies/1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Backtest Results</h1>
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Momentum Alpha v3 &middot; AAPL &middot; Daily &middot; Jan 2024 - Dec 2024
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Re-run
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Return", value: formatPercent(results.total_return_pct), positive: true },
          { label: "Sharpe Ratio", value: results.sharpe_ratio.toFixed(2), positive: true },
          { label: "Win Rate", value: `${results.win_rate}%`, positive: true },
          { label: "Max Drawdown", value: formatPercent(results.max_drawdown_pct), positive: false },
          { label: "Profit Factor", value: results.profit_factor.toFixed(2), positive: true },
          { label: "Total Trades", value: formatNumber(results.total_trades), positive: null },
        ].map((m) => (
          <Card key={m.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <p className={`text-xl font-bold data-text ${m.positive === true ? "text-accent" : m.positive === false ? "text-destructive" : ""}`}>
                {m.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Equity Curve */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>
            Initial Capital: {formatCurrency(100000)} &rarr; Final: {formatCurrency(results.final_equity)} ({formatPercent(results.total_return_pct)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="btEqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, ""]} />
                <Area type="monotone" dataKey="benchmark" stroke="#3b82f6" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Benchmark" />
                <Area type="monotone" dataKey="equity" stroke="#22C55E" fill="url(#btEqGrad)" strokeWidth={2} name="Strategy" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Returns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Total Return", formatCurrency(results.total_return)],
              ["Annualized Return", formatPercent(results.annualized_return)],
              ["Benchmark Return", formatPercent(results.benchmark_return)],
              ["Alpha", formatPercent(results.alpha)],
              ["Total Fees", formatCurrency(results.total_fees)],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Sharpe Ratio", results.sharpe_ratio.toFixed(2)],
              ["Sortino Ratio", results.sortino_ratio.toFixed(2)],
              ["Calmar Ratio", results.calmar_ratio.toFixed(2)],
              ["Max Drawdown", formatPercent(results.max_drawdown_pct)],
              ["Volatility", `${results.volatility}%`],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Trade Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Win Rate", `${results.win_rate}%`],
              ["Avg Win", formatCurrency(results.avg_win)],
              ["Avg Loss", formatCurrency(Math.abs(results.avg_loss))],
              ["Best Trade", formatCurrency(results.largest_win)],
              ["Worst Trade", `-${formatCurrency(Math.abs(results.largest_loss))}`],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Trade Log</CardTitle>
          <CardDescription>Showing first 8 of {results.total_trades} trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Entry</th>
                  <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Exit</th>
                  <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Dir</th>
                  <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">Entry $</th>
                  <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">Exit $</th>
                  <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">Qty</th>
                  <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">P&L</th>
                  <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">P&L %</th>
                  <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_TRADES.map((trade) => (
                  <tr key={trade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2.5 px-2 font-mono text-xs">{trade.entry_date}</td>
                    <td className="py-2.5 px-2 font-mono text-xs">{trade.exit_date}</td>
                    <td className="py-2.5 px-2">
                      <Badge variant={trade.direction === "long" ? "success" : "destructive"} className="text-[10px]">
                        {trade.direction === "long" ? "LONG" : "SHORT"}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-xs">${trade.entry_price.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-xs">${trade.exit_price.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-xs">{trade.quantity}</td>
                    <td className={`py-2.5 px-2 text-right font-mono text-xs font-semibold ${trade.pnl >= 0 ? "text-accent" : "text-destructive"}`}>
                      {trade.pnl >= 0 ? "+" : ""}${trade.pnl}
                    </td>
                    <td className={`py-2.5 px-2 text-right font-mono text-xs font-semibold ${trade.pnl_pct >= 0 ? "text-accent" : "text-destructive"}`}>
                      {formatPercent(trade.pnl_pct)}
                    </td>
                    <td className="py-2.5 px-2">
                      <Badge variant="outline" className="text-[9px] capitalize">{trade.exit_reason.replace("_", " ")}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
