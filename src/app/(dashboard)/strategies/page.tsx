"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,

  GitBranch,
  MoreVertical,

  Clock,
  Copy,
  Trash2,
  Eye,

  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPercent } from "@/lib/utils";

const strategies = [
  { id: "1", name: "Momentum Alpha v3", description: "Multi-timeframe momentum strategy combining RSI divergence with EMA crossovers for trend-aligned entries", market: "stocks", timeframe: "1d", status: "active", isPublic: true, tags: ["momentum", "trend-following"], lastBacktest: "2 hours ago", performance: { totalReturn: 24.8, sharpeRatio: 1.85, winRate: 62.5, maxDrawdown: -7.2, trades: 142 }},
  { id: "2", name: "Mean Reversion Pro", description: "Statistical mean reversion using Bollinger Bands %B and RSI oversold conditions with volume confirmation", market: "forex", timeframe: "4h", status: "active", isPublic: true, tags: ["mean-reversion", "statistical"], lastBacktest: "5 hours ago", performance: { totalReturn: 18.2, sharpeRatio: 2.14, winRate: 58.3, maxDrawdown: -5.1, trades: 89 }},
  { id: "3", name: "Crypto Trend Rider", description: "Captures sustained crypto trends using Supertrend and ADX filters with trailing ATR stops", market: "crypto", timeframe: "1h", status: "draft", isPublic: false, tags: ["trend-following", "crypto"], lastBacktest: "1 day ago", performance: { totalReturn: -3.4, sharpeRatio: 0.42, winRate: 45.2, maxDrawdown: -15.3, trades: 67 }},
  { id: "4", name: "Gold Momentum Rider", description: "Exploits gold's momentum patterns using MACD histogram and Keltner Channel breakouts", market: "metals", timeframe: "4h", status: "active", isPublic: true, tags: ["momentum", "metals", "breakout"], lastBacktest: "3 hours ago", performance: { totalReturn: 31.5, sharpeRatio: 1.92, winRate: 59.8, maxDrawdown: -8.4, trades: 98 }},
  { id: "5", name: "Silver Mean Reversion", description: "Silver's high volatility mean reversion using Bollinger Width expansion and CCI extremes", market: "metals", timeframe: "1h", status: "active", isPublic: true, tags: ["mean-reversion", "metals", "volatility"], lastBacktest: "6 hours ago", performance: { totalReturn: 22.1, sharpeRatio: 1.65, winRate: 55.4, maxDrawdown: -11.2, trades: 156 }},
  { id: "6", name: "MACD Divergence Hunter", description: "Identifies hidden and regular MACD divergences for high-probability reversal entries", market: "stocks", timeframe: "1d", status: "active", isPublic: true, tags: ["divergence", "reversal"], lastBacktest: "4 hours ago", performance: { totalReturn: 19.7, sharpeRatio: 1.78, winRate: 64.1, maxDrawdown: -6.8, trades: 73 }},
  { id: "7", name: "Bollinger Band Bounce", description: "Trades bounces off Bollinger Band extremes with RSI confirmation and volume spike detection", market: "stocks", timeframe: "4h", status: "active", isPublic: false, tags: ["mean-reversion", "volatility"], lastBacktest: "1 day ago", performance: { totalReturn: 15.3, sharpeRatio: 1.54, winRate: 61.2, maxDrawdown: -5.9, trades: 112 }},
  { id: "8", name: "VWAP Reversion Strategy", description: "Intraday VWAP deviation strategy for scalping around the volume-weighted average price", market: "stocks", timeframe: "5m", status: "active", isPublic: true, tags: ["vwap", "scalping", "intraday"], lastBacktest: "30 minutes ago", performance: { totalReturn: 12.8, sharpeRatio: 2.31, winRate: 68.5, maxDrawdown: -3.2, trades: 458 }},
  { id: "9", name: "Ichimoku Cloud System", description: "Full Ichimoku trading system using cloud breakouts, TK cross, and Chikou span confirmation", market: "forex", timeframe: "1d", status: "active", isPublic: true, tags: ["trend-following", "ichimoku"], lastBacktest: "8 hours ago", performance: { totalReturn: 27.4, sharpeRatio: 1.68, winRate: 52.1, maxDrawdown: -9.5, trades: 64 }},
  { id: "10", name: "Triple EMA Crossover", description: "Three-period EMA ribbon strategy (8/21/55) with ADX trend strength filter", market: "forex", timeframe: "4h", status: "active", isPublic: true, tags: ["trend-following", "ema"], lastBacktest: "12 hours ago", performance: { totalReturn: 21.6, sharpeRatio: 1.45, winRate: 54.8, maxDrawdown: -8.1, trades: 95 }},
  { id: "11", name: "Keltner Channel Breakout", description: "Trades breakouts above/below Keltner Channels with ATR-based position sizing", market: "futures", timeframe: "1h", status: "active", isPublic: true, tags: ["breakout", "volatility"], lastBacktest: "2 hours ago", performance: { totalReturn: 16.9, sharpeRatio: 1.38, winRate: 48.7, maxDrawdown: -10.3, trades: 187 }},
  { id: "12", name: "RSI Divergence Trader", description: "Combines RSI divergence signals with Fibonacci retracement levels for precise entry timing", market: "stocks", timeframe: "1d", status: "active", isPublic: false, tags: ["divergence", "fibonacci"], lastBacktest: "5 hours ago", performance: { totalReturn: 20.3, sharpeRatio: 1.89, winRate: 63.7, maxDrawdown: -6.2, trades: 81 }},
  { id: "13", name: "Metals Breakout Scanner", description: "Scans precious metals for Donchian Channel breakouts with volume confirmation", market: "metals", timeframe: "1d", status: "active", isPublic: true, tags: ["breakout", "metals", "donchian"], lastBacktest: "1 day ago", performance: { totalReturn: 28.7, sharpeRatio: 1.71, winRate: 51.3, maxDrawdown: -12.1, trades: 45 }},
  { id: "14", name: "Crypto Volatility Squeeze", description: "Identifies low-volatility compression zones in crypto using Bollinger Width and Keltner ratio", market: "crypto", timeframe: "4h", status: "active", isPublic: true, tags: ["volatility", "squeeze", "crypto"], lastBacktest: "3 hours ago", performance: { totalReturn: 35.2, sharpeRatio: 1.52, winRate: 47.8, maxDrawdown: -18.5, trades: 72 }},
  { id: "15", name: "Fibonacci Retracement System", description: "Automated Fibonacci level identification with confluence zone detection and trend alignment", market: "stocks", timeframe: "1d", status: "draft", isPublic: false, tags: ["fibonacci", "support-resistance"], lastBacktest: "2 days ago", performance: { totalReturn: 14.1, sharpeRatio: 1.22, winRate: 56.9, maxDrawdown: -7.8, trades: 93 }},
  { id: "16", name: "ADX Trend Strength", description: "Enters trending markets when ADX rises above 25 using directional indicators +DI/-DI crossovers", market: "forex", timeframe: "4h", status: "active", isPublic: true, tags: ["trend-following", "adx"], lastBacktest: "6 hours ago", performance: { totalReturn: 17.8, sharpeRatio: 1.61, winRate: 53.4, maxDrawdown: -7.5, trades: 108 }},
  { id: "17", name: "Stochastic Momentum", description: "Combines Stochastic oscillator with MACD momentum for multi-confirmation entries", market: "stocks", timeframe: "1h", status: "active", isPublic: true, tags: ["momentum", "oscillator"], lastBacktest: "1 hour ago", performance: { totalReturn: 13.5, sharpeRatio: 1.42, winRate: 59.1, maxDrawdown: -5.4, trades: 203 }},
  { id: "18", name: "Multi-Asset Trend", description: "Cross-market trend following using relative strength comparison across stocks, forex, crypto, and metals", market: "stocks", timeframe: "1d", status: "active", isPublic: true, tags: ["trend-following", "multi-asset"], lastBacktest: "4 hours ago", performance: { totalReturn: 32.1, sharpeRatio: 2.05, winRate: 57.6, maxDrawdown: -9.8, trades: 56 }},
  { id: "19", name: "Volume Profile Breakout", description: "Uses volume profile analysis to identify high-volume nodes and trade breakouts from value areas", market: "futures", timeframe: "1h", status: "draft", isPublic: false, tags: ["volume", "breakout"], lastBacktest: "1 day ago", performance: { totalReturn: 11.2, sharpeRatio: 1.15, winRate: 50.3, maxDrawdown: -8.9, trades: 134 }},
  { id: "20", name: "Forex Range Trader", description: "Identifies ranging forex pairs using ADX below 20 and trades Bollinger Band bounces within the range", market: "forex", timeframe: "1h", status: "active", isPublic: true, tags: ["range-trading", "forex"], lastBacktest: "2 hours ago", performance: { totalReturn: 16.4, sharpeRatio: 1.95, winRate: 66.2, maxDrawdown: -4.3, trades: 178 }},
  { id: "21", name: "Williams %R Reversal", description: "Uses Williams %R extreme readings with price action confirmation for reversal trading", market: "stocks", timeframe: "4h", status: "active", isPublic: true, tags: ["reversal", "oscillator"], lastBacktest: "7 hours ago", performance: { totalReturn: 14.7, sharpeRatio: 1.33, winRate: 57.8, maxDrawdown: -6.7, trades: 125 }},
  { id: "22", name: "Copper Trend Follower", description: "Follows copper's industrial demand cycles using DEMA crossovers and OBV volume confirmation", market: "metals", timeframe: "1d", status: "active", isPublic: true, tags: ["trend-following", "metals", "copper"], lastBacktest: "1 day ago", performance: { totalReturn: 19.3, sharpeRatio: 1.47, winRate: 52.8, maxDrawdown: -10.6, trades: 38 }},
  { id: "23", name: "Scalping Power Play", description: "High-frequency scalping using 1-minute RSI extremes, VWAP deviation, and tick volume spikes", market: "stocks", timeframe: "1m", status: "active", isPublic: false, tags: ["scalping", "high-frequency"], lastBacktest: "10 minutes ago", performance: { totalReturn: 8.9, sharpeRatio: 2.67, winRate: 71.2, maxDrawdown: -2.1, trades: 1247 }},
  { id: "24", name: "Parabolic SAR Swing", description: "Swing trading using Parabolic SAR trend direction with ATR trailing stops and risk management", market: "stocks", timeframe: "1d", status: "active", isPublic: true, tags: ["swing-trading", "trend-following"], lastBacktest: "3 hours ago", performance: { totalReturn: 22.6, sharpeRatio: 1.56, winRate: 54.2, maxDrawdown: -8.8, trades: 67 }},
];

export default function StrategiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMarket, setFilterMarket] = useState("all");

  const filteredStrategies = strategies.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMarket = filterMarket === "all" || s.market === filterMarket;
    return matchesSearch && matchesMarket;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Strategies</h1>
          <p className="text-muted-foreground">
            Build, manage, and backtest your trading strategies.
          </p>
        </div>
        <Link href="/strategies/new">
          <Button variant="glow" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "stocks", "forex", "crypto", "futures", "metals"].map((market) => (
            <Button
              key={market}
              variant={filterMarket === market ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilterMarket(market)}
              className="text-xs capitalize"
            >
              {market}
            </Button>
          ))}
        </div>
      </div>

      {filteredStrategies.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-800/50 mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No strategies found</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              {searchQuery
                ? `No strategies match "${searchQuery}". Try a different search term.`
                : "Create your first strategy to start discovering your trading edge."}
            </p>
            <Link href="/strategies/new">
              <Button variant="glow" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Strategy
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="glass-card-hover group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-800/50 group-hover:bg-primary-800 transition-colors">
                      <GitBranch className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/strategies/${strategy.id}`}
                              className="text-base font-semibold hover:text-accent transition-colors"
                            >
                              {strategy.name}
                            </Link>
                            <Badge
                              variant={strategy.status === "active" ? "success" : "outline"}
                              className="text-[10px]"
                            >
                              {strategy.status}
                            </Badge>
                            {strategy.isPublic && (
                              <Badge variant="secondary" className="text-[10px]">
                                <Eye className="h-2.5 w-2.5 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {strategy.description}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Run Backtest
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {strategy.market}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {strategy.timeframe}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {strategy.lastBacktest}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {strategy.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-primary-800/50 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p
                          className={`text-lg font-bold data-text ${
                            strategy.performance.totalReturn >= 0 ? "text-accent" : "text-destructive"
                          }`}
                        >
                          {formatPercent(strategy.performance.totalReturn)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Return</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold data-text text-secondary-400">
                          {strategy.performance.sharpeRatio.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Sharpe</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold data-text">
                          {strategy.performance.winRate}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">Win Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold data-text text-muted-foreground">
                          {strategy.performance.trades}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Trades</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
