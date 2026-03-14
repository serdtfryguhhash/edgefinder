"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewMarketOverviewProps {
  height?: number;
}

function TradingViewMarketOverviewComponent({ height = 660 }: TradingViewMarketOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height,
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      plotLineColorGrowing: "rgba(34, 197, 94, 1)",
      plotLineColorFalling: "rgba(239, 68, 68, 1)",
      gridLineColor: "rgba(255, 255, 255, 0.06)",
      scaleFontColor: "rgba(255, 255, 255, 0.6)",
      belowLineFillColorGrowing: "rgba(34, 197, 94, 0.12)",
      belowLineFillColorFalling: "rgba(239, 68, 68, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(34, 197, 94, 0)",
      belowLineFillColorFallingBottom: "rgba(239, 68, 68, 0)",
      symbolActiveColor: "rgba(34, 197, 94, 0.12)",
      tabs: [
        {
          title: "Stocks",
          symbols: [
            { s: "NASDAQ:AAPL", d: "Apple" },
            { s: "NASDAQ:NVDA", d: "NVIDIA" },
            { s: "NASDAQ:MSFT", d: "Microsoft" },
            { s: "NASDAQ:GOOGL", d: "Alphabet" },
            { s: "NASDAQ:AMZN", d: "Amazon" },
            { s: "NASDAQ:TSLA", d: "Tesla" },
            { s: "NYSE:JPM", d: "JPMorgan" },
            { s: "NYSE:V", d: "Visa" },
          ],
          originalTitle: "Stocks",
        },
        {
          title: "Forex",
          symbols: [
            { s: "FX_IDC:EURUSD", d: "EUR/USD" },
            { s: "FX_IDC:GBPUSD", d: "GBP/USD" },
            { s: "FX_IDC:USDJPY", d: "USD/JPY" },
            { s: "FX_IDC:AUDUSD", d: "AUD/USD" },
            { s: "FX_IDC:USDCAD", d: "USD/CAD" },
            { s: "FX_IDC:USDCHF", d: "USD/CHF" },
          ],
          originalTitle: "Forex",
        },
        {
          title: "Crypto",
          symbols: [
            { s: "BITSTAMP:BTCUSD", d: "Bitcoin" },
            { s: "BITSTAMP:ETHUSD", d: "Ethereum" },
            { s: "BITSTAMP:SOLUSD", d: "Solana" },
            { s: "BINANCE:ADAUSDT", d: "Cardano" },
            { s: "BINANCE:DOGEUSDT", d: "Dogecoin" },
            { s: "BINANCE:DOTUSDT", d: "Polkadot" },
          ],
          originalTitle: "Crypto",
        },
        {
          title: "Metals",
          symbols: [
            { s: "FOREXCOM:XAUUSD", d: "Gold" },
            { s: "FOREXCOM:XAGUSD", d: "Silver" },
            { s: "TVC:PLATINUM", d: "Platinum" },
            { s: "COMEX:HG1!", d: "Copper" },
            { s: "TVC:PALLADIUM", d: "Palladium" },
          ],
          originalTitle: "Metals",
        },
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "US 100" },
            { s: "FOREXCOM:DJI", d: "Dow 30" },
            { s: "TVC:VIX", d: "VIX" },
            { s: "TVC:DXY", d: "US Dollar Index" },
          ],
          originalTitle: "Indices",
        },
      ],
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [height]);

  return (
    <div className="tradingview-widget-container rounded-lg overflow-hidden border border-white/5" style={{ height }}>
      <div ref={containerRef} />
    </div>
  );
}

export const TradingViewMarketOverview = memo(TradingViewMarketOverviewComponent);
