// ============================================================================
// EdgeFinder Technical Indicator Library
// 100+ pure TypeScript indicators - NO external dependencies
// ============================================================================

export interface OHLCV {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface IndicatorResult {
  name: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'statistical';
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function closes(data: OHLCV[]): number[] {
  return data.map((d) => d.close);
}

function highs(data: OHLCV[]): number[] {
  return data.map((d) => d.high);
}

function lows(data: OHLCV[]): number[] {
  return data.map((d) => d.low);
}

function volumes(data: OHLCV[]): number[] {
  return data.map((d) => d.volume);
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function maxVal(arr: number[]): number {
  return Math.max(...arr);
}

function minVal(arr: number[]): number {
  return Math.min(...arr);
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

// ============================================================================
// TREND INDICATORS (25+)
// ============================================================================

/** Simple Moving Average */
export function SMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return c[c.length - 1] || 0;
  return mean(c.slice(-period));
}

/** Exponential Moving Average */
export function EMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length === 0) return 0;
  const multiplier = 2 / (period + 1);
  let ema = c[0];
  for (let i = 1; i < c.length; i++) {
    ema = c[i] * multiplier + ema * (1 - multiplier);
  }
  return ema;
}

/** Compute EMA from raw number array */
function emaFromArray(arr: number[], period: number): number {
  if (arr.length === 0) return 0;
  const multiplier = 2 / (period + 1);
  let ema = arr[0];
  for (let i = 1; i < arr.length; i++) {
    ema = arr[i] * multiplier + ema * (1 - multiplier);
  }
  return ema;
}

/** Compute full EMA series from raw number array */
function emaSeries(arr: number[], period: number): number[] {
  if (arr.length === 0) return [];
  const multiplier = 2 / (period + 1);
  const result: number[] = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    result.push(arr[i] * multiplier + result[i - 1] * (1 - multiplier));
  }
  return result;
}

/** Compute full SMA series */
function smaSeries(arr: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < period - 1) {
      result.push(mean(arr.slice(0, i + 1)));
    } else {
      result.push(mean(arr.slice(i - period + 1, i + 1)));
    }
  }
  return result;
}

/** Weighted Moving Average */
export function WMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return c[c.length - 1] || 0;
  const slice = c.slice(-period);
  let weightedSum = 0;
  let weightTotal = 0;
  for (let i = 0; i < period; i++) {
    const weight = i + 1;
    weightedSum += slice[i] * weight;
    weightTotal += weight;
  }
  return weightedSum / weightTotal;
}

/** Double Exponential Moving Average */
export function DEMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  const ema1 = emaFromArray(c, period);
  const ema1Series = emaSeries(c, period);
  const ema2 = emaFromArray(ema1Series, period);
  return 2 * ema1 - ema2;
}

/** Triple Exponential Moving Average */
export function TEMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  const ema1Arr = emaSeries(c, period);
  const ema2Arr = emaSeries(ema1Arr, period);
  const ema3Arr = emaSeries(ema2Arr, period);
  const ema1 = ema1Arr[ema1Arr.length - 1] || 0;
  const ema2 = ema2Arr[ema2Arr.length - 1] || 0;
  const ema3 = ema3Arr[ema3Arr.length - 1] || 0;
  return 3 * ema1 - 3 * ema2 + ema3;
}

/** Kaufman Adaptive Moving Average */
export function KAMA(data: OHLCV[], period: number = 10): number {
  const c = closes(data);
  if (c.length < period + 1) return c[c.length - 1] || 0;
  const fastSC = 2 / (2 + 1);
  const slowSC = 2 / (30 + 1);

  let kama = c[period - 1];
  for (let i = period; i < c.length; i++) {
    const direction = Math.abs(c[i] - c[i - period]);
    let volatilitySum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      volatilitySum += Math.abs(c[j] - c[j - 1]);
    }
    const er = volatilitySum === 0 ? 0 : direction / volatilitySum;
    const sc = (er * (fastSC - slowSC) + slowSC) ** 2;
    kama = kama + sc * (c[i] - kama);
  }
  return kama;
}

/** Hull Moving Average */
export function HMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return c[c.length - 1] || 0;
  const halfPeriod = Math.floor(period / 2);
  const sqrtPeriod = Math.floor(Math.sqrt(period));

  const wma1Series: number[] = [];
  const wma2Series: number[] = [];
  for (let i = 0; i < c.length; i++) {
    const slice1 = c.slice(Math.max(0, i - halfPeriod + 1), i + 1);
    const slice2 = c.slice(Math.max(0, i - period + 1), i + 1);
    let w1 = 0, wt1 = 0;
    for (let j = 0; j < slice1.length; j++) {
      const w = j + 1;
      w1 += slice1[j] * w;
      wt1 += w;
    }
    let w2 = 0, wt2 = 0;
    for (let j = 0; j < slice2.length; j++) {
      const w = j + 1;
      w2 += slice2[j] * w;
      wt2 += w;
    }
    wma1Series.push(wt1 ? w1 / wt1 : 0);
    wma2Series.push(wt2 ? w2 / wt2 : 0);
  }

  const diffSeries = wma1Series.map((v, i) => 2 * v - wma2Series[i]);
  const lastSlice = diffSeries.slice(-sqrtPeriod);
  let wmaSum = 0, wmaTot = 0;
  for (let j = 0; j < lastSlice.length; j++) {
    const w = j + 1;
    wmaSum += lastSlice[j] * w;
    wmaTot += w;
  }
  return wmaTot ? wmaSum / wmaTot : 0;
}

/** Volume Weighted Moving Average */
export function VWMA(data: OHLCV[], period: number = 20): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].close : 0;
  const slice = data.slice(-period);
  let cvSum = 0;
  let vSum = 0;
  for (const bar of slice) {
    cvSum += bar.close * bar.volume;
    vSum += bar.volume;
  }
  return vSum === 0 ? 0 : cvSum / vSum;
}

/** Average Directional Index */
export function ADX(data: OHLCV[], period: number = 14): number {
  if (data.length < period + 1) return 0;
  const trArr: number[] = [];
  const plusDMArr: number[] = [];
  const minusDMArr: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const h = data[i].high;
    const l = data[i].low;
    const pc = data[i - 1].close;
    trArr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
    const upMove = h - data[i - 1].high;
    const downMove = data[i - 1].low - l;
    plusDMArr.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDMArr.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  const smoothTR = emaSeries(trArr, period);
  const smoothPlusDM = emaSeries(plusDMArr, period);
  const smoothMinusDM = emaSeries(minusDMArr, period);

  const dxArr: number[] = [];
  for (let i = 0; i < smoothTR.length; i++) {
    const pdi = smoothTR[i] === 0 ? 0 : (smoothPlusDM[i] / smoothTR[i]) * 100;
    const mdi = smoothTR[i] === 0 ? 0 : (smoothMinusDM[i] / smoothTR[i]) * 100;
    const dxDenom = pdi + mdi;
    dxArr.push(dxDenom === 0 ? 0 : (Math.abs(pdi - mdi) / dxDenom) * 100);
  }
  return emaFromArray(dxArr, period);
}

/** Plus Directional Indicator */
export function plusDI(data: OHLCV[], period: number = 14): number {
  if (data.length < period + 1) return 0;
  const trArr: number[] = [];
  const plusDMArr: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const h = data[i].high;
    const l = data[i].low;
    const pc = data[i - 1].close;
    trArr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
    const upMove = h - data[i - 1].high;
    const downMove = data[i - 1].low - l;
    plusDMArr.push(upMove > downMove && upMove > 0 ? upMove : 0);
  }
  const smoothTR = emaFromArray(trArr, period);
  const smoothPlusDM = emaFromArray(plusDMArr, period);
  return smoothTR === 0 ? 0 : (smoothPlusDM / smoothTR) * 100;
}

/** Minus Directional Indicator */
export function minusDI(data: OHLCV[], period: number = 14): number {
  if (data.length < period + 1) return 0;
  const trArr: number[] = [];
  const minusDMArr: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const h = data[i].high;
    const l = data[i].low;
    const pc = data[i - 1].close;
    trArr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
    const downMove = data[i - 1].low - l;
    const upMove = h - data[i - 1].high;
    minusDMArr.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  const smoothTR = emaFromArray(trArr, period);
  const smoothMinusDM = emaFromArray(minusDMArr, period);
  return smoothTR === 0 ? 0 : (smoothMinusDM / smoothTR) * 100;
}

/** Aroon Up */
export function aroonUp(data: OHLCV[], period: number = 25): number {
  if (data.length < period + 1) return 50;
  const slice = data.slice(-period - 1);
  let highestIdx = 0;
  let highestVal = -Infinity;
  for (let i = 0; i < slice.length; i++) {
    if (slice[i].high >= highestVal) {
      highestVal = slice[i].high;
      highestIdx = i;
    }
  }
  return ((period - (slice.length - 1 - highestIdx)) / period) * 100;
}

/** Aroon Down */
export function aroonDown(data: OHLCV[], period: number = 25): number {
  if (data.length < period + 1) return 50;
  const slice = data.slice(-period - 1);
  let lowestIdx = 0;
  let lowestVal = Infinity;
  for (let i = 0; i < slice.length; i++) {
    if (slice[i].low <= lowestVal) {
      lowestVal = slice[i].low;
      lowestIdx = i;
    }
  }
  return ((period - (slice.length - 1 - lowestIdx)) / period) * 100;
}

/** Parabolic SAR */
export function parabolicSAR(data: OHLCV[], step: number = 0.02, maxStep: number = 0.2): number {
  if (data.length < 2) return data.length > 0 ? data[0].close : 0;
  let isUpTrend = data[1].close > data[0].close;
  let sar = isUpTrend ? data[0].low : data[0].high;
  let ep = isUpTrend ? data[1].high : data[1].low;
  let af = step;

  for (let i = 2; i < data.length; i++) {
    sar = sar + af * (ep - sar);
    if (isUpTrend) {
      sar = Math.min(sar, data[i - 1].low, data[i - 2].low);
      if (data[i].low < sar) {
        isUpTrend = false;
        sar = ep;
        ep = data[i].low;
        af = step;
      } else {
        if (data[i].high > ep) {
          ep = data[i].high;
          af = Math.min(af + step, maxStep);
        }
      }
    } else {
      sar = Math.max(sar, data[i - 1].high, data[i - 2].high);
      if (data[i].high > sar) {
        isUpTrend = true;
        sar = ep;
        ep = data[i].high;
        af = step;
      } else {
        if (data[i].low < ep) {
          ep = data[i].low;
          af = Math.min(af + step, maxStep);
        }
      }
    }
  }
  return sar;
}

/** Supertrend */
export function supertrend(data: OHLCV[], period: number = 10, multiplier: number = 3): number {
  if (data.length < period + 1) return data.length > 0 ? data[data.length - 1].close : 0;
  const atrVals = atrSeries(data, period);
  let upperBand = 0;
  let lowerBand = 0;
  let superTrend = 0;
  let prevClose = data[0].close;
  let isUpTrend = true;

  for (let i = 0; i < data.length; i++) {
    const hl2 = (data[i].high + data[i].low) / 2;
    const atr = i < atrVals.length ? atrVals[i] : 0;
    const basicUpper = hl2 + multiplier * atr;
    const basicLower = hl2 - multiplier * atr;

    upperBand = basicUpper < upperBand || prevClose > upperBand ? basicUpper : upperBand;
    lowerBand = basicLower > lowerBand || prevClose < lowerBand ? basicLower : lowerBand;

    if (isUpTrend) {
      superTrend = lowerBand;
      if (data[i].close < lowerBand) {
        isUpTrend = false;
        superTrend = upperBand;
      }
    } else {
      superTrend = upperBand;
      if (data[i].close > upperBand) {
        isUpTrend = true;
        superTrend = lowerBand;
      }
    }
    prevClose = data[i].close;
  }
  return superTrend;
}

/** Helper: ATR series */
function atrSeries(data: OHLCV[], period: number = 14): number[] {
  const trArr: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      trArr.push(data[i].high - data[i].low);
    } else {
      trArr.push(
        Math.max(
          data[i].high - data[i].low,
          Math.abs(data[i].high - data[i - 1].close),
          Math.abs(data[i].low - data[i - 1].close)
        )
      );
    }
  }
  return emaSeries(trArr, period);
}

/** Ichimoku Tenkan-sen (Conversion Line) */
export function ichimokuTenkan(data: OHLCV[], period: number = 9): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].close : 0;
  const slice = data.slice(-period);
  return (maxVal(slice.map((d) => d.high)) + minVal(slice.map((d) => d.low))) / 2;
}

/** Ichimoku Kijun-sen (Base Line) */
export function ichimokuKijun(data: OHLCV[], period: number = 26): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].close : 0;
  const slice = data.slice(-period);
  return (maxVal(slice.map((d) => d.high)) + minVal(slice.map((d) => d.low))) / 2;
}

/** Ichimoku Senkou Span A (Leading Span A) */
export function ichimokuSenkouA(data: OHLCV[]): number {
  return (ichimokuTenkan(data, 9) + ichimokuKijun(data, 26)) / 2;
}

/** Ichimoku Senkou Span B (Leading Span B) */
export function ichimokuSenkouB(data: OHLCV[], period: number = 52): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].close : 0;
  const slice = data.slice(-period);
  return (maxVal(slice.map((d) => d.high)) + minVal(slice.map((d) => d.low))) / 2;
}

/** Ichimoku Chikou Span (Lagging Span) = close shifted back 26 periods */
export function ichimokuChikou(data: OHLCV[], lag: number = 26): number {
  if (data.length === 0) return 0;
  return data[data.length - 1].close;
}

/** Linear Regression Value */
export function linearRegression(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return c[c.length - 1] || 0;
  const slice = c.slice(-period);
  const n = slice.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += slice[i];
    sumXY += i * slice[i];
    sumX2 += i * i;
  }
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return slice[n - 1];
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return intercept + slope * (n - 1);
}

/** Linear Regression Slope */
export function linearRegressionSlope(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return 0;
  const slice = c.slice(-period);
  const n = slice.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += slice[i];
    sumXY += i * slice[i];
    sumX2 += i * i;
  }
  const denom = n * sumX2 - sumX * sumX;
  return denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
}

/** Linear Regression Angle (degrees) */
export function linearRegressionAngle(data: OHLCV[], period: number = 20): number {
  const slope = linearRegressionSlope(data, period);
  return (Math.atan(slope) * 180) / Math.PI;
}

/** Zero-Lag EMA */
export function ZLEMA(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length === 0) return 0;
  const lag = Math.floor((period - 1) / 2);
  const adjusted: number[] = [];
  for (let i = 0; i < c.length; i++) {
    const lagged = i >= lag ? c[i - lag] : c[0];
    adjusted.push(2 * c[i] - lagged);
  }
  return emaFromArray(adjusted, period);
}

/** McGinley Dynamic */
export function McGinleyDynamic(data: OHLCV[], period: number = 14): number {
  const c = closes(data);
  if (c.length === 0) return 0;
  let md = c[0];
  for (let i = 1; i < c.length; i++) {
    const ratio = c[i] / md;
    const denom = period * ratio ** 4;
    md = md + (c[i] - md) / (denom === 0 ? 1 : denom);
  }
  return md;
}

// ============================================================================
// MOMENTUM INDICATORS (25+)
// ============================================================================

/** Relative Strength Index */
export function RSI(data: OHLCV[], period: number = 14): number {
  const c = closes(data);
  if (c.length < period + 1) return 50;
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < c.length; i++) {
    const change = c[i] - c[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  let avgGain = mean(gains.slice(0, period));
  let avgLoss = mean(losses.slice(0, period));
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/** MACD Line */
export function MACD(data: OHLCV[], fast: number = 12, slow: number = 26): number {
  const c = closes(data);
  return emaFromArray(c, fast) - emaFromArray(c, slow);
}

/** MACD Signal Line */
export function MACDSignal(data: OHLCV[], fast: number = 12, slow: number = 26, signal: number = 9): number {
  const c = closes(data);
  const macdSeries: number[] = [];
  const fastEma = emaSeries(c, fast);
  const slowEma = emaSeries(c, slow);
  for (let i = 0; i < c.length; i++) {
    macdSeries.push(fastEma[i] - slowEma[i]);
  }
  return emaFromArray(macdSeries, signal);
}

/** MACD Histogram */
export function MACDHistogram(data: OHLCV[]): number {
  return MACD(data) - MACDSignal(data);
}

/** Stochastic %K */
export function stochasticK(data: OHLCV[], period: number = 14): number {
  if (data.length < period) return 50;
  const slice = data.slice(-period);
  const hh = maxVal(slice.map((d) => d.high));
  const ll = minVal(slice.map((d) => d.low));
  const close = data[data.length - 1].close;
  const denom = hh - ll;
  return denom === 0 ? 50 : ((close - ll) / denom) * 100;
}

/** Stochastic %D (3-period SMA of %K) */
export function stochasticD(data: OHLCV[], period: number = 14, smoothing: number = 3): number {
  if (data.length < period + smoothing) return 50;
  const kValues: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const hh = maxVal(slice.map((d) => d.high));
    const ll = minVal(slice.map((d) => d.low));
    const c = data[i].close;
    const denom = hh - ll;
    kValues.push(denom === 0 ? 50 : ((c - ll) / denom) * 100);
  }
  return mean(kValues.slice(-smoothing));
}

/** Stochastic RSI */
export function stochRSI(data: OHLCV[], rsiPeriod: number = 14, stochPeriod: number = 14): number {
  const c = closes(data);
  if (c.length < rsiPeriod + stochPeriod) return 50;
  // Compute RSI series
  const rsiValues: number[] = [];
  for (let i = rsiPeriod; i <= c.length; i++) {
    const subData = data.slice(0, i);
    rsiValues.push(RSI(subData, rsiPeriod));
  }
  if (rsiValues.length < stochPeriod) return 50;
  const slice = rsiValues.slice(-stochPeriod);
  const maxR = maxVal(slice);
  const minR = minVal(slice);
  const denom = maxR - minR;
  return denom === 0 ? 50 : ((rsiValues[rsiValues.length - 1] - minR) / denom) * 100;
}

/** Commodity Channel Index */
export function CCI(data: OHLCV[], period: number = 20): number {
  if (data.length < period) return 0;
  const slice = data.slice(-period);
  const tps = slice.map((d) => (d.high + d.low + d.close) / 3);
  const tpMean = mean(tps);
  const meanDev = mean(tps.map((v) => Math.abs(v - tpMean)));
  return meanDev === 0 ? 0 : (tps[tps.length - 1] - tpMean) / (0.015 * meanDev);
}

/** Williams %R */
export function williamsR(data: OHLCV[], period: number = 14): number {
  if (data.length < period) return -50;
  const slice = data.slice(-period);
  const hh = maxVal(slice.map((d) => d.high));
  const ll = minVal(slice.map((d) => d.low));
  const close = data[data.length - 1].close;
  const denom = hh - ll;
  return denom === 0 ? -50 : ((hh - close) / denom) * -100;
}

/** Rate of Change */
export function ROC(data: OHLCV[], period: number = 12): number {
  const c = closes(data);
  if (c.length <= period) return 0;
  const prev = c[c.length - 1 - period];
  return prev === 0 ? 0 : ((c[c.length - 1] - prev) / prev) * 100;
}

/** Momentum (simple price difference) */
export function momentum(data: OHLCV[], period: number = 10): number {
  const c = closes(data);
  if (c.length <= period) return 0;
  return c[c.length - 1] - c[c.length - 1 - period];
}

/** True Strength Index */
export function TSI(data: OHLCV[], longPeriod: number = 25, shortPeriod: number = 13): number {
  const c = closes(data);
  if (c.length < 2) return 0;
  const diffs: number[] = [];
  for (let i = 1; i < c.length; i++) {
    diffs.push(c[i] - c[i - 1]);
  }
  const absDiffs = diffs.map(Math.abs);
  const doubleSmoothed = emaFromArray(emaSeries(diffs, longPeriod), shortPeriod);
  const doubleSmoothedAbs = emaFromArray(emaSeries(absDiffs, longPeriod), shortPeriod);
  return doubleSmoothedAbs === 0 ? 0 : (doubleSmoothed / doubleSmoothedAbs) * 100;
}

/** Ultimate Oscillator */
export function ultimateOscillator(data: OHLCV[], p1: number = 7, p2: number = 14, p3: number = 28): number {
  if (data.length < p3 + 1) return 50;
  const bp: number[] = [];
  const tr: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const minLC = Math.min(data[i].low, data[i - 1].close);
    const maxHC = Math.max(data[i].high, data[i - 1].close);
    bp.push(data[i].close - minLC);
    tr.push(maxHC - minLC);
  }
  const avg = (p: number) => {
    const bpSlice = bp.slice(-p);
    const trSlice = tr.slice(-p);
    const trSum = sum(trSlice);
    return trSum === 0 ? 0 : sum(bpSlice) / trSum;
  };
  return (100 * (4 * avg(p1) + 2 * avg(p2) + avg(p3))) / 7;
}

/** Awesome Oscillator */
export function awesomeOscillator(data: OHLCV[]): number {
  const mp = data.map((d) => (d.high + d.low) / 2);
  const sma5 = mean(mp.slice(-5));
  const sma34 = mean(mp.slice(-34));
  return sma5 - sma34;
}

/** Percentage Price Oscillator */
export function PPO(data: OHLCV[], fast: number = 12, slow: number = 26): number {
  const c = closes(data);
  const fastEma = emaFromArray(c, fast);
  const slowEma = emaFromArray(c, slow);
  return slowEma === 0 ? 0 : ((fastEma - slowEma) / slowEma) * 100;
}

/** Coppock Curve */
export function coppockCurve(data: OHLCV[], wma: number = 10, roc1: number = 14, roc2: number = 11): number {
  const c = closes(data);
  if (c.length < Math.max(roc1, roc2) + wma) return 0;
  const rocSeries: number[] = [];
  const maxRoc = Math.max(roc1, roc2);
  for (let i = maxRoc; i < c.length; i++) {
    const r1 = c[i - roc1] === 0 ? 0 : ((c[i] - c[i - roc1]) / c[i - roc1]) * 100;
    const r2 = c[i - roc2] === 0 ? 0 : ((c[i] - c[i - roc2]) / c[i - roc2]) * 100;
    rocSeries.push(r1 + r2);
  }
  if (rocSeries.length < wma) return rocSeries[rocSeries.length - 1] || 0;
  const slice = rocSeries.slice(-wma);
  let wmaSum = 0, wmaTot = 0;
  for (let j = 0; j < slice.length; j++) {
    const w = j + 1;
    wmaSum += slice[j] * w;
    wmaTot += w;
  }
  return wmaTot ? wmaSum / wmaTot : 0;
}

/** Detrended Price Oscillator */
export function DPO(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return 0;
  const shift = Math.floor(period / 2) + 1;
  const smaVal = mean(c.slice(-period));
  const idx = c.length - shift;
  return idx >= 0 ? c[idx] - smaVal : 0;
}

/** Know Sure Thing (KST) */
export function KST(data: OHLCV[]): number {
  const c = closes(data);
  const rocCalc = (p: number): number[] => {
    const result: number[] = [];
    for (let i = p; i < c.length; i++) {
      result.push(c[i - p] === 0 ? 0 : ((c[i] - c[i - p]) / c[i - p]) * 100);
    }
    return result;
  };
  const r1 = rocCalc(10);
  const r2 = rocCalc(15);
  const r3 = rocCalc(20);
  const r4 = rocCalc(30);
  const sma1 = r1.length >= 10 ? mean(r1.slice(-10)) : mean(r1);
  const sma2 = r2.length >= 10 ? mean(r2.slice(-10)) : mean(r2);
  const sma3 = r3.length >= 10 ? mean(r3.slice(-10)) : mean(r3);
  const sma4 = r4.length >= 15 ? mean(r4.slice(-15)) : mean(r4);
  return sma1 * 1 + sma2 * 2 + sma3 * 3 + sma4 * 4;
}

/** TRIX */
export function TRIX(data: OHLCV[], period: number = 15): number {
  const c = closes(data);
  const ema1 = emaSeries(c, period);
  const ema2 = emaSeries(ema1, period);
  const ema3 = emaSeries(ema2, period);
  if (ema3.length < 2) return 0;
  const prev = ema3[ema3.length - 2];
  return prev === 0 ? 0 : ((ema3[ema3.length - 1] - prev) / prev) * 100;
}

/** Elder Ray Bull Power */
export function elderRayBull(data: OHLCV[], period: number = 13): number {
  if (data.length === 0) return 0;
  const emaVal = EMA(data, period);
  return data[data.length - 1].high - emaVal;
}

/** Elder Ray Bear Power */
export function elderRayBear(data: OHLCV[], period: number = 13): number {
  if (data.length === 0) return 0;
  const emaVal = EMA(data, period);
  return data[data.length - 1].low - emaVal;
}

/** Chaikin Money Flow */
export function CMF(data: OHLCV[], period: number = 20): number {
  if (data.length < period) return 0;
  const slice = data.slice(-period);
  let mfvSum = 0;
  let volSum = 0;
  for (const bar of slice) {
    const hl = bar.high - bar.low;
    const mfMultiplier = hl === 0 ? 0 : ((bar.close - bar.low) - (bar.high - bar.close)) / hl;
    mfvSum += mfMultiplier * bar.volume;
    volSum += bar.volume;
  }
  return volSum === 0 ? 0 : mfvSum / volSum;
}

/** Money Flow Index */
export function MFI(data: OHLCV[], period: number = 14): number {
  if (data.length < period + 1) return 50;
  let posFlow = 0;
  let negFlow = 0;
  for (let i = data.length - period; i < data.length; i++) {
    const tp = (data[i].high + data[i].low + data[i].close) / 3;
    const prevTp = (data[i - 1].high + data[i - 1].low + data[i - 1].close) / 3;
    const mf = tp * data[i].volume;
    if (tp > prevTp) posFlow += mf;
    else if (tp < prevTp) negFlow += mf;
  }
  if (negFlow === 0) return 100;
  const ratio = posFlow / negFlow;
  return 100 - 100 / (1 + ratio);
}

/** Force Index */
export function forceIndex(data: OHLCV[], period: number = 13): number {
  if (data.length < 2) return 0;
  const fi: number[] = [];
  for (let i = 1; i < data.length; i++) {
    fi.push((data[i].close - data[i - 1].close) * data[i].volume);
  }
  return emaFromArray(fi, period);
}

/** Williams Percent R (alias) */
export function percentR(data: OHLCV[], period: number = 14): number {
  return williamsR(data, period);
}

// ============================================================================
// VOLATILITY INDICATORS (23+)
// ============================================================================

/** Bollinger Upper Band */
export function bollingerUpper(data: OHLCV[], period: number = 20, mult: number = 2): number {
  const c = closes(data);
  if (c.length < period) return c[c.length - 1] || 0;
  const slice = c.slice(-period);
  return mean(slice) + mult * stdDev(slice);
}

/** Bollinger Middle Band */
export function bollingerMiddle(data: OHLCV[], period: number = 20): number {
  return SMA(data, period);
}

/** Bollinger Lower Band */
export function bollingerLower(data: OHLCV[], period: number = 20, mult: number = 2): number {
  const c = closes(data);
  if (c.length < period) return c[c.length - 1] || 0;
  const slice = c.slice(-period);
  return mean(slice) - mult * stdDev(slice);
}

/** Bollinger Band Width */
export function bollingerWidth(data: OHLCV[], period: number = 20, mult: number = 2): number {
  const mid = bollingerMiddle(data, period);
  if (mid === 0) return 0;
  return ((bollingerUpper(data, period, mult) - bollingerLower(data, period, mult)) / mid) * 100;
}

/** Bollinger %B */
export function bollingerPercentB(data: OHLCV[], period: number = 20, mult: number = 2): number {
  const upper = bollingerUpper(data, period, mult);
  const lower = bollingerLower(data, period, mult);
  const denom = upper - lower;
  if (denom === 0) return 0.5;
  const close = data.length > 0 ? data[data.length - 1].close : 0;
  return (close - lower) / denom;
}

/** Average True Range */
export function ATR(data: OHLCV[], period: number = 14): number {
  if (data.length < 2) return data.length > 0 ? data[0].high - data[0].low : 0;
  const trArr: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      trArr.push(data[i].high - data[i].low);
    } else {
      trArr.push(
        Math.max(
          data[i].high - data[i].low,
          Math.abs(data[i].high - data[i - 1].close),
          Math.abs(data[i].low - data[i - 1].close)
        )
      );
    }
  }
  return emaFromArray(trArr, period);
}

/** Keltner Channel Upper */
export function keltnerUpper(data: OHLCV[], emaPeriod: number = 20, atrPeriod: number = 14, mult: number = 2): number {
  return EMA(data, emaPeriod) + mult * ATR(data, atrPeriod);
}

/** Keltner Channel Middle */
export function keltnerMiddle(data: OHLCV[], emaPeriod: number = 20): number {
  return EMA(data, emaPeriod);
}

/** Keltner Channel Lower */
export function keltnerLower(data: OHLCV[], emaPeriod: number = 20, atrPeriod: number = 14, mult: number = 2): number {
  return EMA(data, emaPeriod) - mult * ATR(data, atrPeriod);
}

/** Donchian Channel Upper */
export function donchianUpper(data: OHLCV[], period: number = 20): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].high : 0;
  return maxVal(data.slice(-period).map((d) => d.high));
}

/** Donchian Channel Middle */
export function donchianMiddle(data: OHLCV[], period: number = 20): number {
  return (donchianUpper(data, period) + donchianLower(data, period)) / 2;
}

/** Donchian Channel Lower */
export function donchianLower(data: OHLCV[], period: number = 20): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].low : 0;
  return minVal(data.slice(-period).map((d) => d.low));
}

/** Standard Deviation of closes */
export function standardDeviation(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return 0;
  return stdDev(c.slice(-period));
}

/** Historical Volatility (annualized std dev of log returns) */
export function historicalVolatility(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period + 1) return 0;
  const logReturns: number[] = [];
  for (let i = c.length - period; i < c.length; i++) {
    if (c[i - 1] > 0) logReturns.push(Math.log(c[i] / c[i - 1]));
  }
  return stdDev(logReturns) * Math.sqrt(252) * 100;
}

/** Normalized ATR */
export function NATR(data: OHLCV[], period: number = 14): number {
  const close = data.length > 0 ? data[data.length - 1].close : 0;
  return close === 0 ? 0 : (ATR(data, period) / close) * 100;
}

/** True Range (single bar) */
export function trueRange(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  if (data.length === 1) return last.high - last.low;
  const prev = data[data.length - 2];
  return Math.max(last.high - last.low, Math.abs(last.high - prev.close), Math.abs(last.low - prev.close));
}

/** Chandelier Exit Long */
export function chandelierExitLong(data: OHLCV[], period: number = 22, mult: number = 3): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].close : 0;
  const hh = maxVal(data.slice(-period).map((d) => d.high));
  return hh - mult * ATR(data, period);
}

/** Chandelier Exit Short */
export function chandelierExitShort(data: OHLCV[], period: number = 22, mult: number = 3): number {
  if (data.length < period) return data.length > 0 ? data[data.length - 1].close : 0;
  const ll = minVal(data.slice(-period).map((d) => d.low));
  return ll + mult * ATR(data, period);
}

/** Pivot Point (Standard) */
export function pivotPoint(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  return (last.high + last.low + last.close) / 3;
}

/** Pivot Resistance 1 */
export function pivotR1(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const pp = pivotPoint(data);
  return 2 * pp - data[data.length - 1].low;
}

/** Pivot Resistance 2 */
export function pivotR2(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  const pp = pivotPoint(data);
  return pp + (last.high - last.low);
}

/** Pivot Support 1 */
export function pivotS1(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const pp = pivotPoint(data);
  return 2 * pp - data[data.length - 1].high;
}

/** Pivot Support 2 */
export function pivotS2(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  const pp = pivotPoint(data);
  return pp - (last.high - last.low);
}

// ============================================================================
// VOLUME INDICATORS (15+)
// ============================================================================

/** Volume Weighted Average Price */
export function VWAP(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  let cumPV = 0;
  let cumVol = 0;
  for (const bar of data) {
    const tp = (bar.high + bar.low + bar.close) / 3;
    cumPV += tp * bar.volume;
    cumVol += bar.volume;
  }
  return cumVol === 0 ? 0 : cumPV / cumVol;
}

/** On-Balance Volume */
export function OBV(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  let obv = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].close > data[i - 1].close) obv += data[i].volume;
    else if (data[i].close < data[i - 1].close) obv -= data[i].volume;
  }
  return obv;
}

/** Accumulation/Distribution Line */
export function accumulationDistribution(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  let ad = 0;
  for (const bar of data) {
    const hl = bar.high - bar.low;
    const mfMultiplier = hl === 0 ? 0 : ((bar.close - bar.low) - (bar.high - bar.close)) / hl;
    ad += mfMultiplier * bar.volume;
  }
  return ad;
}

/** Volume Oscillator */
export function volumeOscillator(data: OHLCV[], shortPeriod: number = 5, longPeriod: number = 10): number {
  const v = volumes(data);
  if (v.length < longPeriod) return 0;
  const shortEma = emaFromArray(v, shortPeriod);
  const longEma = emaFromArray(v, longPeriod);
  return longEma === 0 ? 0 : ((shortEma - longEma) / longEma) * 100;
}

/** Price Volume Trend */
export function PVT(data: OHLCV[]): number {
  if (data.length < 2) return 0;
  let pvt = 0;
  for (let i = 1; i < data.length; i++) {
    const prevClose = data[i - 1].close;
    if (prevClose !== 0) {
      pvt += ((data[i].close - prevClose) / prevClose) * data[i].volume;
    }
  }
  return pvt;
}

/** Negative Volume Index */
export function NVI(data: OHLCV[]): number {
  if (data.length === 0) return 1000;
  let nvi = 1000;
  for (let i = 1; i < data.length; i++) {
    if (data[i].volume < data[i - 1].volume) {
      const prevClose = data[i - 1].close;
      if (prevClose !== 0) {
        nvi += nvi * ((data[i].close - prevClose) / prevClose);
      }
    }
  }
  return nvi;
}

/** Positive Volume Index */
export function PVI(data: OHLCV[]): number {
  if (data.length === 0) return 1000;
  let pvi = 1000;
  for (let i = 1; i < data.length; i++) {
    if (data[i].volume > data[i - 1].volume) {
      const prevClose = data[i - 1].close;
      if (prevClose !== 0) {
        pvi += pvi * ((data[i].close - prevClose) / prevClose);
      }
    }
  }
  return pvi;
}

/** Elder Force Index (EMA smoothed) */
export function elderForceIndex(data: OHLCV[], period: number = 13): number {
  return forceIndex(data, period);
}

/** Ease of Movement */
export function EOM(data: OHLCV[], period: number = 14): number {
  if (data.length < 2) return 0;
  const eomArr: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const dm = ((data[i].high + data[i].low) / 2) - ((data[i - 1].high + data[i - 1].low) / 2);
    const hl = data[i].high - data[i].low;
    const boxRatio = data[i].volume === 0 || hl === 0 ? 0 : data[i].volume / hl;
    eomArr.push(boxRatio === 0 ? 0 : dm / boxRatio);
  }
  if (eomArr.length < period) return mean(eomArr);
  return mean(eomArr.slice(-period));
}

/** Volume Weighted RSI */
export function volumeWeightedRSI(data: OHLCV[], period: number = 14): number {
  if (data.length < period + 1) return 50;
  let posVW = 0;
  let negVW = 0;
  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) posVW += change * data[i].volume;
    else if (change < 0) negVW += Math.abs(change) * data[i].volume;
  }
  if (negVW === 0) return 100;
  const rs = posVW / negVW;
  return 100 - 100 / (1 + rs);
}

/** Volume Profile (Point of Control price level) */
export function volumeProfile(data: OHLCV[], bins: number = 20): number {
  if (data.length === 0) return 0;
  const allPrices = data.map((d) => d.close);
  const minP = minVal(allPrices);
  const maxP = maxVal(allPrices);
  const range = maxP - minP;
  if (range === 0) return minP;
  const binSize = range / bins;
  const volBins: number[] = new Array(bins).fill(0);
  for (const bar of data) {
    const idx = Math.min(Math.floor((bar.close - minP) / binSize), bins - 1);
    volBins[idx] += bar.volume;
  }
  let maxBin = 0;
  let maxBinIdx = 0;
  for (let i = 0; i < bins; i++) {
    if (volBins[i] > maxBin) {
      maxBin = volBins[i];
      maxBinIdx = i;
    }
  }
  return minP + (maxBinIdx + 0.5) * binSize;
}

/** Volume Moving Average */
export function volumeMA(data: OHLCV[], period: number = 20): number {
  const v = volumes(data);
  if (v.length < period) return mean(v);
  return mean(v.slice(-period));
}

/** Relative Volume (current vs average) */
export function relativeVolume(data: OHLCV[], period: number = 20): number {
  if (data.length === 0) return 1;
  const avgVol = volumeMA(data, period);
  return avgVol === 0 ? 1 : data[data.length - 1].volume / avgVol;
}

/** Volume Rate of Change */
export function volumeRateOfChange(data: OHLCV[], period: number = 14): number {
  const v = volumes(data);
  if (v.length <= period) return 0;
  const prev = v[v.length - 1 - period];
  return prev === 0 ? 0 : ((v[v.length - 1] - prev) / prev) * 100;
}

/** Money Flow Volume */
export function moneyFlowVolume(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  const hl = last.high - last.low;
  const mfm = hl === 0 ? 0 : ((last.close - last.low) - (last.high - last.close)) / hl;
  return mfm * last.volume;
}

// ============================================================================
// STATISTICAL INDICATORS (15+)
// ============================================================================

/** Fibonacci Retracement 23.6% */
export function fibRetracement236(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const h = maxVal(data.map((d) => d.high));
  const l = minVal(data.map((d) => d.low));
  return h - (h - l) * 0.236;
}

/** Fibonacci Retracement 38.2% */
export function fibRetracement382(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const h = maxVal(data.map((d) => d.high));
  const l = minVal(data.map((d) => d.low));
  return h - (h - l) * 0.382;
}

/** Fibonacci Retracement 50.0% */
export function fibRetracement500(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const h = maxVal(data.map((d) => d.high));
  const l = minVal(data.map((d) => d.low));
  return h - (h - l) * 0.5;
}

/** Fibonacci Retracement 61.8% */
export function fibRetracement618(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const h = maxVal(data.map((d) => d.high));
  const l = minVal(data.map((d) => d.low));
  return h - (h - l) * 0.618;
}

/** Fibonacci Retracement 78.6% */
export function fibRetracement786(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const h = maxVal(data.map((d) => d.high));
  const l = minVal(data.map((d) => d.low));
  return h - (h - l) * 0.786;
}

/** R-Squared (coefficient of determination) of linear regression */
export function rSquared(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return 0;
  const slice = c.slice(-period);
  const n = slice.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += slice[i];
    sumXY += i * slice[i];
    sumX2 += i * i;
    sumY2 += slice[i] * slice[i];
  }
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
  if (den === 0) return 0;
  const r = num / den;
  return r * r;
}

/** Z-Score of latest close relative to period */
export function zScore(data: OHLCV[], period: number = 20): number {
  const c = closes(data);
  if (c.length < period) return 0;
  const slice = c.slice(-period);
  const m = mean(slice);
  const sd = stdDev(slice);
  return sd === 0 ? 0 : (c[c.length - 1] - m) / sd;
}

/** Typical Price */
export function typicalPrice(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  return (last.high + last.low + last.close) / 3;
}

/** Median Price */
export function medianPrice(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  return (last.high + last.low) / 2;
}

/** Weighted Close */
export function weightedClose(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  return (last.high + last.low + last.close * 2) / 4;
}

/** Heikin-Ashi Close */
export function heikinAshiClose(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  return (last.open + last.high + last.low + last.close) / 4;
}

/** Heikin-Ashi Open */
export function heikinAshiOpen(data: OHLCV[]): number {
  if (data.length < 2) return data.length > 0 ? data[0].open : 0;
  let haOpen = data[0].open;
  for (let i = 1; i < data.length; i++) {
    const haClose = (data[i].open + data[i].high + data[i].low + data[i].close) / 4;
    haOpen = (haOpen + haClose) / 2;
  }
  // Return the last ha open before computing haClose for last bar
  const prevHaClose = (data[data.length - 2].open + data[data.length - 2].high + data[data.length - 2].low + data[data.length - 2].close) / 4;
  let haO = data[0].open;
  for (let i = 1; i < data.length - 1; i++) {
    const hc = (data[i].open + data[i].high + data[i].low + data[i].close) / 4;
    haO = (haO + hc) / 2;
  }
  return (haO + prevHaClose) / 2;
}

/** Heikin-Ashi High */
export function heikinAshiHigh(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  const haC = heikinAshiClose(data);
  const haO = heikinAshiOpen(data);
  return Math.max(last.high, haC, haO);
}

/** Heikin-Ashi Low */
export function heikinAshiLow(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  const haC = heikinAshiClose(data);
  const haO = heikinAshiOpen(data);
  return Math.min(last.low, haC, haO);
}

/** Average Price */
export function averagePrice(data: OHLCV[]): number {
  if (data.length === 0) return 0;
  const last = data[data.length - 1];
  return (last.open + last.high + last.low + last.close) / 4;
}

// ============================================================================
// COMPUTE ALL INDICATORS
// ============================================================================

export function computeAllIndicators(data: OHLCV[]): IndicatorResult[] {
  if (data.length < 2) return [];

  const currentClose = data[data.length - 1].close;
  const results: IndicatorResult[] = [];

  // Helper to determine trend signal from moving average vs close
  const maSignal = (maVal: number): 'bullish' | 'bearish' | 'neutral' => {
    if (currentClose > maVal * 1.001) return 'bullish';
    if (currentClose < maVal * 0.999) return 'bearish';
    return 'neutral';
  };

  // Helper to determine trend signal strength from MA
  const maStrength = (maVal: number): number => {
    const pctDiff = Math.abs((currentClose - maVal) / maVal) * 100;
    return clamp(pctDiff * 20, 0, 100);
  };

  // ---- TREND INDICATORS ----
  const trendIndicators: Array<{ name: string; fn: () => number; signalFn?: (v: number) => 'bullish' | 'bearish' | 'neutral'; strengthFn?: (v: number) => number }> = [
    { name: 'SMA(20)', fn: () => SMA(data, 20) },
    { name: 'SMA(50)', fn: () => SMA(data, 50) },
    { name: 'SMA(200)', fn: () => SMA(data, 200) },
    { name: 'EMA(12)', fn: () => EMA(data, 12) },
    { name: 'EMA(26)', fn: () => EMA(data, 26) },
    { name: 'EMA(50)', fn: () => EMA(data, 50) },
    { name: 'WMA(20)', fn: () => WMA(data, 20) },
    { name: 'DEMA(20)', fn: () => DEMA(data, 20) },
    { name: 'TEMA(20)', fn: () => TEMA(data, 20) },
    { name: 'KAMA(10)', fn: () => KAMA(data, 10) },
    { name: 'HMA(20)', fn: () => HMA(data, 20) },
    { name: 'VWMA(20)', fn: () => VWMA(data, 20) },
    {
      name: 'ADX(14)',
      fn: () => ADX(data, 14),
      signalFn: (v) => {
        const pdi = plusDI(data, 14);
        const mdi = minusDI(data, 14);
        if (v > 25 && pdi > mdi) return 'bullish';
        if (v > 25 && mdi > pdi) return 'bearish';
        return 'neutral';
      },
      strengthFn: (v) => clamp(v, 0, 100),
    },
    {
      name: '+DI(14)',
      fn: () => plusDI(data, 14),
      signalFn: (v) => (v > minusDI(data, 14) ? 'bullish' : 'bearish'),
      strengthFn: (v) => clamp(v, 0, 100),
    },
    {
      name: '-DI(14)',
      fn: () => minusDI(data, 14),
      signalFn: (v) => (v > plusDI(data, 14) ? 'bearish' : 'bullish'),
      strengthFn: (v) => clamp(v, 0, 100),
    },
    {
      name: 'Aroon Up',
      fn: () => aroonUp(data),
      signalFn: (v) => (v > 70 ? 'bullish' : v < 30 ? 'bearish' : 'neutral'),
      strengthFn: (v) => v,
    },
    {
      name: 'Aroon Down',
      fn: () => aroonDown(data),
      signalFn: (v) => (v > 70 ? 'bearish' : v < 30 ? 'bullish' : 'neutral'),
      strengthFn: (v) => v,
    },
    {
      name: 'Parabolic SAR',
      fn: () => parabolicSAR(data),
      signalFn: (v) => (currentClose > v ? 'bullish' : 'bearish'),
      strengthFn: (v) => clamp(Math.abs((currentClose - v) / currentClose) * 500, 0, 100),
    },
    {
      name: 'Supertrend',
      fn: () => supertrend(data),
      signalFn: (v) => (currentClose > v ? 'bullish' : 'bearish'),
      strengthFn: (v) => clamp(Math.abs((currentClose - v) / currentClose) * 300, 0, 100),
    },
    { name: 'Ichimoku Tenkan', fn: () => ichimokuTenkan(data) },
    { name: 'Ichimoku Kijun', fn: () => ichimokuKijun(data) },
    { name: 'Ichimoku Senkou A', fn: () => ichimokuSenkouA(data) },
    { name: 'Ichimoku Senkou B', fn: () => ichimokuSenkouB(data) },
    { name: 'Linear Regression', fn: () => linearRegression(data) },
    {
      name: 'LR Slope',
      fn: () => linearRegressionSlope(data),
      signalFn: (v) => (v > 0 ? 'bullish' : v < 0 ? 'bearish' : 'neutral'),
      strengthFn: (v) => clamp(Math.abs(v) * 1000, 0, 100),
    },
    {
      name: 'LR Angle',
      fn: () => linearRegressionAngle(data),
      signalFn: (v) => (v > 5 ? 'bullish' : v < -5 ? 'bearish' : 'neutral'),
      strengthFn: (v) => clamp(Math.abs(v), 0, 100),
    },
    { name: 'ZLEMA(20)', fn: () => ZLEMA(data, 20) },
    { name: 'McGinley Dynamic', fn: () => McGinleyDynamic(data) },
  ];

  for (const ind of trendIndicators) {
    const val = ind.fn();
    const sig = ind.signalFn ? ind.signalFn(val) : maSignal(val);
    const str = ind.strengthFn ? ind.strengthFn(val) : maStrength(val);
    results.push({ name: ind.name, category: 'trend', value: val, signal: sig, strength: clamp(Math.round(str), 0, 100) });
  }

  // ---- MOMENTUM INDICATORS ----
  const rsiVal = RSI(data);
  results.push({
    name: 'RSI(14)',
    category: 'momentum',
    value: rsiVal,
    signal: rsiVal > 50 ? 'bullish' : rsiVal < 50 ? 'bearish' : 'neutral',
    strength: clamp(Math.round(Math.abs(rsiVal - 50) * 2), 0, 100),
  });

  const macdVal = MACD(data);
  const macdSig = MACDSignal(data);
  const macdHist = MACDHistogram(data);
  results.push({
    name: 'MACD',
    category: 'momentum',
    value: macdVal,
    signal: macdVal > macdSig ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(macdHist) / (currentClose * 0.001) * 10), 0, 100),
  });
  results.push({
    name: 'MACD Signal',
    category: 'momentum',
    value: macdSig,
    signal: macdVal > macdSig ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(macdVal - macdSig) / (currentClose * 0.001) * 10), 0, 100),
  });
  results.push({
    name: 'MACD Histogram',
    category: 'momentum',
    value: macdHist,
    signal: macdHist > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(macdHist) / (currentClose * 0.001) * 10), 0, 100),
  });

  const stochKVal = stochasticK(data);
  const stochDVal = stochasticD(data);
  results.push({
    name: 'Stochastic %K',
    category: 'momentum',
    value: stochKVal,
    signal: stochKVal > 50 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(stochKVal - 50) * 2), 0, 100),
  });
  results.push({
    name: 'Stochastic %D',
    category: 'momentum',
    value: stochDVal,
    signal: stochKVal > stochDVal ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(stochKVal - stochDVal) * 2), 0, 100),
  });

  const stochRSIVal = stochRSI(data);
  results.push({
    name: 'StochRSI',
    category: 'momentum',
    value: stochRSIVal,
    signal: stochRSIVal > 50 ? 'bullish' : stochRSIVal < 50 ? 'bearish' : 'neutral',
    strength: clamp(Math.round(Math.abs(stochRSIVal - 50) * 2), 0, 100),
  });

  const cciVal = CCI(data);
  results.push({
    name: 'CCI(20)',
    category: 'momentum',
    value: cciVal,
    signal: cciVal > 0 ? 'bullish' : cciVal < 0 ? 'bearish' : 'neutral',
    strength: clamp(Math.round(Math.abs(cciVal) / 2), 0, 100),
  });

  const wrVal = williamsR(data);
  results.push({
    name: 'Williams %R',
    category: 'momentum',
    value: wrVal,
    signal: wrVal > -50 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(wrVal + 50) * 2), 0, 100),
  });

  const rocVal = ROC(data);
  results.push({
    name: 'ROC(12)',
    category: 'momentum',
    value: rocVal,
    signal: rocVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(rocVal) * 5), 0, 100),
  });

  const momVal = momentum(data);
  results.push({
    name: 'Momentum(10)',
    category: 'momentum',
    value: momVal,
    signal: momVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(momVal / currentClose) * 500), 0, 100),
  });

  const tsiVal = TSI(data);
  results.push({
    name: 'TSI',
    category: 'momentum',
    value: tsiVal,
    signal: tsiVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(tsiVal)), 0, 100),
  });

  const uoVal = ultimateOscillator(data);
  results.push({
    name: 'Ultimate Oscillator',
    category: 'momentum',
    value: uoVal,
    signal: uoVal > 50 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(uoVal - 50) * 2), 0, 100),
  });

  const aoVal = awesomeOscillator(data);
  results.push({
    name: 'Awesome Oscillator',
    category: 'momentum',
    value: aoVal,
    signal: aoVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(aoVal / currentClose) * 500), 0, 100),
  });

  const ppoVal = PPO(data);
  results.push({
    name: 'PPO',
    category: 'momentum',
    value: ppoVal,
    signal: ppoVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(ppoVal) * 10), 0, 100),
  });

  const copVal = coppockCurve(data);
  results.push({
    name: 'Coppock Curve',
    category: 'momentum',
    value: copVal,
    signal: copVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(copVal) * 2), 0, 100),
  });

  const dpoVal = DPO(data);
  results.push({
    name: 'DPO',
    category: 'momentum',
    value: dpoVal,
    signal: dpoVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(dpoVal / currentClose) * 500), 0, 100),
  });

  const kstVal = KST(data);
  results.push({
    name: 'KST',
    category: 'momentum',
    value: kstVal,
    signal: kstVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(kstVal) / 2), 0, 100),
  });

  const trixVal = TRIX(data);
  results.push({
    name: 'TRIX',
    category: 'momentum',
    value: trixVal,
    signal: trixVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(trixVal) * 100), 0, 100),
  });

  const bullPower = elderRayBull(data);
  results.push({
    name: 'Elder Ray Bull',
    category: 'momentum',
    value: bullPower,
    signal: bullPower > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(bullPower / currentClose) * 500), 0, 100),
  });

  const bearPower = elderRayBear(data);
  results.push({
    name: 'Elder Ray Bear',
    category: 'momentum',
    value: bearPower,
    signal: bearPower > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(bearPower / currentClose) * 500), 0, 100),
  });

  const cmfVal = CMF(data);
  results.push({
    name: 'CMF(20)',
    category: 'momentum',
    value: cmfVal,
    signal: cmfVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(cmfVal) * 200), 0, 100),
  });

  const mfiVal = MFI(data);
  results.push({
    name: 'MFI(14)',
    category: 'momentum',
    value: mfiVal,
    signal: mfiVal > 50 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(mfiVal - 50) * 2), 0, 100),
  });

  const fiVal = forceIndex(data);
  results.push({
    name: 'Force Index',
    category: 'momentum',
    value: fiVal,
    signal: fiVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(fiVal / (currentClose * 1000)) * 50), 0, 100),
  });

  const prVal = percentR(data);
  results.push({
    name: 'Percent R',
    category: 'momentum',
    value: prVal,
    signal: prVal > -50 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(prVal + 50) * 2), 0, 100),
  });

  // ---- VOLATILITY INDICATORS ----
  const bbUpper = bollingerUpper(data);
  const bbMiddle = bollingerMiddle(data);
  const bbLower = bollingerLower(data);
  const bbWidth = bollingerWidth(data);
  const bbPctB = bollingerPercentB(data);

  results.push({
    name: 'Bollinger Upper',
    category: 'volatility',
    value: bbUpper,
    signal: currentClose > bbUpper ? 'bearish' : 'bullish',
    strength: clamp(Math.round(Math.abs((currentClose - bbUpper) / bbUpper) * 500), 0, 100),
  });
  results.push({
    name: 'Bollinger Middle',
    category: 'volatility',
    value: bbMiddle,
    signal: currentClose > bbMiddle ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((currentClose - bbMiddle) / bbMiddle) * 500), 0, 100),
  });
  results.push({
    name: 'Bollinger Lower',
    category: 'volatility',
    value: bbLower,
    signal: currentClose < bbLower ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((currentClose - bbLower) / bbLower) * 500), 0, 100),
  });
  results.push({
    name: 'Bollinger Width',
    category: 'volatility',
    value: bbWidth,
    signal: bbWidth < 5 ? 'neutral' : 'neutral',
    strength: clamp(Math.round(bbWidth * 5), 0, 100),
  });
  results.push({
    name: 'Bollinger %B',
    category: 'volatility',
    value: bbPctB,
    signal: bbPctB > 0.5 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(bbPctB - 0.5) * 200), 0, 100),
  });

  const atrVal = ATR(data);
  results.push({
    name: 'ATR(14)',
    category: 'volatility',
    value: atrVal,
    signal: 'neutral',
    strength: clamp(Math.round((atrVal / currentClose) * 500), 0, 100),
  });

  results.push({
    name: 'Keltner Upper',
    category: 'volatility',
    value: keltnerUpper(data),
    signal: currentClose > keltnerUpper(data) ? 'bullish' : 'neutral',
    strength: 50,
  });
  results.push({
    name: 'Keltner Middle',
    category: 'volatility',
    value: keltnerMiddle(data),
    signal: currentClose > keltnerMiddle(data) ? 'bullish' : 'bearish',
    strength: 50,
  });
  results.push({
    name: 'Keltner Lower',
    category: 'volatility',
    value: keltnerLower(data),
    signal: currentClose < keltnerLower(data) ? 'bearish' : 'neutral',
    strength: 50,
  });

  const dchUp = donchianUpper(data);
  const dchLo = donchianLower(data);
  const dchMid = donchianMiddle(data);
  results.push({ name: 'Donchian Upper', category: 'volatility', value: dchUp, signal: currentClose >= dchUp ? 'bullish' : 'neutral', strength: 60 });
  results.push({ name: 'Donchian Middle', category: 'volatility', value: dchMid, signal: currentClose > dchMid ? 'bullish' : 'bearish', strength: 50 });
  results.push({ name: 'Donchian Lower', category: 'volatility', value: dchLo, signal: currentClose <= dchLo ? 'bearish' : 'neutral', strength: 60 });

  results.push({ name: 'Std Deviation', category: 'volatility', value: standardDeviation(data), signal: 'neutral', strength: 50 });
  results.push({ name: 'Historical Volatility', category: 'volatility', value: historicalVolatility(data), signal: 'neutral', strength: 50 });
  results.push({ name: 'NATR', category: 'volatility', value: NATR(data), signal: 'neutral', strength: 50 });
  results.push({ name: 'True Range', category: 'volatility', value: trueRange(data), signal: 'neutral', strength: 50 });

  const ceLong = chandelierExitLong(data);
  results.push({
    name: 'Chandelier Exit Long',
    category: 'volatility',
    value: ceLong,
    signal: currentClose > ceLong ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((currentClose - ceLong) / currentClose) * 300), 0, 100),
  });

  const ceShort = chandelierExitShort(data);
  results.push({
    name: 'Chandelier Exit Short',
    category: 'volatility',
    value: ceShort,
    signal: currentClose < ceShort ? 'bearish' : 'bullish',
    strength: clamp(Math.round(Math.abs((currentClose - ceShort) / currentClose) * 300), 0, 100),
  });

  const pp = pivotPoint(data);
  results.push({ name: 'Pivot Point', category: 'volatility', value: pp, signal: currentClose > pp ? 'bullish' : 'bearish', strength: 50 });
  results.push({ name: 'Pivot R1', category: 'volatility', value: pivotR1(data), signal: currentClose > pivotR1(data) ? 'bullish' : 'neutral', strength: 50 });
  results.push({ name: 'Pivot R2', category: 'volatility', value: pivotR2(data), signal: currentClose > pivotR2(data) ? 'bullish' : 'neutral', strength: 50 });
  results.push({ name: 'Pivot S1', category: 'volatility', value: pivotS1(data), signal: currentClose < pivotS1(data) ? 'bearish' : 'neutral', strength: 50 });
  results.push({ name: 'Pivot S2', category: 'volatility', value: pivotS2(data), signal: currentClose < pivotS2(data) ? 'bearish' : 'neutral', strength: 50 });

  // ---- VOLUME INDICATORS ----
  const vwapVal = VWAP(data);
  results.push({
    name: 'VWAP',
    category: 'volume',
    value: vwapVal,
    signal: currentClose > vwapVal ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((currentClose - vwapVal) / vwapVal) * 500), 0, 100),
  });

  const obvVal = OBV(data);
  results.push({
    name: 'OBV',
    category: 'volume',
    value: obvVal,
    signal: obvVal > 0 ? 'bullish' : 'bearish',
    strength: 50,
  });

  const adVal = accumulationDistribution(data);
  results.push({
    name: 'Accumulation/Distribution',
    category: 'volume',
    value: adVal,
    signal: adVal > 0 ? 'bullish' : 'bearish',
    strength: 50,
  });

  const voVal = volumeOscillator(data);
  results.push({
    name: 'Volume Oscillator',
    category: 'volume',
    value: voVal,
    signal: voVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(voVal) * 2), 0, 100),
  });

  const pvtVal = PVT(data);
  results.push({
    name: 'PVT',
    category: 'volume',
    value: pvtVal,
    signal: pvtVal > 0 ? 'bullish' : 'bearish',
    strength: 50,
  });

  const nviVal = NVI(data);
  results.push({
    name: 'NVI',
    category: 'volume',
    value: nviVal,
    signal: nviVal > 1000 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(nviVal - 1000) / 10), 0, 100),
  });

  const pviVal = PVI(data);
  results.push({
    name: 'PVI',
    category: 'volume',
    value: pviVal,
    signal: pviVal > 1000 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(pviVal - 1000) / 10), 0, 100),
  });

  const efiVal = elderForceIndex(data);
  results.push({
    name: 'Elder Force Index',
    category: 'volume',
    value: efiVal,
    signal: efiVal > 0 ? 'bullish' : 'bearish',
    strength: 50,
  });

  const eomVal = EOM(data);
  results.push({
    name: 'Ease of Movement',
    category: 'volume',
    value: eomVal,
    signal: eomVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(eomVal) * 10), 0, 100),
  });

  const vwRSIVal = volumeWeightedRSI(data);
  results.push({
    name: 'Volume Weighted RSI',
    category: 'volume',
    value: vwRSIVal,
    signal: vwRSIVal > 50 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(vwRSIVal - 50) * 2), 0, 100),
  });

  const vpVal = volumeProfile(data);
  results.push({
    name: 'Volume Profile POC',
    category: 'volume',
    value: vpVal,
    signal: currentClose > vpVal ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((currentClose - vpVal) / vpVal) * 500), 0, 100),
  });

  results.push({
    name: 'Volume MA',
    category: 'volume',
    value: volumeMA(data),
    signal: 'neutral',
    strength: 50,
  });

  const rvVal = relativeVolume(data);
  results.push({
    name: 'Relative Volume',
    category: 'volume',
    value: rvVal,
    signal: rvVal > 1.5 ? 'bullish' : rvVal < 0.5 ? 'bearish' : 'neutral',
    strength: clamp(Math.round(Math.abs(rvVal - 1) * 50), 0, 100),
  });

  const vrocVal = volumeRateOfChange(data);
  results.push({
    name: 'Volume ROC',
    category: 'volume',
    value: vrocVal,
    signal: vrocVal > 0 ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs(vrocVal) / 2), 0, 100),
  });

  const mfvVal = moneyFlowVolume(data);
  results.push({
    name: 'Money Flow Volume',
    category: 'volume',
    value: mfvVal,
    signal: mfvVal > 0 ? 'bullish' : 'bearish',
    strength: 50,
  });

  // ---- STATISTICAL INDICATORS ----
  const fib236 = fibRetracement236(data);
  const fib382 = fibRetracement382(data);
  const fib500 = fibRetracement500(data);
  const fib618 = fibRetracement618(data);
  const fib786 = fibRetracement786(data);

  results.push({ name: 'Fib 23.6%', category: 'statistical', value: fib236, signal: currentClose > fib236 ? 'bullish' : 'bearish', strength: 50 });
  results.push({ name: 'Fib 38.2%', category: 'statistical', value: fib382, signal: currentClose > fib382 ? 'bullish' : 'bearish', strength: 50 });
  results.push({ name: 'Fib 50.0%', category: 'statistical', value: fib500, signal: currentClose > fib500 ? 'bullish' : 'bearish', strength: 50 });
  results.push({ name: 'Fib 61.8%', category: 'statistical', value: fib618, signal: currentClose > fib618 ? 'bullish' : 'bearish', strength: 50 });
  results.push({ name: 'Fib 78.6%', category: 'statistical', value: fib786, signal: currentClose > fib786 ? 'bullish' : 'bearish', strength: 50 });

  const r2Val = rSquared(data);
  results.push({
    name: 'R-Squared',
    category: 'statistical',
    value: r2Val,
    signal: r2Val > 0.5 ? (linearRegressionSlope(data) > 0 ? 'bullish' : 'bearish') : 'neutral',
    strength: clamp(Math.round(r2Val * 100), 0, 100),
  });

  const zVal = zScore(data);
  results.push({
    name: 'Z-Score',
    category: 'statistical',
    value: zVal,
    signal: zVal > 0 ? 'bullish' : zVal < 0 ? 'bearish' : 'neutral',
    strength: clamp(Math.round(Math.abs(zVal) * 30), 0, 100),
  });

  results.push({ name: 'Typical Price', category: 'statistical', value: typicalPrice(data), signal: 'neutral', strength: 50 });
  results.push({ name: 'Median Price', category: 'statistical', value: medianPrice(data), signal: 'neutral', strength: 50 });
  results.push({ name: 'Weighted Close', category: 'statistical', value: weightedClose(data), signal: 'neutral', strength: 50 });

  const haClose = heikinAshiClose(data);
  const haOpen = heikinAshiOpen(data);
  results.push({
    name: 'Heikin-Ashi Close',
    category: 'statistical',
    value: haClose,
    signal: haClose > haOpen ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((haClose - haOpen) / haOpen) * 1000), 0, 100),
  });
  results.push({
    name: 'Heikin-Ashi Open',
    category: 'statistical',
    value: haOpen,
    signal: haClose > haOpen ? 'bullish' : 'bearish',
    strength: clamp(Math.round(Math.abs((haClose - haOpen) / haOpen) * 1000), 0, 100),
  });
  results.push({
    name: 'Heikin-Ashi High',
    category: 'statistical',
    value: heikinAshiHigh(data),
    signal: 'neutral',
    strength: 50,
  });
  results.push({
    name: 'Heikin-Ashi Low',
    category: 'statistical',
    value: heikinAshiLow(data),
    signal: 'neutral',
    strength: 50,
  });
  results.push({
    name: 'Average Price',
    category: 'statistical',
    value: averagePrice(data),
    signal: currentClose > averagePrice(data) ? 'bullish' : 'bearish',
    strength: 50,
  });

  return results;
}
