"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  ArrowRight,
  Activity,
  Shield,
  Target,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Demo signals data (pre-computed to avoid API call on landing page)
const DEMO_SIGNALS = [
  {
    id: "demo_1",
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    direction: "BUY" as const,
    confidence: 94,
    entryPrice: 892.40,
    currentPrice: 898.15,
    stopLoss: 875.00,
    takeProfit: 935.00,
    timeframe: "1D",
    indicators: { bullish: 78, bearish: 12, neutral: 15 },
    strategy: "Multi-Indicator Confluence",
    strength: "Strong" as const,
    riskReward: 2.45,
  },
  {
    id: "demo_2",
    ticker: "EUR/USD",
    company: "Euro / US Dollar",
    direction: "SELL" as const,
    confidence: 82,
    entryPrice: 1.0865,
    currentPrice: 1.0842,
    stopLoss: 1.0920,
    takeProfit: 1.0750,
    timeframe: "4H",
    indicators: { bullish: 15, bearish: 68, neutral: 22 },
    strategy: "Trend Following",
    strength: "Moderate" as const,
    riskReward: 2.09,
  },
  {
    id: "demo_3",
    ticker: "BTC/USD",
    company: "Bitcoin / US Dollar",
    direction: "BUY" as const,
    confidence: 88,
    entryPrice: 67250.00,
    currentPrice: 67845.00,
    stopLoss: 65500.00,
    takeProfit: 72000.00,
    timeframe: "1D",
    indicators: { bullish: 72, bearish: 18, neutral: 15 },
    strategy: "Breakout Detection",
    strength: "Strong" as const,
    riskReward: 2.71,
  },
  {
    id: "demo_4",
    ticker: "AAPL",
    company: "Apple Inc.",
    direction: "BUY" as const,
    confidence: 79,
    entryPrice: 178.50,
    currentPrice: 179.85,
    stopLoss: 174.20,
    takeProfit: 186.80,
    timeframe: "1D",
    indicators: { bullish: 65, bearish: 20, neutral: 20 },
    strategy: "Momentum Scanner",
    strength: "Moderate" as const,
    riskReward: 1.93,
  },
];

// Mini equity curve data
const equityCurve = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 10000 + Math.sin(i * 0.3) * 500 + i * 180 + Math.random() * 200,
}));

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export function LiveDemo() {
  const [activeSignal, setActiveSignal] = useState(0);
  const [prices, setPrices] = useState(DEMO_SIGNALS.map(s => s.currentPrice));

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map((p, i) => {
        const volatility = DEMO_SIGNALS[i].ticker.includes('/') ? 0.0002 : 0.001;
        return +(p * (1 + (Math.random() - 0.48) * volatility)).toFixed(
          DEMO_SIGNALS[i].entryPrice < 10 ? 4 : 2
        );
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="live-demo" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Live Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See EdgeFinder <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time trade signals powered by 100+ technical indicators. Watch our AI engine
            analyze markets and generate actionable trading opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Signal List - Left side */}
          <div className="lg:col-span-3 space-y-3">
            {DEMO_SIGNALS.map((signal, index) => {
              const isBuy = signal.direction === "BUY";
              const currentPrice = prices[index];
              const priceDiff = currentPrice - signal.entryPrice;
              const priceDiffPct = ((priceDiff / signal.entryPrice) * 100).toFixed(2);
              const isInProfit = isBuy ? priceDiff > 0 : priceDiff < 0;

              return (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveSignal(index)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    activeSignal === index
                      ? isBuy
                        ? "border-accent/40 bg-accent/[0.04]"
                        : "border-destructive/40 bg-destructive/[0.04]"
                      : "border-white/5 bg-primary-900/30 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isBuy ? "bg-accent/10" : "bg-destructive/10"
                    }`}>
                      {isBuy ? <TrendingUp className="h-5 w-5 text-accent" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono">{signal.ticker}</span>
                        <Badge variant={isBuy ? "success" : "destructive"} className="text-[10px] font-bold">
                          {signal.direction}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{signal.timeframe}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{signal.company}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold font-mono text-accent">{signal.confidence}%</div>
                      <p className="text-[10px] text-muted-foreground">confidence</p>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-bold font-mono">${formatPrice(currentPrice)}</p>
                      <p className={`text-[10px] font-mono ${isInProfit ? "text-accent" : "text-destructive"}`}>
                        {priceDiff >= 0 ? "+" : ""}{priceDiffPct}%
                      </p>
                    </div>
                  </div>

                  {/* Indicator Breakdown */}
                  {activeSignal === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-3 pt-3 border-t border-white/5"
                    >
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 text-center">
                          <p className="text-lg font-bold text-accent">{signal.indicators.bullish}</p>
                          <p className="text-[10px] text-muted-foreground">Bullish</p>
                        </div>
                        <div className="p-2 rounded-lg bg-destructive/5 border border-destructive/10 text-center">
                          <p className="text-lg font-bold text-destructive">{signal.indicators.bearish}</p>
                          <p className="text-[10px] text-muted-foreground">Bearish</p>
                        </div>
                        <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-center">
                          <p className="text-lg font-bold text-yellow-500">{signal.indicators.neutral}</p>
                          <p className="text-[10px] text-muted-foreground">Neutral</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Entry: ${formatPrice(signal.entryPrice)}</span>
                        <span className="flex items-center gap-1 text-destructive"><Shield className="h-3 w-3" /> SL: ${formatPrice(signal.stopLoss)}</span>
                        <span className="flex items-center gap-1 text-accent"><TrendingUp className="h-3 w-3" /> TP: ${formatPrice(signal.takeProfit)}</span>
                        <span className="font-mono">R:R {signal.riskReward.toFixed(1)}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
              DEMO DATA - Signals refresh every 30 seconds in full version
            </Badge>
          </div>

          {/* Right side - Stats & CTA */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats Card */}
            <Card className="border-white/5 bg-primary-900/50">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  Signal Performance (30 Days)
                </h3>
                
                {/* Mini Equity Curve */}
                <div className="h-32 flex items-end gap-0.5 mb-4 rounded-lg bg-primary-800/30 p-3">
                  {equityCurve.map((point, i) => {
                    const normalized = ((point.value - 9500) / 7000) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent/80 transition-all"
                        style={{ height: `${Math.max(5, Math.min(normalized, 100))}%` }}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-xl font-bold text-accent">73.2%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                    <p className="text-xs text-muted-foreground">Avg R:R</p>
                    <p className="text-xl font-bold text-secondary-400">2.1x</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                    <p className="text-xs text-muted-foreground">Signals/Day</p>
                    <p className="text-xl font-bold text-foreground">12.4</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                    <p className="text-xs text-muted-foreground">Indicators</p>
                    <p className="text-xl font-bold text-yellow-500">105+</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-secondary/5">
              <CardContent className="p-5 text-center">
                <Zap className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Try the Full Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get unlimited signals across stocks, forex, and crypto with our full indicator suite.
                </p>
                <Link href="/signup">
                  <Button variant="glow" className="w-full group">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-[10px] text-muted-foreground mt-2">No credit card required</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
