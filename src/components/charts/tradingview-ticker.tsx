"use client";

import React, { useState, useEffect, useCallback, memo } from "react";

interface TickerItem {
  symbol: string;
  title: string;
  price: number;
  changePct: number;
  decimals: number;
}

const TICKER_DATA: TickerItem[] = [
  { symbol: "SPX", title: "S&P 500", price: 5234.18, changePct: 0.55, decimals: 2 },
  { symbol: "NDX", title: "US 100", price: 18432.75, changePct: 1.12, decimals: 2 },
  { symbol: "EUR/USD", title: "EUR/USD", price: 1.0845, changePct: -0.29, decimals: 4 },
  { symbol: "BTC/USD", title: "Bitcoin", price: 67234.50, changePct: 2.82, decimals: 2 },
  { symbol: "ETH/USD", title: "Ethereum", price: 3456.80, changePct: -1.29, decimals: 2 },
  { symbol: "XAU/USD", title: "Gold", price: 2340.50, changePct: 0.53, decimals: 2 },
  { symbol: "XAG/USD", title: "Silver", price: 27.45, changePct: -1.15, decimals: 2 },
  { symbol: "PLAT", title: "Platinum", price: 982.00, changePct: 0.56, decimals: 2 },
  { symbol: "AAPL", title: "Apple", price: 199.12, changePct: 0.94, decimals: 2 },
  { symbol: "NVDA", title: "NVIDIA", price: 878.20, changePct: 1.78, decimals: 2 },
  { symbol: "TSLA", title: "Tesla", price: 247.85, changePct: -2.09, decimals: 2 },
  { symbol: "GBP/USD", title: "GBP/USD", price: 1.2648, changePct: 0.18, decimals: 4 },
  { symbol: "USD/JPY", title: "USD/JPY", price: 151.42, changePct: -0.34, decimals: 2 },
  { symbol: "SOL/USD", title: "Solana", price: 142.85, changePct: 3.47, decimals: 2 },
];

function formatPrice(price: number, decimals: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return price.toFixed(decimals);
}

function TickerEntry({ item }: { item: TickerItem }) {
  const isPositive = item.changePct >= 0;

  return (
    <span className="inline-flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-xs font-semibold text-foreground/80">
        {item.title}
      </span>
      <span className="text-xs font-mono text-muted-foreground">
        {formatPrice(item.price, item.decimals)}
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

function TradingViewTickerComponent() {
  const [data, setData] = useState<TickerItem[]>(TICKER_DATA);

  const updatePrices = useCallback(() => {
    setData((prev) =>
      prev.map((item) => {
        const isCrypto = item.title === "Bitcoin" || item.title === "Ethereum" || item.title === "Solana";
        const isForex = item.decimals === 4;
        const volatility = isCrypto ? 0.002 : isForex ? 0.0003 : 0.0008;
        const priceChange = item.price * (Math.random() - 0.48) * volatility;
        const newPrice = +(item.price + priceChange).toFixed(item.decimals);
        const basePrice = item.price / (1 + item.changePct / 100);
        const newChangePct = +(((newPrice - basePrice) / basePrice) * 100).toFixed(2);

        return {
          ...item,
          price: newPrice,
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
    <div className="w-full overflow-hidden">
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

export const TradingViewTicker = memo(TradingViewTickerComponent);
