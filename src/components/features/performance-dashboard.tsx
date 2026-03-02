"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Shield,
  Activity,
  Target,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPercent, formatNumber, formatCurrency } from "@/lib/utils";
import { SAMPLE_BACKTEST_RESULTS, SAMPLE_EQUITY_CURVE } from "@/constants";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const strategies = [
  { name: "Momentum Alpha v3", returnPct: 24.8, sharpe: 1.85, winRate: 62.5, maxDD: -7.2, trades: 156 },
  { name: "Mean Reversion Pro", returnPct: 18.2, sharpe: 2.14, winRate: 71.2, maxDD: -4.8, trades: 189 },
  { name: "Crypto Trend Rider", returnPct: -3.4, sharpe: 0.42, winRate: 45.8, maxDD: -15.3, trades: 312 },
];

const monthlyPerformance = SAMPLE_BACKTEST_RESULTS.monthly_returns;

export function PerformanceDashboard() {
  const results = SAMPLE_BACKTEST_RESULTS;
  const equityData = SAMPLE_EQUITY_CURVE.filter((_, i) => i % 5 === 0);

  const totalStrategies = strategies.length;
  const avgWinRate = strategies.reduce((sum, s) => sum + s.winRate, 0) / strategies.length;
  const avgSharpe = strategies.reduce((sum, s) => sum + s.sharpe, 0) / strategies.length;
  const bestPerformer = strategies.reduce((best, s) => (s.returnPct > best.returnPct ? s : best), strategies[0]);
  const worstPerformer = strategies.reduce((worst, s) => (s.returnPct < worst.returnPct ? s : worst), strategies[0]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Strategies", value: totalStrategies.toString(), icon: Activity, color: "text-secondary-400", bg: "bg-secondary/10" },
          { label: "Avg Win Rate", value: `${avgWinRate.toFixed(1)}%`, icon: Target, color: "text-accent", bg: "bg-accent/10" },
          { label: "Avg Sharpe", value: avgSharpe.toFixed(2), icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Best Return", value: formatPercent(bestPerformer.returnPct), icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
          { label: "Worst Return", value: formatPercent(worstPerformer.returnPct), icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Total Trades", value: formatNumber(strategies.reduce((sum, s) => sum + s.trades, 0)), icon: BarChart3, color: "text-foreground", bg: "bg-primary-800" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className={`inline-flex p-1.5 rounded-md ${stat.bg} mb-2`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold data-text">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Portfolio Equity Curve</CardTitle>
            <CardDescription>Aggregated performance across all strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="perfEqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickFormatter={(v) => v.slice(5, 7)} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Equity"]}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#22C55E" fill="url(#perfEqGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Returns Bar Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Monthly Returns</CardTitle>
            <CardDescription>Return distribution by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(m) => months[m - 1]}
                  />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v) => [`${v}%`, "Return"]}
                    labelFormatter={(m) => months[(m as number) - 1]}
                  />
                  <Bar dataKey="return_pct" radius={[4, 4, 0, 0]}>
                    {monthlyPerformance.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.return_pct >= 0 ? "#22C55E" : "#ef4444"}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Heatmap */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Performance Heatmap</CardTitle>
          <CardDescription>Monthly returns across all strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-13 gap-1 mb-2">
                <div className="text-[10px] text-muted-foreground font-medium p-2">Year</div>
                {months.map((m) => (
                  <div key={m} className="text-[10px] text-muted-foreground font-medium text-center p-2">
                    {m}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-13 gap-1">
                <div className="text-xs font-mono text-muted-foreground p-2 flex items-center">2024</div>
                {monthlyPerformance.map((entry, index) => {
                  const value = entry.return_pct;
                  const intensity = Math.min(Math.abs(value) / 4, 1);
                  const bg = value >= 0
                    ? `rgba(34, 197, 94, ${0.1 + intensity * 0.6})`
                    : `rgba(239, 68, 68, ${0.1 + intensity * 0.6})`;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="rounded-md p-2 text-center cursor-default"
                      style={{ backgroundColor: bg }}
                      title={`${months[entry.month - 1]} 2024: ${formatPercent(value)}`}
                    >
                      <span className="text-xs font-mono font-semibold">
                        {value > 0 ? "+" : ""}{value.toFixed(1)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.5)" }} />
              <span>Negative</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
              <span>Neutral</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.5)" }} />
              <span>Positive</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Comparison */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base">Strategy Comparison</CardTitle>
          </div>
          <CardDescription>Side-by-side performance of all strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-3 text-xs text-muted-foreground font-medium">Strategy</th>
                  <th className="text-right py-3 px-3 text-xs text-muted-foreground font-medium">Return</th>
                  <th className="text-right py-3 px-3 text-xs text-muted-foreground font-medium">Sharpe</th>
                  <th className="text-right py-3 px-3 text-xs text-muted-foreground font-medium">Win Rate</th>
                  <th className="text-right py-3 px-3 text-xs text-muted-foreground font-medium">Max DD</th>
                  <th className="text-right py-3 px-3 text-xs text-muted-foreground font-medium">Trades</th>
                </tr>
              </thead>
              <tbody>
                {strategies.map((s, index) => (
                  <motion.tr
                    key={s.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-3 font-medium">{s.name}</td>
                    <td className={`py-3 px-3 text-right font-mono font-semibold ${s.returnPct >= 0 ? "text-accent" : "text-destructive"}`}>
                      {formatPercent(s.returnPct)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">{s.sharpe.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono">{s.winRate}%</td>
                    <td className="py-3 px-3 text-right font-mono text-yellow-500">{formatPercent(s.maxDD)}</td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">{s.trades}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
