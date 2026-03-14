"use client";

import React from "react";
import { TradingViewTicker } from "@/components/charts/tradingview-ticker";

export function MarketTicker() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0f] border-b border-white/5 overflow-hidden">
      <TradingViewTicker />
    </div>
  );
}
