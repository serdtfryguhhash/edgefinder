"use client";

import React, { useState, useEffect, useCallback } from "react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
}

const INITIAL_TICKER_DATA: TickerItem[] = [
  { symbol: "SPY", price: 523.45, change: 6.28, changePct: 1.21 },
  { symbol: "AAPL", price: 178.50, change: 1.43, changePct: 0.81 },
  { symbol: "TSLA", price: 245.30, change: -5.15, changePct: -2.06 },
  { symbol: "NVDA", price: 892.40, change: 22.31, changePct: 2.56 },
  { symbol: "MSFT", price: 415.20, change: 3.20, changePct: 0.78 },
  { symbol: "AMZN", price: 185.60, change: -0.93, changePct: -0.50 },
  { symbol: "META", price: 502.30, change: 8.54, changePct: 1.73 },
  { symbol: "GOOGL", price: 142.15, change: -0.99, changePct: -0.69 },
  { symbol: "BTC/USD", price: 67234.00, change: 1842.30, changePct: 2.82 },
  { symbol: "ETH/USD", price: 3456.80, change: -45.20, changePct: -1.29 },
  { symbol: "EUR/USD", price: 1.0845, change: -0.0032, changePct: -0.29 },
  { symbol: "QQQ", price: 448.92, change: 5.38, changePct: 1.21 },
];

function formatPrice(symbol: string, price: number): string {
  if (symbol === "EUR/USD") return price.toFixed(4);
  if (symbol.includes("/USD") && price > 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toFixed(2);
}

function TickerEntry({ item }: { item: TickerItem }) {
  const isPositive = item.changePct >= 0;
  const priceStr = formatPrice(item.symbol, item.price);
  const prefix = item.symbol.includes("/") ? "" : "$";

  return (
    <span className="inline-flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-xs font-semibold text-foreground/80">
        {item.symbol}
      </span>
      <span className="text-xs font-mono text-muted-foreground">
        {prefix}{priceStr}
      </span>
      <span
        className={`text-xs font-mono font-semibold ${
          isPositive ? "text-accent" : "text-destructive"
        }`}
      >
        {isPositive ? "+" : ""}
        {item.changePct.toFixed(2)}%
      </span>
    </span>
  );
}

export function DashboardMarketTicker() {
  const [data, setData] = useState<TickerItem[]>(INITIAL_TICKER_DATA);

  const updatePrices = useCallback(() => {
    setData((prev) =>
      prev.map((item) => {
        const isCrypto = item.symbol.includes("BTC") || item.symbol.includes("ETH");
        const isForex = item.symbol === "EUR/USD";
        const volatility = isCrypto ? 0.002 : isForex ? 0.0003 : 0.0008;
        const priceChange = item.price * (Math.random() - 0.48) * volatility;
        const decimals = isForex ? 4 : 2;
        const newPrice = +(item.price + priceChange).toFixed(decimals);
        const basePrice = item.price - item.change;
        const newChange = +(newPrice - basePrice).toFixed(decimals);
        const newChangePct = +((newChange / basePrice) * 100).toFixed(2);

        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePct: newChangePct,
        };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updatePrices, 5000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  return (
    <div className="w-full rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm overflow-hidden mb-6">
      <div className="ticker-scroll flex items-center h-9">
        <div className="ticker-track flex items-center">
          {[0, 1, 2].map((setIndex) =>
            data.map((item, i) => (
              <TickerEntry key={`${setIndex}-${i}`} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
