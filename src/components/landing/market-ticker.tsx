"use client";

import React from "react";

const TICKER_DATA = [
  { symbol: "SPY", price: "$523.45", change: "+1.2%", positive: true },
  { symbol: "AAPL", price: "$198.32", change: "+0.8%", positive: true },
  { symbol: "TSLA", price: "$245.67", change: "-2.1%", positive: false },
  { symbol: "BTC", price: "$67,234", change: "+3.4%", positive: true },
  { symbol: "EUR/USD", price: "1.0845", change: "-0.3%", positive: false },
  { symbol: "NVDA", price: "$875.20", change: "+2.5%", positive: true },
  { symbol: "AMZN", price: "$185.90", change: "+0.4%", positive: true },
  { symbol: "GOOGL", price: "$142.15", change: "-0.7%", positive: false },
];

function TickerItem({
  symbol,
  price,
  change,
  positive,
}: {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-xs font-semibold text-foreground/80">{symbol}</span>
      <span className="text-xs font-mono text-muted-foreground">{price}</span>
      <span
        className={`text-xs font-mono font-semibold ${
          positive ? "text-accent" : "text-destructive"
        }`}
      >
        {change}
      </span>
    </span>
  );
}

export function MarketTicker() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0f] border-b border-white/5 overflow-hidden">
      <div className="ticker-scroll flex items-center h-8">
        <div className="ticker-track flex items-center">
          {/* Render the ticker set 3 times for seamless loop */}
          {[0, 1, 2].map((setIndex) =>
            TICKER_DATA.map((item, i) => (
              <TickerItem
                key={`${setIndex}-${i}`}
                symbol={item.symbol}
                price={item.price}
                change={item.change}
                positive={item.positive}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
