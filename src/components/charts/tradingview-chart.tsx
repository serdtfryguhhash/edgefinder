"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: "dark" | "light";
  height?: number;
  autosize?: boolean;
  studies?: string[];
}

function TradingViewChartComponent({
  symbol = "AAPL",
  interval = "D",
  theme = "dark",
  height = 500,
  autosize = true,
  studies = [],
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Clear previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      height,
      studies: studies.length > 0 ? studies : undefined,
      hide_side_toolbar: false,
      details: true,
      hotlist: true,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval, theme, height, autosize, studies]);

  return (
    <div className="tradingview-widget-container rounded-lg overflow-hidden border border-white/5" style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);
