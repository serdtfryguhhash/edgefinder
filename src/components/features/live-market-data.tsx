"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Globe,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketDataPoint {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  high: number;
  low: number;
  market: "US Equities" | "Crypto" | "Forex" | "Indices" | "Metals";
}

const INITIAL_MARKET_DATA: MarketDataPoint[] = [
  { symbol: "AAPL", name: "Apple", price: 199.12, change: 1.85, changePct: 0.94, volume: "52.3M", high: 200.40, low: 197.80, market: "US Equities" },
  { symbol: "NVDA", name: "NVIDIA", price: 878.20, change: 15.40, changePct: 1.78, volume: "38.1M", high: 885.00, low: 862.50, market: "US Equities" },
  { symbol: "TSLA", name: "Tesla", price: 247.85, change: -5.30, changePct: -2.09, volume: "89.7M", high: 254.10, low: 245.60, market: "US Equities" },
  { symbol: "MSFT", name: "Microsoft", price: 416.05, change: 3.20, changePct: 0.77, volume: "22.8M", high: 418.90, low: 413.10, market: "US Equities" },
  { symbol: "AMZN", name: "Amazon", price: 186.45, change: -0.95, changePct: -0.51, volume: "41.2M", high: 188.20, low: 185.30, market: "US Equities" },
  { symbol: "META", name: "Meta", price: 514.35, change: 8.70, changePct: 1.72, volume: "18.5M", high: 518.00, low: 505.60, market: "US Equities" },
  { symbol: "BTC/USD", name: "Bitcoin", price: 67234.50, change: 1842.30, changePct: 2.82, volume: "28.4B", high: 68100.00, low: 65320.00, market: "Crypto" },
  { symbol: "ETH/USD", name: "Ethereum", price: 3456.80, change: -45.20, changePct: -1.29, volume: "14.2B", high: 3520.00, low: 3410.50, market: "Crypto" },
  { symbol: "EUR/USD", name: "Euro", price: 1.0845, change: -0.0032, changePct: -0.29, volume: "1.8T", high: 1.0882, low: 1.0818, market: "Forex" },
  { symbol: "SPX", name: "S&P 500", price: 5234.18, change: 28.45, changePct: 0.55, volume: "3.2B", high: 5248.00, low: 5205.70, market: "Indices" },
  { symbol: "XAUUSD", name: "Gold", price: 2340.50, change: 12.30, changePct: 0.53, volume: "185K", high: 2355.00, low: 2328.00, market: "Metals" },
  { symbol: "XAGUSD", name: "Silver", price: 27.45, change: -0.32, changePct: -1.15, volume: "42K", high: 27.80, low: 27.10, market: "Metals" },
  { symbol: "XPTUSD", name: "Platinum", price: 982.00, change: 5.50, changePct: 0.56, volume: "12K", high: 988.00, low: 975.00, market: "Metals" },
];

function MiniVolumeBar({ value, max }: { value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="w-16 h-3 rounded-full bg-primary-800/50 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-secondary/40"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export function LiveMarketData() {
  const [data, setData] = useState<MarketDataPoint[]>(INITIAL_MARKET_DATA);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [activeMarket, setActiveMarket] = useState<string>("all");
  const [flashSymbols, setFlashSymbols] = useState<Set<string>>(new Set());

  // Simulate live price updates
  const updatePrices = useCallback(() => {
    setData((prev) => {
      const newFlash = new Set<string>();
      const updated = prev.map((item) => {
        const volatility = item.market === "Crypto" ? 0.003 : item.market === "Forex" ? 0.0005 : 0.001;
        const priceChange = item.price * (Math.random() - 0.48) * volatility;
        const newPrice = +(item.price + priceChange).toFixed(
          item.market === "Forex" ? 4 : 2
        );
        const newChange = +(newPrice - (item.price - item.change)).toFixed(
          item.market === "Forex" ? 4 : 2
        );
        const newChangePct = +(
          (newChange / (newPrice - newChange)) *
          100
        ).toFixed(2);

        if (Math.abs(priceChange) > 0) {
          newFlash.add(item.symbol);
        }

        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePct: newChangePct,
          high: Math.max(item.high, newPrice),
          low: Math.min(item.low, newPrice),
        };
      });

      setFlashSymbols(newFlash);
      setTimeout(() => setFlashSymbols(new Set()), 400);

      return updated;
    });
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString());
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  const filteredData =
    activeMarket === "all"
      ? data
      : data.filter((d) => d.market === activeMarket);

  const markets = ["all", "US Equities", "Crypto", "Forex", "Indices", "Metals"];

  // Market summary
  const gainers = data.filter((d) => d.changePct > 0).length;
  const losers = data.filter((d) => d.changePct < 0).length;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-secondary-400" />
              Live Market Data
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              Real-time price updates across markets
              {lastUpdate && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {lastUpdate}
                </span>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="flex items-center gap-1 text-accent">
                <TrendingUp className="h-3 w-3" />
                {gainers}
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="flex items-center gap-1 text-destructive">
                <TrendingDown className="h-3 w-3" />
                {losers}
              </span>
            </div>
          </div>
        </div>

        {/* Market Tabs */}
        <div className="flex items-center gap-2 mt-3">
          {markets.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMarket(m)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeMarket === m
                  ? "bg-secondary/20 text-secondary-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {m === "all" ? "All Markets" : m}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider px-3 py-2 border-b border-white/5">
          <div className="col-span-3">Symbol</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Change</div>
          <div className="col-span-2 text-right">High / Low</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-1"></div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-white/[0.03]">
          {filteredData.map((item, index) => {
            const isPositive = item.changePct >= 0;
            const isFlashing = flashSymbols.has(item.symbol);

            return (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg transition-colors hover:bg-white/[0.02] ${
                  isFlashing
                    ? isPositive
                      ? "bg-accent/[0.03]"
                      : "bg-destructive/[0.03]"
                    : ""
                }`}
              >
                {/* Symbol */}
                <div className="col-span-3 flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isPositive ? "bg-accent/10" : "bg-destructive/10"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold font-mono">{item.symbol}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.name}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right">
                  <p
                    className={`text-sm font-bold font-mono transition-colors ${
                      isFlashing
                        ? isPositive
                          ? "text-accent"
                          : "text-destructive"
                        : ""
                    }`}
                  >
                    {item.market === "Forex"
                      ? item.price.toFixed(4)
                      : item.price >= 1000
                      ? `$${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `$${item.price.toFixed(2)}`}
                  </p>
                </div>

                {/* Change */}
                <div className="col-span-2 text-right">
                  <p
                    className={`text-xs font-mono font-semibold ${
                      isPositive ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {item.changePct.toFixed(2)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {isPositive ? "+" : ""}
                    {item.market === "Forex"
                      ? item.change.toFixed(4)
                      : item.change.toFixed(2)}
                  </p>
                </div>

                {/* High / Low */}
                <div className="col-span-2 text-right hidden sm:block">
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {item.market === "Forex"
                      ? item.high.toFixed(4)
                      : item.high >= 1000
                      ? item.high.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.high.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {item.market === "Forex"
                      ? item.low.toFixed(4)
                      : item.low >= 1000
                      ? item.low.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.low.toFixed(2)}
                  </p>
                </div>

                {/* Volume */}
                <div className="col-span-2 text-right">
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {item.volume}
                  </p>
                </div>

                {/* Market Badge */}
                <div className="col-span-1 flex justify-end">
                  <Badge variant="outline" className="text-[8px] px-1.5 hidden lg:inline-flex">
                    {item.market === "US Equities"
                      ? "EQ"
                      : item.market === "Crypto"
                      ? "CR"
                      : item.market === "Forex"
                      ? "FX"
                      : item.market === "Metals"
                      ? "MT"
                      : "IX"}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Market Status Bar */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            Markets Open
          </div>
          <div className="flex items-center gap-3">
            <span>NYSE: Open</span>
            <span>NASDAQ: Open</span>
            <span>Crypto: 24/7</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Demo data - updates every 3s
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
