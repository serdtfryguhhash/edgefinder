"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Shield,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  GitBranch,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPercent, formatCurrency, formatNumber } from "@/lib/utils";
import { SAMPLE_BACKTEST_RESULTS, SAMPLE_EQUITY_CURVE } from "@/constants";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    title: "Portfolio Return",
    value: "+24.8%",
    change: "+3.2%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Sharpe Ratio",
    value: "1.85",
    change: "+0.12",
    trend: "up" as const,
    icon: Zap,
    color: "text-secondary-400",
    bgColor: "bg-secondary/10",
  },
  {
    title: "Win Rate",
    value: "62.5%",
    change: "-1.3%",
    trend: "down" as const,
    icon: BarChart3,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Max Drawdown",
    value: "-7.2%",
    change: "+0.5%",
    trend: "up" as const,
    icon: Shield,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

const recentStrategies = [
  {
    id: "1",
    name: "Momentum Alpha v3",
    market: "Stocks",
    returnPct: 24.8,
    status: "active",
    lastBacktest: "2 hours ago",
  },
  {
    id: "2",
    name: "Mean Reversion Pro",
    market: "Forex",
    returnPct: 18.2,
    status: "active",
    lastBacktest: "5 hours ago",
  },
  {
    id: "3",
    name: "Crypto Trend Rider",
    market: "Crypto",
    returnPct: -3.4,
    status: "draft",
    lastBacktest: "1 day ago",
  },
];

const recentActivity = [
  { action: "Backtest completed", target: "Momentum Alpha v3", time: "2 hours ago", icon: Activity },
  { action: "Strategy published", target: "Mean Reversion Pro", time: "5 hours ago", icon: GitBranch },
  { action: "Reached rank #12", target: "Leaderboard", time: "1 day ago", icon: Trophy },
  { action: "Strategy cloned", target: "by Sarah Mitchell", time: "2 days ago", icon: GitBranch },
];

export default function DashboardPage() {
  const equityData = SAMPLE_EQUITY_CURVE.filter((_, i) => i % 3 === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Marcus. Here&apos;s your portfolio overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/strategies/new">
            <Button variant="glow" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="glass-card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === "up" ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold data-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Equity Curve</CardTitle>
              <CardDescription>Combined strategy performance over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {["1M", "3M", "6M", "1Y", "ALL"].map((period) => (
                <Button
                  key={period}
                  variant={period === "1Y" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, ""]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#3b82f6"
                    fill="url(#benchmarkGradient)"
                    strokeWidth={1.5}
                    name="S&P 500"
                  />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#22C55E"
                    fill="url(#equityGradient)"
                    strokeWidth={2}
                    name="Portfolio"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 rounded bg-accent" />
                <span className="text-muted-foreground">Portfolio (+24.8%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 rounded bg-secondary-400" />
                <span className="text-muted-foreground">S&P 500 (+12.4%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest actions and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-800/50">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      {item.action}{" "}
                      <span className="text-accent font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategies & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Strategies */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Strategies</CardTitle>
              <CardDescription>Your current strategy portfolio</CardDescription>
            </div>
            <Link href="/strategies">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStrategies.map((strategy) => (
                <Link
                  key={strategy.id}
                  href={`/strategies/${strategy.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800/50 group-hover:bg-primary-800">
                    <GitBranch className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{strategy.name}</p>
                      <Badge
                        variant={strategy.status === "active" ? "success" : "outline"}
                        className="text-[10px]"
                      >
                        {strategy.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {strategy.market} &middot; Last tested {strategy.lastBacktest}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-mono font-semibold ${
                        strategy.returnPct >= 0 ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {formatPercent(strategy.returnPct)}
                    </p>
                    <p className="text-xs text-muted-foreground">return</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan Usage */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Plan Usage</CardTitle>
            <CardDescription>Free plan limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Strategies</span>
                <span className="data-text">3 / 3</span>
              </div>
              <Progress value={100} />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Backtests Today</span>
                <span className="data-text">2 / 5</span>
              </div>
              <Progress value={40} />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Indicators</span>
                <span className="data-text">12 / 50</span>
              </div>
              <Progress value={24} />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Historical Data</span>
                <span className="data-text">2 years</span>
              </div>
              <Progress value={10} />
            </div>

            <Link href="/pricing">
              <Button variant="glow" className="w-full" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Key Performance Metrics</CardTitle>
          <CardDescription>Aggregated statistics across all active strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Return", value: formatCurrency(SAMPLE_BACKTEST_RESULTS.total_return), positive: true },
              { label: "Profit Factor", value: SAMPLE_BACKTEST_RESULTS.profit_factor.toFixed(2), positive: true },
              { label: "Sortino Ratio", value: SAMPLE_BACKTEST_RESULTS.sortino_ratio.toFixed(2), positive: true },
              { label: "Total Trades", value: formatNumber(SAMPLE_BACKTEST_RESULTS.total_trades), positive: null },
              { label: "Avg Win", value: formatPercent(SAMPLE_BACKTEST_RESULTS.avg_win_pct), positive: true },
              { label: "Avg Loss", value: formatPercent(SAMPLE_BACKTEST_RESULTS.avg_loss_pct), positive: false },
            ].map((metric) => (
              <div key={metric.label} className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p
                  className={`text-lg font-bold data-text ${
                    metric.positive === true
                      ? "text-accent"
                      : metric.positive === false
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
