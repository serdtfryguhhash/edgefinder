"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Copy,
  Share2,
  Edit,
  TrendingUp,



  Activity,

  Target,

} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart,
  Bar,
} from "recharts";

export default function StrategyDetailPage() {
  const equityData = SAMPLE_EQUITY_CURVE.filter((_, i) => i % 3 === 0);
  const results = SAMPLE_BACKTEST_RESULTS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/strategies">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Momentum Alpha v3</h1>
              <Badge variant="success">Active</Badge>
              <Badge variant="secondary">
                <Activity className="h-3 w-3 mr-1" />
                Public
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Multi-factor momentum strategy combining RSI, MACD, and volume confirmation for trend-following entries.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Clone
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="glow" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run Backtest
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Total Return", value: formatPercent(results.total_return_pct), color: "text-accent" },
          { label: "Sharpe Ratio", value: results.sharpe_ratio.toFixed(2), color: "text-secondary-400" },
          { label: "Win Rate", value: `${results.win_rate}%`, color: "text-accent" },
          { label: "Profit Factor", value: results.profit_factor.toFixed(2), color: "text-foreground" },
          { label: "Max Drawdown", value: formatPercent(results.max_drawdown_pct), color: "text-yellow-500" },
          { label: "Total Trades", value: formatNumber(results.total_trades), color: "text-foreground" },
          { label: "Avg Holding", value: results.avg_holding_period, color: "text-muted-foreground" },
          { label: "Expectancy", value: `$${results.expectancy.toFixed(0)}`, color: "text-accent" },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-3 text-center">
              <p className={`text-lg font-bold data-text ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Equity Curve */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Equity Curve</CardTitle>
              <CardDescription>Strategy vs. benchmark performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData}>
                    <defs>
                      <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="benchmark" stroke="#3b82f6" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Benchmark" />
                    <Area type="monotone" dataKey="equity" stroke="#22C55E" fill="url(#eqGrad)" strokeWidth={2} name="Strategy" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Returns */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.monthly_returns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickFormatter={(m) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m-1]} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(v) => [`${v ?? 0}%`, "Return"]} />
                    <Bar dataKey="return_pct" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Trade History</CardTitle>
              <CardDescription>All executed trades from the latest backtest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Entry</th>
                      <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Exit</th>
                      <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Direction</th>
                      <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">Entry Price</th>
                      <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">Exit Price</th>
                      <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">P&L</th>
                      <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">P&L %</th>
                      <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Exit Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_TRADES.map((trade) => (
                      <tr key={trade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-mono text-xs">{trade.entry_date}</td>
                        <td className="py-3 px-2 font-mono text-xs">{trade.exit_date}</td>
                        <td className="py-3 px-2">
                          <Badge variant={trade.direction === "long" ? "success" : "destructive"} className="text-[10px]">
                            {trade.direction.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs">${trade.entry_price.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-xs">${trade.exit_price.toFixed(2)}</td>
                        <td className={`py-3 px-2 text-right font-mono text-xs font-semibold ${trade.pnl >= 0 ? "text-accent" : "text-destructive"}`}>
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(0)}
                        </td>
                        <td className={`py-3 px-2 text-right font-mono text-xs font-semibold ${trade.pnl_pct >= 0 ? "text-accent" : "text-destructive"}`}>
                          {formatPercent(trade.pnl_pct)}
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {trade.exit_reason.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Entry Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="text-[10px]">IF</Badge>
                    <span className="font-mono">RSI(14)</span>
                    <span className="text-accent">crosses below</span>
                    <span className="font-mono">30</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="text-[10px]">AND</Badge>
                    <span className="font-mono">MACD</span>
                    <span className="text-accent">crosses above</span>
                    <span className="font-mono">Signal Line</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="text-[10px]">AND</Badge>
                    <span className="font-mono">Volume</span>
                    <span className="text-accent">greater than</span>
                    <span className="font-mono">SMA(20) of Volume</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-destructive" />
                  Exit Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="destructive" className="text-[10px]">IF</Badge>
                    <span className="font-mono">RSI(14)</span>
                    <span className="text-destructive">crosses above</span>
                    <span className="font-mono">70</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-[10px]">OR</Badge>
                    <span className="font-mono">Stop Loss</span>
                    <span className="text-destructive">triggered at</span>
                    <span className="font-mono">2.0x ATR</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-[10px]">OR</Badge>
                    <span className="font-mono">Take Profit</span>
                    <span className="text-accent">reached at</span>
                    <span className="font-mono">3:1 R:R</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Max Drawdown", value: formatPercent(results.max_drawdown_pct), desc: "Largest peak-to-trough decline" },
                    { label: "Calmar Ratio", value: results.calmar_ratio.toFixed(2), desc: "Annual return / max drawdown" },
                    { label: "Ulcer Index", value: results.ulcer_index.toFixed(1), desc: "Depth and duration of drawdowns" },
                    { label: "Recovery Factor", value: results.recovery_factor.toFixed(2), desc: "Net profit / max drawdown" },
                    { label: "Beta", value: results.beta.toFixed(2), desc: "Sensitivity to market movements" },
                    { label: "Volatility", value: `${results.volatility}%`, desc: "Annualized standard deviation" },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{metric.label}</p>
                        <p className="text-xs text-muted-foreground">{metric.desc}</p>
                      </div>
                      <p className="text-sm font-bold data-text">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Trade Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Winning Trades", value: `${results.winning_trades} (${results.win_rate}%)` },
                    { label: "Losing Trades", value: `${results.losing_trades} (${(100 - results.win_rate).toFixed(1)}%)` },
                    { label: "Average Win", value: formatCurrency(results.avg_win) },
                    { label: "Average Loss", value: formatCurrency(Math.abs(results.avg_loss)) },
                    { label: "Largest Win", value: formatCurrency(results.largest_win) },
                    { label: "Largest Loss", value: formatCurrency(Math.abs(results.largest_loss)) },
                    { label: "Max Consecutive Wins", value: results.max_consecutive_wins.toString() },
                    { label: "Max Consecutive Losses", value: results.max_consecutive_losses.toString() },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-sm font-bold data-text">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drawdown Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Drawdown Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData}>
                    <defs>
                      <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="url(#ddGrad)" strokeWidth={1.5} name="Drawdown" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
