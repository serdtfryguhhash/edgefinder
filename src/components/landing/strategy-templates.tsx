"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

const STRATEGY_TEMPLATES = [
  {
    name: "RSI Mean Reversion",
    description: "Buy when RSI < 30, sell when RSI > 70",
    avgReturn: "18.4%",
    winRate: "62%",
    sparkline: [30, 35, 25, 40, 55, 45, 60, 50, 65, 70, 55, 75],
  },
  {
    name: "MACD Momentum",
    description: "Follow trend with MACD crossover signals",
    avgReturn: "22.1%",
    winRate: "57%",
    sparkline: [40, 45, 50, 42, 55, 65, 60, 70, 75, 68, 80, 85],
  },
  {
    name: "Golden Cross",
    description: "Buy 50-day MA crossing above 200-day MA",
    avgReturn: "15.7%",
    winRate: "54%",
    sparkline: [50, 48, 52, 55, 53, 58, 62, 60, 65, 68, 72, 70],
  },
  {
    name: "Bollinger Squeeze",
    description: "Enter when bands tighten, exit on expansion",
    avgReturn: "19.8%",
    winRate: "61%",
    sparkline: [55, 53, 54, 52, 53, 55, 70, 68, 75, 72, 78, 80],
  },
  {
    name: "Volume Breakout",
    description: "Trade breakouts confirmed by volume surge",
    avgReturn: "24.3%",
    winRate: "52%",
    sparkline: [45, 47, 44, 48, 46, 50, 65, 80, 75, 82, 78, 90],
  },
  {
    name: "Pairs Trading",
    description: "Mean reversion on correlated asset pairs",
    avgReturn: "12.9%",
    winRate: "66%",
    sparkline: [55, 50, 58, 52, 60, 55, 62, 58, 63, 60, 65, 62],
  },
];

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="opacity-40 group-hover:opacity-70 transition-opacity"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StrategyTemplates() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pre-Built{" "}
            <span className="gradient-text">Strategy Templates</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            One-click backtest proven strategies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STRATEGY_TEMPLATES.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href="/demo" className="block group">
                <div className="glass-card-hover p-6 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                        <TrendingUp className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="text-base font-semibold group-hover:text-accent transition-colors">
                        {template.name}
                      </h3>
                    </div>
                    <MiniSparkline data={template.sparkline} />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Avg Return
                        </span>
                        <p className="text-sm font-bold font-mono text-accent">
                          {template.avgReturn}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-white/5" />
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Win Rate
                        </span>
                        <p className="text-sm font-bold font-mono text-foreground">
                          {template.winRate}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Backtest Now
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
