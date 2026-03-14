"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewMiniChartProps {
  symbol?: string;
  width?: string | number;
  height?: number;
}

function TradingViewMiniChartComponent({ symbol = "AAPL", width = "100%", height = 220 }: TradingViewMiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: typeof width === "number" ? width : "100%",
      height,
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, width, height]);

  return (
    <div className="tradingview-widget-container rounded-lg overflow-hidden" style={{ height, width }}>
      <div ref={containerRef} />
    </div>
  );
}

export const TradingViewMiniChart = memo(TradingViewMiniChartComponent);
