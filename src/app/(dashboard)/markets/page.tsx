"use client";

import React, { useState } from "react";
import { TradingViewMarketOverview } from "@/components/charts/tradingview-market-overview";
import { TradingViewMiniChart } from "@/components/charts/tradingview-mini-chart";
import { TradingViewChart } from "@/components/charts/tradingview-chart";
import { Globe, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const POPULAR_INSTRUMENTS = [
  { symbol: "NASDAQ:AAPL", name: "Apple", market: "Stocks" },
  { symbol: "NASDAQ:NVDA", name: "NVIDIA", market: "Stocks" },
  { symbol: "FOREXCOM:XAUUSD", name: "Gold", market: "Metals" },
  { symbol: "FOREXCOM:XAGUSD", name: "Silver", market: "Metals" },
  { symbol: "BITSTAMP:BTCUSD", name: "Bitcoin", market: "Crypto" },
  { symbol: "FX_IDC:EURUSD", name: "EUR/USD", market: "Forex" },
  { symbol: "NASDAQ:TSLA", name: "Tesla", market: "Stocks" },
  { symbol: "BITSTAMP:ETHUSD", name: "Ethereum", market: "Crypto" },
];

export default function MarketsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-accent" />
            Markets
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time market data powered by TradingView
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse inline-block" />
          Live Data
        </Badge>
      </div>

      {/* Full Chart */}
      <div className="rounded-xl border border-white/5 bg-primary-900/50 p-1">
        <TradingViewChart symbol={selectedSymbol} height={500} interval="D" />
      </div>

      {/* Market Overview */}
      <div className="rounded-xl border border-white/5 bg-primary-900/50 p-1">
        <TradingViewMarketOverview height={660} />
      </div>

      {/* Popular Instruments Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Popular Instruments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_INSTRUMENTS.map((instrument) => (
            <button
              key={instrument.symbol}
              onClick={() => setSelectedSymbol(instrument.symbol)}
              className={`rounded-xl border p-1 transition-all hover:border-accent/30 ${
                selectedSymbol === instrument.symbol
                  ? "border-accent/50 bg-accent/5"
                  : "border-white/5 bg-primary-900/50"
              }`}
            >
              <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{instrument.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {instrument.market}
                </Badge>
              </div>
              <TradingViewMiniChart symbol={instrument.symbol} height={180} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
