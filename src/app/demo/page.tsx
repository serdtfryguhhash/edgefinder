"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  Shield,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

const ASSETS = ["AAPL", "TSLA", "BTC/USD", "EUR/USD", "SPY"] as const;
const STRATEGIES = [
  "RSI Oversold",
  "MACD Crossover",
  "Moving Average Cross",
  "Bollinger Bounce",
  "Mean Reversion",
] as const;
const TIMEFRAMES = ["1Y", "3Y", "5Y"] as const;

type Asset = (typeof ASSETS)[number];
type Strategy = (typeof STRATEGIES)[number];
type Timeframe = (typeof TIMEFRAMES)[number];

interface BacktestResults {
  totalReturn: number;
  sharpeRatio: number;
  winRate: number;
  maxDrawdown: number;
  totalTrades: number;
  avgTradeDuration: string;
  equityCurve: { month: string; equity: number }[];
  monthlyReturns: { month: string; return_pct: number }[];
}

function generateResults(
  asset: Asset,
  strategy: Strategy,
  timeframe: Timeframe
): BacktestResults {
  const seed =
    asset.charCodeAt(0) * 100 +
    strategy.charCodeAt(0) * 10 +
    timeframe.charCodeAt(0);
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 49297;
    return x - Math.floor(x);
  };

  const strategyRanges: Record<
    Strategy,
    {
      winRate: [number, number];
      returnRange: [number, number];
      sharpeRange: [number, number];
      drawdownRange: [number, number];
      tradesRange: [number, number];
    }
  > = {
    "RSI Oversold": {
      winRate: [55, 65],
      returnRange: [12, 38],
      sharpeRange: [1.1, 2.2],
      drawdownRange: [6, 15],
      tradesRange: [80, 200],
    },
    "MACD Crossover": {
      winRate: [50, 60],
      returnRange: [8, 32],
      sharpeRange: [0.9, 1.9],
      drawdownRange: [8, 18],
      tradesRange: [60, 150],
    },
    "Moving Average Cross": {
      winRate: [48, 58],
      returnRange: [10, 28],
      sharpeRange: [0.8, 1.7],
      drawdownRange: [7, 16],
      tradesRange: [40, 120],
    },
    "Bollinger Bounce": {
      winRate: [52, 64],
      returnRange: [14, 35],
      sharpeRange: [1.0, 2.1],
      drawdownRange: [5, 14],
      tradesRange: [90, 220],
    },
    "Mean Reversion": {
      winRate: [58, 68],
      returnRange: [10, 30],
      sharpeRange: [1.2, 2.4],
      drawdownRange: [4, 12],
      tradesRange: [100, 250],
    },
  };

  const ranges = strategyRanges[strategy];
  const lerp = (min: number, max: number, t: number) =>
    min + (max - min) * t;

  const totalReturn = parseFloat(
    lerp(ranges.returnRange[0], ranges.returnRange[1], pseudoRandom(1)).toFixed(
      1
    )
  );
  const sharpeRatio = parseFloat(
    lerp(ranges.sharpeRange[0], ranges.sharpeRange[1], pseudoRandom(2)).toFixed(
      2
    )
  );
  const winRate = parseFloat(
    lerp(ranges.winRate[0], ranges.winRate[1], pseudoRandom(3)).toFixed(1)
  );
  const maxDrawdown = parseFloat(
    lerp(
      ranges.drawdownRange[0],
      ranges.drawdownRange[1],
      pseudoRandom(4)
    ).toFixed(1)
  );
  const totalTrades = Math.round(
    lerp(ranges.tradesRange[0], ranges.tradesRange[1], pseudoRandom(5))
  );

  const durationDays = Math.round(lerp(2, 12, pseudoRandom(6)));
  const avgTradeDuration = `${durationDays} days`;

  const months = timeframe === "1Y" ? 12 : timeframe === "3Y" ? 36 : 60;
  const monthlyGrowth = totalReturn / 100 / months;

  const equityCurve: { month: string; equity: number }[] = [];
  let equity = 100000;
  for (let i = 0; i <= months; i++) {
    const monthLabel =
      timeframe === "1Y"
        ? `M${i}`
        : timeframe === "3Y"
          ? `M${i}`
          : `M${i}`;
    equityCurve.push({
      month: monthLabel,
      equity: Math.round(equity),
    });
    const noise = (pseudoRandom(i * 7 + 100) - 0.45) * 0.03;
    equity *= 1 + monthlyGrowth + noise;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyReturns: { month: string; return_pct: number }[] = [];
  const displayMonths = Math.min(months, 24);
  for (let i = 0; i < displayMonths; i++) {
    const base = monthlyGrowth * 100;
    const variation = (pseudoRandom(i * 13 + 200) - 0.4) * 6;
    monthlyReturns.push({
      month: monthNames[i % 12],
      return_pct: parseFloat((base + variation).toFixed(1)),
    });
  }

  return {
    totalReturn,
    sharpeRatio,
    winRate,
    maxDrawdown,
    totalTrades,
    avgTradeDuration,
    equityCurve,
    monthlyReturns,
  };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-primary-800/50 border border-white/5 p-4"
          >
            <div className="h-3 w-16 bg-white/5 rounded mb-3" />
            <div className="h-7 w-20 bg-white/10 rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-primary-800/50 border border-white/5 p-6">
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        <div className="flex items-end gap-1 h-64">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-accent/20 rounded-t"
              style={{
                height: `${30 + Math.sin(i * 0.3) * 20 + i * 1.5}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [asset, setAsset] = useState<Asset>("AAPL");
  const [strategy, setStrategy] = useState<Strategy>("RSI Oversold");
  const [timeframe, setTimeframe] = useState<Timeframe>("1Y");
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const results = useMemo(() => {
    if (!hasRun) return null;
    return generateResults(asset, strategy, timeframe);
  }, [asset, strategy, timeframe, hasRun]);

  const handleRunBacktest = useCallback(() => {
    setIsLoading(true);
    setHasRun(false);
    setTimeout(() => {
      setIsLoading(false);
      setHasRun(true);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <span className="text-lg font-bold text-foreground">
                  Edge<span className="text-accent">Finder</span>
                </span>
              </Link>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary/10 text-secondary-400 border border-secondary/20">
                Interactive Demo
              </span>
            </div>
            <Link href="/signup">
              <Button variant="glow" size="sm">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Strategy Builder */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Strategy <span className="text-accent">Backtester</span>
          </h1>
          <p className="text-muted-foreground">
            Configure your strategy and run a backtest to see simulated results.
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-card/50 backdrop-blur-xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Asset Select */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Asset
              </label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value as Asset)}
                className="w-full h-11 rounded-lg bg-primary-800/50 border border-white/10 text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 appearance-none cursor-pointer"
              >
                {ASSETS.map((a) => (
                  <option key={a} value={a} className="bg-primary-900">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Strategy Select */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Strategy
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as Strategy)}
                className="w-full h-11 rounded-lg bg-primary-800/50 border border-white/10 text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 appearance-none cursor-pointer"
              >
                {STRATEGIES.map((s) => (
                  <option key={s} value={s} className="bg-primary-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Toggle */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Timeframe
              </label>
              <div className="flex h-11 rounded-lg bg-primary-800/50 border border-white/10 p-1">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`flex-1 rounded-md text-sm font-medium transition-all ${
                      timeframe === tf
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <button
                onClick={handleRunBacktest}
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-gradient-to-r from-accent to-emerald-400 text-accent-foreground font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Run Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading && <LoadingSkeleton />}

        {!isLoading && results && (
          <div className="space-y-6 animate-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  label: "Total Return",
                  value: `+${results.totalReturn}%`,
                  icon: TrendingUp,
                  color: "text-accent",
                },
                {
                  label: "Sharpe Ratio",
                  value: results.sharpeRatio.toFixed(2),
                  icon: Zap,
                  color: "text-secondary-400",
                },
                {
                  label: "Win Rate",
                  value: `${results.winRate}%`,
                  icon: Target,
                  color: "text-accent",
                },
                {
                  label: "Max Drawdown",
                  value: `-${results.maxDrawdown}%`,
                  icon: Shield,
                  color: "text-yellow-500",
                },
                {
                  label: "Total Trades",
                  value: results.totalTrades.toString(),
                  icon: BarChart3,
                  color: "text-secondary-400",
                },
                {
                  label: "Avg Duration",
                  value: results.avgTradeDuration,
                  icon: Clock,
                  color: "text-muted-foreground",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-card/50 backdrop-blur-xl border border-white/5 p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon
                      className={`h-4 w-4 ${stat.color} opacity-70`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <p
                    className={`text-xl font-bold font-mono tabular-nums ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Equity Curve */}
              <div className="rounded-xl bg-card/50 backdrop-blur-xl border border-white/5 p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  Equity Curve
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.equityCurve}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                        interval={Math.max(
                          0,
                          Math.floor(results.equityCurve.length / 8)
                        )}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                        tickFormatter={(v) =>
                          `$${(v / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                        formatter={(value: number | string | undefined) => [
                          `$${Number(value ?? 0).toLocaleString()}`,
                          "Equity",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="equity"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#22c55e" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Returns */}
              <div className="rounded-xl bg-card/50 backdrop-blur-xl border border-white/5 p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  Monthly Returns
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.monthlyReturns}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                        formatter={(value: number | string | undefined) => [
                          `${Number(value ?? 0).toFixed(1)}%`,
                          "Return",
                        ]}
                      />
                      <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                      <Bar dataKey="return_pct" radius={[4, 4, 0, 0]}>
                        {results.monthlyReturns.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={
                              entry.return_pct >= 0 ? "#22c55e" : "#ef4444"
                            }
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-xl bg-gradient-to-r from-secondary/20 via-accent/10 to-secondary/20 border border-white/5 p-8 text-center">
              <h3 className="text-xl font-bold mb-2">
                Like what you see?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Sign up to save this strategy, access 200+ indicators, and
                backtest with real historical data across all markets.
              </p>
              <Link href="/signup">
                <Button variant="glow" size="lg" className="group">
                  Sign Up to Save This Strategy
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasRun && (
          <div className="rounded-xl border border-dashed border-white/10 bg-card/30 p-16 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-accent/5 mb-4">
              <BarChart3 className="h-8 w-8 text-accent/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Configure &amp; Run
            </h3>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
              Select an asset, choose a strategy, pick a timeframe, and click
              &quot;Run Backtest&quot; to see simulated results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
