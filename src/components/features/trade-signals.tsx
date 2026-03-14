"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  Activity,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Filter,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SignalDirection = "BUY" | "SELL";
type SignalStrength = "Strong" | "Moderate" | "Weak";

interface TradeSignal {
  id: string;
  ticker: string;
  company: string;
  market: string;
  direction: SignalDirection;
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  currentPrice: number;
  timeframe: string;
  strategy: string;
  strength: SignalStrength;
  timestamp: string;
  riskReward: number;
  indicators: {
    bullish: string[];
    bearish: string[];
    neutral: string[];
  };
  indicatorCount: number;
  confluenceScore: number;
}

// Fallback demo data in case API fails
const FALLBACK_SIGNALS: TradeSignal[] = [
  {
    id: "sig_1",
    ticker: "AAPL",
    company: "Apple Inc.",
    market: "stocks",
    direction: "BUY",
    confidence: 92,
    entryPrice: 178.50,
    stopLoss: 174.20,
    takeProfit: 186.80,
    currentPrice: 179.05,
    timeframe: "1D",
    strategy: "Multi-Confluence",
    strength: "Strong",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    riskReward: 1.93,
    indicators: {
      bullish: ["RSI Oversold (28.4)", "MACD Bullish Cross", "EMA 20/50 Golden Cross", "VWAP Support", "Stochastic Oversold"],
      bearish: ["Bollinger Band Upper Resistance"],
      neutral: ["ADX Flat (18.2)", "OBV Sideways"],
    },
    indicatorCount: 8,
    confluenceScore: 87,
  },
  {
    id: "sig_2",
    ticker: "TSLA",
    company: "Tesla Inc.",
    market: "stocks",
    direction: "SELL",
    confidence: 78,
    entryPrice: 245.30,
    stopLoss: 252.10,
    takeProfit: 231.50,
    currentPrice: 244.80,
    timeframe: "4H",
    strategy: "Mean Reversion",
    strength: "Moderate",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    riskReward: 2.03,
    indicators: {
      bullish: ["Volume Increasing"],
      bearish: ["RSI Overbought (74.2)", "Bearish Divergence", "MACD Histogram Declining", "Price Above BB Upper"],
      neutral: ["ADX Moderate (24.6)", "ATR Expanding"],
    },
    indicatorCount: 7,
    confluenceScore: 72,
  },
  {
    id: "sig_3",
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    market: "stocks",
    direction: "BUY",
    confidence: 88,
    entryPrice: 892.40,
    stopLoss: 875.00,
    takeProfit: 925.00,
    currentPrice: 894.10,
    timeframe: "1D",
    strategy: "Breakout",
    strength: "Strong",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    riskReward: 1.87,
    indicators: {
      bullish: ["Volume Surge (+180%)", "Breakout Above Resistance", "MACD Above Signal", "RSI Momentum (62.8)", "Ichimoku Cloud Breakout", "ADX Strong Trend (32.1)"],
      bearish: ["Overbought Short-term"],
      neutral: ["ATR Expanding"],
    },
    indicatorCount: 8,
    confluenceScore: 85,
  },
  {
    id: "sig_4",
    ticker: "EUR/USD",
    company: "Euro / US Dollar",
    market: "forex",
    direction: "SELL",
    confidence: 81,
    entryPrice: 1.0865,
    stopLoss: 1.0920,
    takeProfit: 1.0750,
    currentPrice: 1.0848,
    timeframe: "4H",
    strategy: "Trend Following",
    strength: "Moderate",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    riskReward: 2.09,
    indicators: {
      bullish: ["Stochastic Oversold"],
      bearish: ["EMA 20 Below EMA 50", "MACD Bearish", "RSI Declining (38.5)", "Price Below Ichimoku Cloud"],
      neutral: ["ADX Moderate (22.8)", "Bollinger Band Narrowing"],
    },
    indicatorCount: 7,
    confluenceScore: 76,
  },
  {
    id: "sig_5",
    ticker: "BTC/USD",
    company: "Bitcoin / US Dollar",
    market: "crypto",
    direction: "BUY",
    confidence: 85,
    entryPrice: 67250.00,
    stopLoss: 65500.00,
    takeProfit: 72000.00,
    currentPrice: 67845.00,
    timeframe: "1D",
    strategy: "Breakout",
    strength: "Strong",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    riskReward: 2.71,
    indicators: {
      bullish: ["Hash Ribbon Buy Signal", "MACD Bullish Cross", "RSI Momentum (58.3)", "Volume Profile POC Support", "50 DMA Support"],
      bearish: ["Weekly RSI Extended"],
      neutral: ["Funding Rate Neutral", "Open Interest Stable"],
    },
    indicatorCount: 8,
    confluenceScore: 82,
  },
  {
    id: "sig_6",
    ticker: "META",
    company: "Meta Platforms",
    market: "stocks",
    direction: "BUY",
    confidence: 90,
    entryPrice: 502.30,
    stopLoss: 492.00,
    takeProfit: 518.50,
    currentPrice: 503.80,
    timeframe: "1D",
    strategy: "Momentum",
    strength: "Strong",
    timestamp: new Date(Date.now() - 420000).toISOString(),
    riskReward: 1.57,
    indicators: {
      bullish: ["Ichimoku Cloud Breakout", "MACD Histogram Expanding", "RSI Bullish (61.5)", "Volume Confirmation", "EMA Fan Bullish"],
      bearish: ["Approaching Resistance Zone"],
      neutral: ["ATR Normal"],
    },
    indicatorCount: 7,
    confluenceScore: 84,
  },
  {
    id: "sig_7",
    ticker: "GBP/JPY",
    company: "British Pound / Japanese Yen",
    market: "forex",
    direction: "BUY",
    confidence: 76,
    entryPrice: 191.45,
    stopLoss: 189.80,
    takeProfit: 194.20,
    currentPrice: 191.72,
    timeframe: "1H",
    strategy: "Momentum",
    strength: "Moderate",
    timestamp: new Date(Date.now() - 360000).toISOString(),
    riskReward: 1.67,
    indicators: {
      bullish: ["RSI Bounce (42 -> 55)", "Stochastic Cross Up", "Price Above VWAP"],
      bearish: ["Daily Trend Down", "200 EMA Overhead"],
      neutral: ["ADX Low (16.4)"],
    },
    indicatorCount: 6,
    confluenceScore: 68,
  },
  {
    id: "sig_8",
    ticker: "ETH/USD",
    company: "Ethereum / US Dollar",
    market: "crypto",
    direction: "SELL",
    confidence: 74,
    entryPrice: 3520.00,
    stopLoss: 3620.00,
    takeProfit: 3320.00,
    currentPrice: 3505.00,
    timeframe: "4H",
    strategy: "Mean Reversion",
    strength: "Moderate",
    timestamp: new Date(Date.now() - 480000).toISOString(),
    riskReward: 2.00,
    indicators: {
      bullish: ["Long-term Trend Up"],
      bearish: ["RSI Overbought (71.8)", "Bearish Divergence on 4H", "Volume Declining", "Price at BB Upper"],
      neutral: ["Funding Rate Slightly Positive", "ETH/BTC Ratio Flat"],
    },
    indicatorCount: 7,
    confluenceScore: 70,
  },
];

// Filter options
const MARKET_OPTIONS = [
  { value: "all", label: "All Markets" },
  { value: "stocks", label: "Stocks" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "metals", label: "Metals" },
];

const TIMEFRAME_OPTIONS = [
  { value: "all", label: "All" },
  { value: "1H", label: "1H" },
  { value: "4H", label: "4H" },
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
];

const STRATEGY_OPTIONS = [
  { value: "all", label: "All Strategies" },
  { value: "Momentum", label: "Momentum" },
  { value: "Mean Reversion", label: "Mean Reversion" },
  { value: "Trend Following", label: "Trend Following" },
  { value: "Breakout", label: "Breakout" },
  { value: "Multi-Confluence", label: "Multi-Confluence" },
];

function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return "text-accent";
  if (confidence >= 70) return "text-yellow-500";
  return "text-orange-500";
}

function getStrengthBadgeVariant(strength: SignalStrength): "success" | "warning" | "outline" {
  if (strength === "Strong") return "success";
  if (strength === "Moderate") return "warning";
  return "outline";
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

function getMarketBadgeVariant(market: string): "default" | "secondary" | "warning" {
  if (market === "stocks") return "default";
  if (market === "forex") return "secondary";
  return "warning";
}

export function TradeSignals() {
  const [signals, setSignals] = useState<TradeSignal[]>(FALLBACK_SIGNALS);
  const [directionFilter, setDirectionFilter] = useState<"all" | "BUY" | "SELL">("all");
  const [marketFilter, setMarketFilter] = useState("all");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [apiError, setApiError] = useState(false);

  // Fetch signals from API
  const fetchSignals = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setApiError(false);

    try {
      const params = new URLSearchParams();
      if (marketFilter !== "all") params.set("market", marketFilter);
      if (timeframeFilter !== "all") params.set("timeframe", timeframeFilter);
      if (strategyFilter !== "all") params.set("strategy", strategyFilter);
      params.set("count", "8");

      const response = await fetch(`/api/signals?${params.toString()}`);

      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const data = await response.json();

      if (data.signals && Array.isArray(data.signals) && data.signals.length > 0) {
        setSignals(data.signals);
      } else {
        // API returned empty signals, use fallback
        setSignals(FALLBACK_SIGNALS);
        setApiError(true);
      }
    } catch {
      // API failed, use fallback data
      setSignals(FALLBACK_SIGNALS);
      setApiError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefresh(new Date());
    }
  }, [marketFilter, timeframeFilter, strategyFilter]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignals(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  // Simulate price ticks between API refreshes
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => ({
          ...s,
          currentPrice: +(
            s.currentPrice * (1 + (Math.random() - 0.5) * 0.001)
          ).toFixed(s.entryPrice < 10 ? 4 : 2),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Apply direction filter client-side (market/timeframe/strategy go to API)
  const filteredSignals = signals.filter((s) => {
    if (directionFilter !== "all" && s.direction !== directionFilter) return false;
    // Client-side fallback filtering when API is down
    if (apiError) {
      if (marketFilter !== "all" && s.market !== marketFilter) return false;
      if (timeframeFilter !== "all" && s.timeframe !== timeframeFilter) return false;
      if (strategyFilter !== "all" && s.strategy !== strategyFilter) return false;
    }
    return true;
  });

  const buyCount = filteredSignals.filter((s) => s.direction === "BUY").length;
  const sellCount = filteredSignals.filter((s) => s.direction === "SELL").length;
  const avgConfidence = filteredSignals.length > 0
    ? Math.round(filteredSignals.reduce((sum, s) => sum + s.confidence, 0) / filteredSignals.length)
    : 0;

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSignals(false);
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Live Trade Signals
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
              </CardTitle>
              <CardDescription>
                AI-generated signals based on 105+ technical indicators.{" "}
                {apiError && (
                  <span className="text-yellow-500">Using demo data (API unavailable).</span>
                )}
                {!apiError && (
                  <span className="text-muted-foreground">
                    Last updated {formatTimeAgo(lastRefresh.toISOString())}
                  </span>
                )}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-xs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              {buyCount} Buy
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
              <TrendingDown className="h-3.5 w-3.5" />
              {sellCount} Sell
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 text-xs font-medium">
              <Activity className="h-3.5 w-3.5" />
              {avgConfidence}% Avg Confidence
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mt-4 space-y-3">
            {/* Direction Filter */}
            <div className="flex items-center gap-2">
              {(["all", "BUY", "SELL"] as const).map((f) => (
                <Button
                  key={f}
                  variant={directionFilter === f ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-3"
                  onClick={() => setDirectionFilter(f)}
                >
                  {f === "all" ? "All Signals" : f}
                </Button>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />

              {/* Market Filter */}
              <select
                value={marketFilter}
                onChange={(e) => setMarketFilter(e.target.value)}
                className="h-7 px-2 text-xs rounded-md border border-white/10 bg-primary-800/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
              >
                {MARKET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Timeframe Filter */}
              <div className="flex items-center gap-1">
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={timeframeFilter === opt.value ? "secondary" : "ghost"}
                    size="sm"
                    className="text-[10px] h-7 px-2"
                    onClick={() => setTimeframeFilter(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>

              {/* Strategy Filter */}
              <select
                value={strategyFilter}
                onChange={(e) => setStrategyFilter(e.target.value)}
                className="h-7 px-2 text-xs rounded-md border border-white/10 bg-primary-800/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
              >
                {STRATEGY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Disclaimer */}
          <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
            <p className="text-[10px] text-yellow-500/80">
              Signals are generated from backtested technical indicators and are for educational purposes only. Not financial advice. Past performance does not guarantee future results.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent mr-2" />
              <span className="text-sm text-muted-foreground">Loading signals...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSignals.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">No signals match your filters</p>
              <p className="text-xs text-muted-foreground">Try adjusting your market, timeframe, or strategy filters.</p>
            </div>
          )}

          {/* Signal Cards */}
          {!loading && filteredSignals.length > 0 && (
            <div className="space-y-3">
              {filteredSignals.map((signal, index) => {
                const isExpanded = expandedId === signal.id;
                const isBuy = signal.direction === "BUY";
                const priceDiff = signal.currentPrice - signal.entryPrice;
                const priceDiffPct = ((priceDiff / signal.entryPrice) * 100).toFixed(2);
                const isInProfit = isBuy ? priceDiff > 0 : priceDiff < 0;
                const totalIndicators = signal.indicators.bullish.length + signal.indicators.bearish.length + signal.indicators.neutral.length;

                return (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    <div
                      className={`rounded-xl border transition-all cursor-pointer ${
                        isBuy
                          ? "border-accent/20 hover:border-accent/40 bg-accent/[0.02]"
                          : "border-destructive/20 hover:border-destructive/40 bg-destructive/[0.02]"
                      } ${isExpanded ? (isBuy ? "bg-accent/[0.04]" : "bg-destructive/[0.04]") : ""}`}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : signal.id)
                      }
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Direction Badge */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isBuy ? "bg-accent/10" : "bg-destructive/10"
                            }`}
                          >
                            {isBuy ? (
                              <TrendingUp className="h-5 w-5 text-accent" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-destructive" />
                            )}
                          </div>

                          {/* Main Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold font-mono">
                                {signal.ticker}
                              </span>
                              <Badge
                                variant={isBuy ? "success" : "destructive"}
                                className="text-[10px] font-bold"
                              >
                                {signal.direction}
                              </Badge>
                              <Badge
                                variant={getStrengthBadgeVariant(signal.strength)}
                                className="text-[10px]"
                              >
                                {signal.strength}
                              </Badge>
                              <Badge
                                variant={getMarketBadgeVariant(signal.market)}
                                className="text-[10px]"
                              >
                                {signal.market}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {signal.company} &middot; {signal.strategy}
                            </p>
                          </div>

                          {/* Confidence */}
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1.5 justify-end">
                              <div
                                className={`text-lg font-bold font-mono ${getConfidenceColor(
                                  signal.confidence
                                )}`}
                              >
                                {signal.confidence}%
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              confidence
                            </p>
                          </div>

                          {/* Current Price */}
                          <div className="text-right shrink-0 hidden sm:block">
                            <p className="text-sm font-bold font-mono">
                              ${formatPrice(signal.currentPrice)}
                            </p>
                            <p
                              className={`text-[10px] font-mono ${
                                isInProfit ? "text-accent" : "text-destructive"
                              }`}
                            >
                              {priceDiff >= 0 ? "+" : ""}
                              {priceDiffPct}%
                            </p>
                          </div>

                          {/* Time */}
                          <div className="text-right shrink-0 hidden md:block">
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(signal.timestamp)}
                            </p>
                          </div>

                          {/* Expand Arrow */}
                          <div className="shrink-0 text-muted-foreground">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0">
                              <div className="h-px bg-white/5 mb-3" />

                              {/* Price Levels */}
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div className="p-2.5 rounded-lg bg-primary-800/30 border border-white/5">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Target className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground">
                                      Entry Price
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold font-mono">
                                    ${formatPrice(signal.entryPrice)}
                                  </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Shield className="h-3 w-3 text-destructive" />
                                    <span className="text-[10px] text-destructive">
                                      Stop Loss
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold font-mono text-destructive">
                                    ${formatPrice(signal.stopLoss)}
                                  </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                                  <div className="flex items-center gap-1 mb-1">
                                    <TrendingUp className="h-3 w-3 text-accent" />
                                    <span className="text-[10px] text-accent">
                                      Take Profit
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold font-mono text-accent">
                                    ${formatPrice(signal.takeProfit)}
                                  </p>
                                </div>
                              </div>

                              {/* Indicator Breakdown */}
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs font-semibold">
                                    Indicator Breakdown ({totalIndicators} analyzed)
                                  </span>
                                  <span className="text-[10px] text-muted-foreground ml-auto">
                                    Confluence: {signal.confluenceScore}%
                                  </span>
                                </div>

                                {/* Indicator counts bar */}
                                <div className="flex h-2 rounded-full overflow-hidden mb-3 bg-primary-800/30">
                                  <div
                                    className="bg-accent/80 transition-all"
                                    style={{ width: `${(signal.indicators.bullish.length / totalIndicators) * 100}%` }}
                                  />
                                  <div
                                    className="bg-destructive/80 transition-all"
                                    style={{ width: `${(signal.indicators.bearish.length / totalIndicators) * 100}%` }}
                                  />
                                  <div
                                    className="bg-yellow-500/80 transition-all"
                                    style={{ width: `${(signal.indicators.neutral.length / totalIndicators) * 100}%` }}
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  {/* Bullish Indicators */}
                                  <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
                                    <p className="text-[10px] font-semibold text-accent mb-1">
                                      Bullish ({signal.indicators.bullish.length})
                                    </p>
                                    <div className="space-y-0.5">
                                      {signal.indicators.bullish.map((ind, i) => (
                                        <p key={i} className="text-[10px] text-muted-foreground truncate" title={ind}>
                                          {ind}
                                        </p>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Bearish Indicators */}
                                  <div className="p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                                    <p className="text-[10px] font-semibold text-destructive mb-1">
                                      Bearish ({signal.indicators.bearish.length})
                                    </p>
                                    <div className="space-y-0.5">
                                      {signal.indicators.bearish.map((ind, i) => (
                                        <p key={i} className="text-[10px] text-muted-foreground truncate" title={ind}>
                                          {ind}
                                        </p>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Neutral Indicators */}
                                  <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                                    <p className="text-[10px] font-semibold text-yellow-500 mb-1">
                                      Neutral ({signal.indicators.neutral.length})
                                    </p>
                                    <div className="space-y-0.5">
                                      {signal.indicators.neutral.map((ind, i) => (
                                        <p key={i} className="text-[10px] text-muted-foreground truncate" title={ind}>
                                          {ind}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Metadata */}
                              <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  {signal.strategy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {signal.timeframe}
                                </span>
                                <span className="flex items-center gap-1 font-mono">
                                  R:R {signal.riskReward.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1 ml-auto">
                                  <Clock className="h-3 w-3" />
                                  {formatTimeAgo(signal.timestamp)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
