"use client";

const STORAGE_KEY = "edgefinder_ai_memory";

export interface AIMemoryEntry {
  type: "strategy_created" | "backtest_result" | "favorite_indicator" | "market_preference" | "trading_note";
  timestamp: string;
  data: Record<string, unknown>;
}

export interface AIMemoryData {
  entries: AIMemoryEntry[];
  tradingStyle: string;
  favoriteIndicators: string[];
  preferredMarkets: string[];
  preferredTimeframes: string[];
  notes: string[];
}

function getDefault(): AIMemoryData {
  return {
    entries: [],
    tradingStyle: "",
    favoriteIndicators: [],
    preferredMarkets: [],
    preferredTimeframes: [],
    notes: [],
  };
}

function getMemory(): AIMemoryData {
  if (typeof window === "undefined") return getDefault();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefault();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefault();
  }
}

function saveMemory(data: AIMemoryData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function recordStrategyCreated(strategy: {
  name: string;
  market: string;
  timeframe: string;
  indicators: string[];
}): void {
  const memory = getMemory();
  memory.entries.push({
    type: "strategy_created",
    timestamp: new Date().toISOString(),
    data: strategy,
  });

  strategy.indicators.forEach((ind) => {
    if (!memory.favoriteIndicators.includes(ind)) {
      memory.favoriteIndicators.push(ind);
    }
  });

  if (!memory.preferredMarkets.includes(strategy.market)) {
    memory.preferredMarkets.push(strategy.market);
  }

  if (!memory.preferredTimeframes.includes(strategy.timeframe)) {
    memory.preferredTimeframes.push(strategy.timeframe);
  }

  saveMemory(memory);
}

export function recordBacktestResult(result: {
  strategyName: string;
  totalReturn: number;
  sharpeRatio: number;
  winRate: number;
  maxDrawdown: number;
}): void {
  const memory = getMemory();
  memory.entries.push({
    type: "backtest_result",
    timestamp: new Date().toISOString(),
    data: result,
  });
  saveMemory(memory);
}

export function recordFavoriteIndicator(indicator: string): void {
  const memory = getMemory();
  if (!memory.favoriteIndicators.includes(indicator)) {
    memory.favoriteIndicators.push(indicator);
  }
  saveMemory(memory);
}

export function recordMarketPreference(market: string): void {
  const memory = getMemory();
  if (!memory.preferredMarkets.includes(market)) {
    memory.preferredMarkets.push(market);
  }
  saveMemory(memory);
}

export function addTradingNote(note: string): void {
  const memory = getMemory();
  memory.notes.push(note);
  memory.entries.push({
    type: "trading_note",
    timestamp: new Date().toISOString(),
    data: { note },
  });
  saveMemory(memory);
}

export function setTradingStyle(style: string): void {
  const memory = getMemory();
  memory.tradingStyle = style;
  saveMemory(memory);
}

export function getAIMemory(): AIMemoryData {
  return getMemory();
}

export function buildContextPrompt(): string {
  const memory = getMemory();
  if (memory.entries.length === 0 && !memory.tradingStyle) return "";

  const parts: string[] = [];

  if (memory.tradingStyle) {
    parts.push(`Trading Style: ${memory.tradingStyle}`);
  }

  if (memory.preferredMarkets.length > 0) {
    parts.push(`Preferred Markets: ${memory.preferredMarkets.join(", ")}`);
  }

  if (memory.preferredTimeframes.length > 0) {
    parts.push(`Preferred Timeframes: ${memory.preferredTimeframes.join(", ")}`);
  }

  if (memory.favoriteIndicators.length > 0) {
    parts.push(`Favorite Indicators: ${memory.favoriteIndicators.join(", ")}`);
  }

  const strategies = memory.entries
    .filter((e) => e.type === "strategy_created")
    .slice(-5);
  if (strategies.length > 0) {
    parts.push(
      `Recent Strategies: ${strategies
        .map((s) => `${(s.data as { name: string }).name} (${(s.data as { market: string }).market}/${(s.data as { timeframe: string }).timeframe})`)
        .join("; ")}`
    );
  }

  const backtests = memory.entries
    .filter((e) => e.type === "backtest_result")
    .slice(-5);
  if (backtests.length > 0) {
    parts.push(
      `Recent Backtest Results: ${backtests
        .map(
          (b) =>
            `${(b.data as { strategyName: string }).strategyName}: ${(b.data as { totalReturn: number }).totalReturn.toFixed(1)}% return, ${(b.data as { sharpeRatio: number }).sharpeRatio.toFixed(2)} Sharpe, ${(b.data as { winRate: number }).winRate.toFixed(1)}% win rate`
        )
        .join("; ")}`
    );
  }

  if (memory.notes.length > 0) {
    parts.push(`Trader Notes: ${memory.notes.slice(-3).join("; ")}`);
  }

  return parts.join("\n");
}

export function clearMemory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
