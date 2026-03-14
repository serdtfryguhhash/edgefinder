// ============================================================================
// EdgeFinder Signal Engine
// Generates realistic OHLCV data and produces trade signals via confluence
// ============================================================================

import { OHLCV, IndicatorResult, computeAllIndicators, ATR } from './indicators';

export interface TradeSignal {
  id: string;
  ticker: string;
  company: string;
  market: 'stocks' | 'forex' | 'crypto' | 'metals';
  direction: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  currentPrice: number;
  timeframe: '1H' | '4H' | '1D' | '1W';
  strategy: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
  timestamp: string;
  riskReward: number;
  indicators: {
    bullish: string[];
    bearish: string[];
    neutral: string[];
  };
  indicatorCount: number;
  confluenceScore: number;
}

export type Strategy = 'momentum' | 'meanReversion' | 'trendFollowing' | 'breakout' | 'multiConfluence';

// ============================================================================
// SEEDED PRNG (Mulberry32)
// ============================================================================

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededGaussian(rng: () => number): number {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// ============================================================================
// TICKER POOLS
// ============================================================================

interface TickerInfo {
  ticker: string;
  company: string;
  basePrice: number;
  volatility: number;
}

const STOCK_TICKERS: TickerInfo[] = [
  { ticker: 'AAPL', company: 'Apple Inc.', basePrice: 178, volatility: 0.018 },
  { ticker: 'MSFT', company: 'Microsoft Corporation', basePrice: 415, volatility: 0.016 },
  { ticker: 'NVDA', company: 'NVIDIA Corporation', basePrice: 875, volatility: 0.028 },
  { ticker: 'GOOGL', company: 'Alphabet Inc.', basePrice: 155, volatility: 0.017 },
  { ticker: 'AMZN', company: 'Amazon.com Inc.', basePrice: 185, volatility: 0.019 },
  { ticker: 'META', company: 'Meta Platforms Inc.', basePrice: 510, volatility: 0.022 },
  { ticker: 'TSLA', company: 'Tesla Inc.', basePrice: 245, volatility: 0.032 },
  { ticker: 'JPM', company: 'JPMorgan Chase & Co.', basePrice: 195, volatility: 0.014 },
  { ticker: 'V', company: 'Visa Inc.', basePrice: 280, volatility: 0.012 },
  { ticker: 'MA', company: 'Mastercard Inc.', basePrice: 470, volatility: 0.013 },
  { ticker: 'UNH', company: 'UnitedHealth Group', basePrice: 525, volatility: 0.015 },
  { ticker: 'XOM', company: 'Exxon Mobil Corporation', basePrice: 105, volatility: 0.016 },
  { ticker: 'HD', company: 'The Home Depot Inc.', basePrice: 370, volatility: 0.015 },
  { ticker: 'PG', company: 'Procter & Gamble Co.', basePrice: 165, volatility: 0.010 },
  { ticker: 'JNJ', company: 'Johnson & Johnson', basePrice: 160, volatility: 0.011 },
  { ticker: 'AVGO', company: 'Broadcom Inc.', basePrice: 1350, volatility: 0.024 },
  { ticker: 'COST', company: 'Costco Wholesale Corp.', basePrice: 735, volatility: 0.013 },
  { ticker: 'NFLX', company: 'Netflix Inc.', basePrice: 620, volatility: 0.023 },
  { ticker: 'AMD', company: 'Advanced Micro Devices', basePrice: 175, volatility: 0.028 },
  { ticker: 'CRM', company: 'Salesforce Inc.', basePrice: 295, volatility: 0.020 },
];

const FOREX_TICKERS: TickerInfo[] = [
  { ticker: 'EUR/USD', company: 'Euro / US Dollar', basePrice: 1.0850, volatility: 0.004 },
  { ticker: 'GBP/USD', company: 'British Pound / US Dollar', basePrice: 1.2650, volatility: 0.005 },
  { ticker: 'USD/JPY', company: 'US Dollar / Japanese Yen', basePrice: 150.50, volatility: 0.005 },
  { ticker: 'AUD/USD', company: 'Australian Dollar / US Dollar', basePrice: 0.6550, volatility: 0.005 },
  { ticker: 'USD/CAD', company: 'US Dollar / Canadian Dollar', basePrice: 1.3600, volatility: 0.004 },
  { ticker: 'NZD/USD', company: 'New Zealand Dollar / US Dollar', basePrice: 0.6100, volatility: 0.005 },
  { ticker: 'EUR/GBP', company: 'Euro / British Pound', basePrice: 0.8580, volatility: 0.004 },
  { ticker: 'EUR/JPY', company: 'Euro / Japanese Yen', basePrice: 163.30, volatility: 0.006 },
  { ticker: 'GBP/JPY', company: 'British Pound / Japanese Yen', basePrice: 190.30, volatility: 0.007 },
  { ticker: 'USD/CHF', company: 'US Dollar / Swiss Franc', basePrice: 0.8820, volatility: 0.004 },
];

const CRYPTO_TICKERS: TickerInfo[] = [
  { ticker: 'BTC/USD', company: 'Bitcoin', basePrice: 63500, volatility: 0.025 },
  { ticker: 'ETH/USD', company: 'Ethereum', basePrice: 3450, volatility: 0.030 },
  { ticker: 'SOL/USD', company: 'Solana', basePrice: 145, volatility: 0.040 },
  { ticker: 'BNB/USD', company: 'Binance Coin', basePrice: 580, volatility: 0.025 },
  { ticker: 'XRP/USD', company: 'Ripple', basePrice: 0.62, volatility: 0.035 },
  { ticker: 'ADA/USD', company: 'Cardano', basePrice: 0.58, volatility: 0.038 },
  { ticker: 'DOGE/USD', company: 'Dogecoin', basePrice: 0.16, volatility: 0.045 },
  { ticker: 'AVAX/USD', company: 'Avalanche', basePrice: 38.50, volatility: 0.038 },
  { ticker: 'DOT/USD', company: 'Polkadot', basePrice: 7.80, volatility: 0.035 },
  { ticker: 'MATIC/USD', company: 'Polygon', basePrice: 0.92, volatility: 0.038 },
];

const METALS_TICKERS: TickerInfo[] = [
  { ticker: 'XAUUSD', company: 'Gold', basePrice: 2340, volatility: 0.010 },
  { ticker: 'XAGUSD', company: 'Silver', basePrice: 27.50, volatility: 0.018 },
  { ticker: 'XPTUSD', company: 'Platinum', basePrice: 980, volatility: 0.015 },
  { ticker: 'XCUUSD', company: 'Copper', basePrice: 4.45, volatility: 0.016 },
  { ticker: 'XPDUSD', company: 'Palladium', basePrice: 1020, volatility: 0.020 },
];

function getTickerPool(market?: 'stocks' | 'forex' | 'crypto' | 'metals'): TickerInfo[] {
  switch (market) {
    case 'stocks': return STOCK_TICKERS;
    case 'forex': return FOREX_TICKERS;
    case 'crypto': return CRYPTO_TICKERS;
    case 'metals': return METALS_TICKERS;
    default: return [...STOCK_TICKERS, ...FOREX_TICKERS, ...CRYPTO_TICKERS, ...METALS_TICKERS];
  }
}

// ============================================================================
// OHLCV DATA GENERATION (Seeded Random Walk with Market Behavior)
// ============================================================================

function generateOHLCV(
  basePrice: number,
  volatility: number,
  candles: number,
  seed: number,
  timeframe: '1H' | '4H' | '1D' | '1W'
): OHLCV[] {
  const rng = mulberry32(seed);
  const data: OHLCV[] = [];

  let price = basePrice;

  // Trend parameters: random drift
  const trendStrength = (seededGaussian(rng) * 0.0005);
  // Volatility clustering (GARCH-like)
  let currentVol = volatility;

  const now = Date.now();
  const msPerCandle = timeframe === '1H' ? 3600000 : timeframe === '4H' ? 14400000 : timeframe === '1D' ? 86400000 : 604800000;

  for (let i = 0; i < candles; i++) {
    // Volatility clustering: mean-reverting vol
    const volShock = seededGaussian(rng) * 0.1;
    currentVol = currentVol * (1 + volShock * 0.1);
    currentVol = Math.max(volatility * 0.3, Math.min(volatility * 3, currentVol));

    // Price movement with trend + noise + mean reversion
    const drift = trendStrength * price;
    const meanReversion = (basePrice - price) * 0.001;
    const noise = seededGaussian(rng) * currentVol * price;
    const priceChange = drift + meanReversion + noise;

    const open = price;
    const close = price + priceChange;

    // Intrabar highs and lows
    const intraVol = Math.abs(priceChange) + currentVol * price * 0.5 * Math.abs(seededGaussian(rng));
    const high = Math.max(open, close) + Math.abs(seededGaussian(rng)) * intraVol * 0.3;
    const low = Math.min(open, close) - Math.abs(seededGaussian(rng)) * intraVol * 0.3;

    // Volume: base volume with spikes
    const baseVolume = 1000000 + rng() * 2000000;
    const volMultiplier = 1 + Math.abs(priceChange / price) * 20 + (rng() < 0.05 ? rng() * 5 : 0);
    const volume = Math.round(baseVolume * volMultiplier);

    const timestamp = new Date(now - (candles - i) * msPerCandle).toISOString();

    data.push({
      open: Math.max(0.0001, open),
      high: Math.max(0.0001, high),
      low: Math.max(0.0001, low),
      close: Math.max(0.0001, close),
      volume,
      timestamp,
    });

    price = close;
  }

  return data;
}

// ============================================================================
// STRATEGY WEIGHTS
// ============================================================================

const STRATEGY_WEIGHTS: Record<Strategy, Record<string, number>> = {
  momentum: {
    'RSI(14)': 3, 'MACD': 3, 'MACD Signal': 2, 'MACD Histogram': 3,
    'Stochastic %K': 2, 'Stochastic %D': 2, 'StochRSI': 2,
    'ROC(12)': 3, 'Momentum(10)': 3, 'TSI': 3, 'PPO': 2,
    'Awesome Oscillator': 2, 'TRIX': 2, 'Force Index': 2,
  },
  meanReversion: {
    'RSI(14)': 3, 'Bollinger %B': 3, 'Bollinger Upper': 2, 'Bollinger Lower': 2,
    'CCI(20)': 3, 'Williams %R': 3, 'Percent R': 2,
    'Z-Score': 3, 'Stochastic %K': 2, 'StochRSI': 2,
    'DPO': 2, 'MFI(14)': 2,
  },
  trendFollowing: {
    'ADX(14)': 3, '+DI(14)': 2, '-DI(14)': 2,
    'EMA(12)': 2, 'EMA(26)': 2, 'EMA(50)': 2, 'SMA(50)': 2, 'SMA(200)': 3,
    'Supertrend': 3, 'Parabolic SAR': 2,
    'Ichimoku Tenkan': 2, 'Ichimoku Kijun': 2, 'Ichimoku Senkou A': 2, 'Ichimoku Senkou B': 2,
    'KAMA(10)': 2, 'HMA(20)': 2, 'LR Slope': 2, 'LR Angle': 2,
    'Aroon Up': 2, 'Aroon Down': 2,
  },
  breakout: {
    'Donchian Upper': 3, 'Donchian Lower': 3, 'Donchian Middle': 2,
    'Bollinger Width': 3, 'Bollinger Upper': 2, 'Bollinger Lower': 2,
    'ATR(14)': 2, 'NATR': 2,
    'Volume Oscillator': 3, 'Relative Volume': 3, 'Volume ROC': 2,
    'Keltner Upper': 2, 'Keltner Lower': 2,
  },
  multiConfluence: {},
};

// ============================================================================
// SIGNAL GENERATION
// ============================================================================

function generateId(rng: () => number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(rng() * chars.length)];
  }
  return id;
}

function computeWeightedConfidence(
  indicators: IndicatorResult[],
  strategy: Strategy
): { bullish: string[]; bearish: string[]; neutral: string[]; confidence: number; direction: 'BUY' | 'SELL' | null } {
  const weights = STRATEGY_WEIGHTS[strategy];
  const bullish: string[] = [];
  const bearish: string[] = [];
  const neutral: string[] = [];

  let weightedBullish = 0;
  let weightedBearish = 0;
  let totalWeight = 0;

  for (const ind of indicators) {
    const weight = strategy === 'multiConfluence' ? 1 : (weights[ind.name] || 1);

    if (ind.signal === 'bullish') {
      bullish.push(ind.name);
      weightedBullish += weight;
    } else if (ind.signal === 'bearish') {
      bearish.push(ind.name);
      weightedBearish += weight;
    } else {
      neutral.push(ind.name);
    }
    totalWeight += weight;
  }

  const totalDirectional = weightedBullish + weightedBearish;
  if (totalDirectional === 0) {
    return { bullish, bearish, neutral, confidence: 0, direction: null };
  }

  const bullishPct = weightedBullish / totalDirectional;
  const bearishPct = weightedBearish / totalDirectional;

  if (bullishPct > 0.55) {
    return { bullish, bearish, neutral, confidence: Math.round(bullishPct * 100), direction: 'BUY' };
  } else if (bearishPct > 0.55) {
    return { bullish, bearish, neutral, confidence: Math.round(bearishPct * 100), direction: 'SELL' };
  }
  return { bullish, bearish, neutral, confidence: Math.round(Math.max(bullishPct, bearishPct) * 100), direction: null };
}

export function generateSignals(params: {
  market?: 'stocks' | 'forex' | 'crypto' | 'metals';
  timeframe?: '1H' | '4H' | '1D' | '1W';
  strategy?: Strategy;
  count?: number;
}): TradeSignal[] {
  const {
    market,
    timeframe = '1D',
    strategy = 'multiConfluence',
    count = 8,
  } = params;

  const pool = getTickerPool(market);
  const signals: TradeSignal[] = [];

  // Use current timestamp as part of the base seed so results vary over time
  const baseSeed = Math.floor(Date.now() / 60000); // Changes every minute

  let attempts = 0;
  const maxAttempts = pool.length * 3;

  while (signals.length < count && attempts < maxAttempts) {
    const tickerIdx = attempts % pool.length;
    const tickerInfo = pool[tickerIdx];
    const seed = baseSeed + attempts * 7919; // Prime number for better distribution
    const rng = mulberry32(seed);

    // Generate OHLCV data
    const ohlcvData = generateOHLCV(
      tickerInfo.basePrice,
      tickerInfo.volatility,
      200,
      seed,
      timeframe
    );

    // Run all indicators
    const indicators = computeAllIndicators(ohlcvData);

    // Compute weighted confidence
    const result = computeWeightedConfidence(indicators, strategy);

    attempts++;

    if (result.direction === null) continue;

    const currentBar = ohlcvData[ohlcvData.length - 1];
    const currentPrice = currentBar.close;
    const atrVal = ATR(ohlcvData, 14);

    let entryPrice = currentPrice;
    let stopLoss: number;
    let takeProfit: number;

    if (result.direction === 'BUY') {
      stopLoss = entryPrice - atrVal * 1.5;
      takeProfit = entryPrice + atrVal * 3;
    } else {
      stopLoss = entryPrice + atrVal * 1.5;
      takeProfit = entryPrice - atrVal * 3;
    }

    const slDistance = Math.abs(entryPrice - stopLoss);
    const tpDistance = Math.abs(takeProfit - entryPrice);
    const riskReward = slDistance === 0 ? 2 : Math.round((tpDistance / slDistance) * 100) / 100;

    const strength: 'Strong' | 'Moderate' | 'Weak' =
      result.confidence >= 80 ? 'Strong' : result.confidence >= 65 ? 'Moderate' : 'Weak';

    // Determine which specific market this ticker belongs to
    let signalMarket: 'stocks' | 'forex' | 'crypto' | 'metals';
    if (STOCK_TICKERS.some((t) => t.ticker === tickerInfo.ticker)) signalMarket = 'stocks';
    else if (FOREX_TICKERS.some((t) => t.ticker === tickerInfo.ticker)) signalMarket = 'forex';
    else if (METALS_TICKERS.some((t) => t.ticker === tickerInfo.ticker)) signalMarket = 'metals';
    else signalMarket = 'crypto';

    // Confluence score: number of agreeing indicators / total indicators * 100
    const agreeingCount = result.direction === 'BUY' ? result.bullish.length : result.bearish.length;
    const totalIndicators = result.bullish.length + result.bearish.length + result.neutral.length;
    const confluenceScore = totalIndicators === 0 ? 0 : Math.round((agreeingCount / totalIndicators) * 100);

    // Round prices appropriately
    const priceDecimals = currentPrice < 1 ? 6 : currentPrice < 10 ? 4 : currentPrice < 100 ? 2 : 2;
    const roundPrice = (p: number) => Math.round(p * Math.pow(10, priceDecimals)) / Math.pow(10, priceDecimals);

    signals.push({
      id: generateId(rng),
      ticker: tickerInfo.ticker,
      company: tickerInfo.company,
      market: signalMarket,
      direction: result.direction,
      confidence: result.confidence,
      entryPrice: roundPrice(entryPrice),
      stopLoss: roundPrice(stopLoss),
      takeProfit: roundPrice(takeProfit),
      currentPrice: roundPrice(currentPrice),
      timeframe,
      strategy,
      strength,
      timestamp: new Date().toISOString(),
      riskReward,
      indicators: {
        bullish: result.bullish,
        bearish: result.bearish,
        neutral: result.neutral,
      },
      indicatorCount: totalIndicators,
      confluenceScore,
    });
  }

  // Sort by confidence descending
  signals.sort((a, b) => b.confidence - a.confidence);

  return signals.slice(0, count);
}
