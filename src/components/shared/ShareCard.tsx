"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Activity, TrendingUp, Shield, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/utils";

interface ShareCardProps {
  strategyName: string;
  returnPct: number;
  sharpeRatio: number;
  winRate: number;
  maxDrawdown: number;
  timePeriod: string;
  authorName?: string;
}

export function ShareCard({
  strategyName,
  returnPct,
  sharpeRatio,
  winRate,
  maxDrawdown,
  timePeriod,
  authorName = "EdgeFinder Trader",
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async () => {
    const text = `${strategyName} | ${formatPercent(returnPct)} return | ${sharpeRatio.toFixed(2)} Sharpe | ${winRate.toFixed(1)}% win rate | ${formatPercent(maxDrawdown)} max DD | ${timePeriod} | Built with EdgeFinder`;
    await navigator.clipboard.writeText(text);
  }, [strategyName, returnPct, sharpeRatio, winRate, maxDrawdown, timePeriod]);

  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="340" rx="16" fill="url(#bg)"/>
  <rect x="0" y="0" width="600" height="4" rx="2" fill="url(#accent)"/>
  <text x="32" y="48" font-family="Inter, sans-serif" font-size="14" fill="#22C55E" font-weight="600">EdgeFinder</text>
  <text x="32" y="88" font-family="Inter, sans-serif" font-size="22" fill="#F8FAFC" font-weight="700">${strategyName}</text>
  <text x="32" y="110" font-family="Inter, sans-serif" font-size="12" fill="#94a3b8">by ${authorName} · ${timePeriod}</text>
  <rect x="32" y="130" width="536" height="1" fill="#1e293b"/>
  <text x="32" y="175" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">RETURN</text>
  <text x="32" y="200" font-family="JetBrains Mono, monospace" font-size="26" fill="${returnPct >= 0 ? '#22C55E' : '#ef4444'}" font-weight="700">${formatPercent(returnPct)}</text>
  <text x="185" y="175" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">SHARPE</text>
  <text x="185" y="200" font-family="JetBrains Mono, monospace" font-size="26" fill="#60a5fa" font-weight="700">${sharpeRatio.toFixed(2)}</text>
  <text x="320" y="175" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">WIN RATE</text>
  <text x="320" y="200" font-family="JetBrains Mono, monospace" font-size="26" fill="#F8FAFC" font-weight="700">${winRate.toFixed(1)}%</text>
  <text x="460" y="175" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">MAX DD</text>
  <text x="460" y="200" font-family="JetBrains Mono, monospace" font-size="26" fill="#f59e0b" font-weight="700">${formatPercent(maxDrawdown)}</text>
  <rect x="32" y="230" width="536" height="1" fill="#1e293b"/>
  <text x="32" y="270" font-family="Inter, sans-serif" font-size="11" fill="#64748b">Backtested on EdgeFinder - edgefinder.io</text>
  <text x="32" y="310" font-family="Inter, sans-serif" font-size="9" fill="#475569">For educational purposes only. Past performance does not guarantee future results.</text>
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${strategyName.replace(/\s+/g, "-").toLowerCase()}-performance.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }, [strategyName, returnPct, sharpeRatio, winRate, maxDrawdown, timePeriod, authorName]);

  return (
    <div className="space-y-4">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-hero-gradient p-6"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent-gradient" />

        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-accent">EdgeFinder</span>
        </div>

        <h3 className="text-xl font-bold mb-1">{strategyName}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          by {authorName} &middot; {timePeriod}
        </p>

        <div className="h-px bg-white/5 mb-4" />

        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Return</span>
            </div>
            <p className={`text-xl font-bold font-mono ${returnPct >= 0 ? "text-accent" : "text-destructive"}`}>
              {formatPercent(returnPct)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Zap className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sharpe</span>
            </div>
            <p className="text-xl font-bold font-mono text-secondary-400">{sharpeRatio.toFixed(2)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Win Rate</span>
            </div>
            <p className="text-xl font-bold font-mono">{winRate.toFixed(1)}%</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Max DD</span>
            </div>
            <p className="text-xl font-bold font-mono text-yellow-500">{formatPercent(maxDrawdown)}</p>
          </div>
        </div>

        <div className="h-px bg-white/5 mt-4 mb-3" />

        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            Backtested on EdgeFinder - edgefinder.io
          </p>
          <p className="text-[9px] text-primary-600">
            For educational purposes only.
          </p>
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Text
        </Button>
        <Button variant="default" size="sm" className="flex-1" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Card
        </Button>
      </div>
    </div>
  );
}
