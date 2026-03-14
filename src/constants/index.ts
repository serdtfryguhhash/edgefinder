import { PricingPlan, IndicatorCategory, Market, Timeframe } from "@/types";

export const APP_NAME = "EdgeFinder";
export const APP_DESCRIPTION = "Discover your trading edge with AI-powered backtesting and strategy optimization. Build, test, and deploy winning strategies across stocks, forex, crypto, and futures.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://edgefinder.io";

export const MARKETS: { value: Market; label: string; icon: string }[] = [
  { value: "stocks", label: "Stocks", icon: "📈" },
  { value: "forex", label: "Forex", icon: "💱" },
  { value: "crypto", label: "Crypto", icon: "₿" },
  { value: "futures", label: "Futures", icon: "📊" },
  { value: "options", label: "Options", icon: "⚡" },
  { value: "metals", label: "Metals", icon: "🥇" },
];

export const TIMEFRAMES: { value: Timeframe; label: string; shortLabel: string }[] = [
  { value: "1m", label: "1 Minute", shortLabel: "1m" },
  { value: "5m", label: "5 Minutes", shortLabel: "5m" },
  { value: "15m", label: "15 Minutes", shortLabel: "15m" },
  { value: "1h", label: "1 Hour", shortLabel: "1H" },
  { value: "4h", label: "4 Hours", shortLabel: "4H" },
  { value: "1d", label: "Daily", shortLabel: "1D" },
  { value: "1w", label: "Weekly", shortLabel: "1W" },
  { value: "1M", label: "Monthly", shortLabel: "1M" },
];

export const INDICATOR_CATEGORIES: { value: IndicatorCategory; label: string; description: string; count: number }[] = [
  { value: "trend", label: "Trend", description: "Identify market direction and trend strength", count: 28 },
  { value: "momentum", label: "Momentum", description: "Measure speed of price changes", count: 25 },
  { value: "volatility", label: "Volatility", description: "Assess market volatility and risk", count: 23 },
  { value: "volume", label: "Volume", description: "Analyze trading volume patterns", count: 15 },
  { value: "statistical", label: "Statistical", description: "Statistical analysis tools", count: 15 },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    price_monthly: 0,
    price_annual: 0,
    stripe_monthly_price_id: "",
    stripe_annual_price_id: "",
    highlighted: false,
    cta: "Get Started Free",
    features: [
      "3 active strategies",
      "5 backtests per day",
      "2 years of historical data",
      "50+ basic indicators",
      "CSV export only",
      "Community access",
      "Email support",
    ],
    limits: {
      strategies: 3,
      backtests_per_day: 5,
      historical_data_years: 2,
      indicators: 50,
      export_formats: ["csv"],
      api_access: false,
      priority_support: false,
      custom_indicators: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    tier: "pro",
    price_monthly: 29,
    price_annual: 290,
    stripe_monthly_price_id: "price_pro_monthly",
    stripe_annual_price_id: "price_pro_annual",
    highlighted: true,
    cta: "Start Pro Trial",
    features: [
      "25 active strategies",
      "50 backtests per day",
      "10 years of historical data",
      "150+ indicators",
      "PDF, CSV & JSON export",
      "Strategy cloning",
      "Leaderboard access",
      "Priority email support",
    ],
    limits: {
      strategies: 25,
      backtests_per_day: 50,
      historical_data_years: 10,
      indicators: 150,
      export_formats: ["pdf", "csv", "json"],
      api_access: false,
      priority_support: true,
      custom_indicators: false,
    },
  },
  {
    id: "elite",
    name: "Elite",
    tier: "elite",
    price_monthly: 79,
    price_annual: 790,
    stripe_monthly_price_id: "price_elite_monthly",
    stripe_annual_price_id: "price_elite_annual",
    highlighted: false,
    cta: "Go Elite",
    features: [
      "Unlimited strategies",
      "Unlimited backtests",
      "20+ years of historical data",
      "200+ indicators + custom",
      "All export formats",
      "API access",
      "Custom indicators builder",
      "Strategy marketplace",
      "1-on-1 strategy review",
      "Dedicated Slack channel",
    ],
    limits: {
      strategies: 999,
      backtests_per_day: 999,
      historical_data_years: 20,
      indicators: 200,
      export_formats: ["pdf", "csv", "json"],
      api_access: true,
      priority_support: true,
      custom_indicators: true,
    },
  },
];

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Strategies", href: "/strategies", icon: "GitBranch" },
  { label: "Indicators", href: "/indicators", icon: "Activity" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Referrals", href: "/referrals", icon: "Users" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export const LANDING_NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Try Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Indicators", href: "/indicators" },
    { label: "API Docs", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "/docs" },
    { label: "Strategy Guides", href: "/blog?category=strategy" },
    { label: "Video Tutorials", href: "/tutorials" },
    { label: "Community", href: "/community" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Affiliate Program", href: "/referrals" },
    { label: "Contact", href: "/contact" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Risk Disclaimer", href: "/disclaimer" },
  ],
};

export const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Quantitative Trader",
    company: "Apex Capital",
    avatar: "/avatars/marcus.jpg",
    content: "EdgeFinder transformed how I validate trading hypotheses. What used to take weeks of Python scripting now takes minutes. The backtesting engine is remarkably accurate.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Portfolio Manager",
    company: "Meridian Investments",
    avatar: "/avatars/sarah.jpg",
    content: "The indicator library is comprehensive and the strategy builder is intuitive. I've discovered three new edges in markets I thought were fully efficient. Game changer.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Independent Trader",
    company: "Self-employed",
    avatar: "/avatars/david.jpg",
    content: "As someone who codes in Python, I was skeptical of visual strategy builders. EdgeFinder proved me wrong. The drag-and-drop interface is powerful without sacrificing flexibility.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Crypto Fund Manager",
    company: "Luna Digital Assets",
    avatar: "/avatars/elena.jpg",
    content: "The crypto backtesting capabilities are unmatched. Being able to test across multiple exchanges and timeframes simultaneously saved our fund significant capital.",
    rating: 5,
  },
  {
    name: "James Wright",
    role: "Forex Trader",
    company: "Wright Trading LLC",
    avatar: "/avatars/james.jpg",
    content: "I've used a dozen backtesting platforms. EdgeFinder's combination of speed, accuracy, and the community leaderboard makes it the clear winner. Worth every penny.",
    rating: 5,
  },
  {
    name: "Aiko Tanaka",
    role: "Algorithmic Trader",
    company: "Tanaka Systems",
    avatar: "/avatars/aiko.jpg",
    content: "The Sharpe ratio of my portfolio improved by 0.8 after using EdgeFinder to optimize entry timing. The statistical tools are exactly what serious traders need.",
    rating: 5,
  },
];

export const STATS = [
  { label: "Active Traders", value: "12,847", suffix: "+" },
  { label: "Strategies Tested", value: "2.3M", suffix: "+" },
  { label: "Backtests Run", value: "18.7M", suffix: "" },
  { label: "Avg. Edge Found", value: "4.2", suffix: "%" },
];

export const FEATURES = [
  {
    title: "Visual Strategy Builder",
    description: "Build complex trading strategies without writing a single line of code. Our drag-and-drop interface supports 200+ indicators with real-time previews.",
    icon: "Blocks",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Lightning-Fast Backtesting",
    description: "Run backtests across decades of historical data in seconds. Our distributed computing engine processes millions of candles with institutional-grade accuracy.",
    icon: "Zap",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "200+ Indicators",
    description: "From classic moving averages to cutting-edge machine learning oscillators. Every indicator is optimized for speed and comes with detailed documentation.",
    icon: "Activity",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Community Leaderboard",
    description: "Publish your strategies, climb the rankings, and clone top-performing strategies from the community. Learn from the best traders worldwide.",
    icon: "Trophy",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Advanced Risk Management",
    description: "Built-in position sizing, stop-loss optimization, and drawdown analysis. Never risk more than you should with our comprehensive risk tools.",
    icon: "Shield",
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Multi-Market Support",
    description: "Backtest across stocks, forex, crypto, futures, and options. One platform for all your markets with unified data and analytics.",
    icon: "Globe",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const SAMPLE_EQUITY_CURVE: { timestamp: string; equity: number; drawdown: number; benchmark: number }[] = Array.from(
  { length: 252 },
  (_, i) => {
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + i);
    const noise = Math.sin(i * 0.1) * 2000 + Math.random() * 1500;
    const trend = i * 80;
    const equity = 100000 + trend + noise;
    const benchmarkNoise = Math.sin(i * 0.08) * 1500 + Math.random() * 1000;
    const benchmarkTrend = i * 40;
    const benchmark = 100000 + benchmarkTrend + benchmarkNoise;
    const peak = Math.max(...Array.from({ length: i + 1 }, (_, j) => {
      const n = Math.sin(j * 0.1) * 2000 + 1000;
      return 100000 + j * 80 + n;
    }));
    const drawdown = ((equity - peak) / peak) * 100;
    return {
      timestamp: date.toISOString().split("T")[0],
      equity: Math.round(equity),
      drawdown: Math.round(drawdown * 100) / 100,
      benchmark: Math.round(benchmark),
    };
  }
);

export const SAMPLE_TRADES = [
  { id: "1", entry_date: "2024-01-15", exit_date: "2024-01-22", direction: "long" as const, entry_price: 185.50, exit_price: 192.30, quantity: 100, pnl: 680, pnl_pct: 3.67, fees: 2.00, exit_reason: "take_profit" as const, holding_period: "7d" },
  { id: "2", entry_date: "2024-01-25", exit_date: "2024-01-29", direction: "short" as const, entry_price: 191.80, exit_price: 188.20, quantity: 100, pnl: 360, pnl_pct: 1.88, fees: 2.00, exit_reason: "signal" as const, holding_period: "4d" },
  { id: "3", entry_date: "2024-02-05", exit_date: "2024-02-08", direction: "long" as const, entry_price: 189.40, exit_price: 187.10, quantity: 100, pnl: -230, pnl_pct: -1.21, fees: 2.00, exit_reason: "stop_loss" as const, holding_period: "3d" },
  { id: "4", entry_date: "2024-02-12", exit_date: "2024-02-20", direction: "long" as const, entry_price: 188.60, exit_price: 196.40, quantity: 100, pnl: 780, pnl_pct: 4.14, fees: 2.00, exit_reason: "take_profit" as const, holding_period: "8d" },
  { id: "5", entry_date: "2024-02-26", exit_date: "2024-03-01", direction: "short" as const, entry_price: 195.80, exit_price: 197.20, quantity: 100, pnl: -140, pnl_pct: -0.71, fees: 2.00, exit_reason: "stop_loss" as const, holding_period: "4d" },
  { id: "6", entry_date: "2024-03-05", exit_date: "2024-03-14", direction: "long" as const, entry_price: 193.20, exit_price: 201.50, quantity: 100, pnl: 830, pnl_pct: 4.30, fees: 2.00, exit_reason: "take_profit" as const, holding_period: "9d" },
  { id: "7", entry_date: "2024-03-18", exit_date: "2024-03-22", direction: "long" as const, entry_price: 200.80, exit_price: 198.40, quantity: 100, pnl: -240, pnl_pct: -1.19, fees: 2.00, exit_reason: "stop_loss" as const, holding_period: "4d" },
  { id: "8", entry_date: "2024-03-25", exit_date: "2024-04-02", direction: "long" as const, entry_price: 199.10, exit_price: 207.30, quantity: 100, pnl: 820, pnl_pct: 4.12, fees: 2.00, exit_reason: "take_profit" as const, holding_period: "8d" },
];

export const SAMPLE_BACKTEST_RESULTS = {
  total_return: 20160,
  total_return_pct: 20.16,
  annualized_return: 24.8,
  max_drawdown: -8420,
  max_drawdown_pct: -7.2,
  sharpe_ratio: 1.85,
  sortino_ratio: 2.41,
  calmar_ratio: 3.44,
  win_rate: 62.5,
  profit_factor: 2.18,
  total_trades: 156,
  winning_trades: 98,
  losing_trades: 58,
  avg_win: 420,
  avg_loss: -195,
  avg_win_pct: 2.85,
  avg_loss_pct: -1.12,
  largest_win: 2840,
  largest_loss: -890,
  avg_holding_period: "5.2 days",
  max_consecutive_wins: 8,
  max_consecutive_losses: 4,
  expectancy: 56.8,
  recovery_factor: 2.39,
  ulcer_index: 3.2,
  final_equity: 120160,
  total_fees: 312,
  benchmark_return: 12.4,
  alpha: 7.8,
  beta: 0.72,
  volatility: 14.2,
  monthly_returns: [
    { year: 2024, month: 1, return_pct: 2.8 },
    { year: 2024, month: 2, return_pct: 1.4 },
    { year: 2024, month: 3, return_pct: 3.2 },
    { year: 2024, month: 4, return_pct: -0.8 },
    { year: 2024, month: 5, return_pct: 2.1 },
    { year: 2024, month: 6, return_pct: 1.9 },
    { year: 2024, month: 7, return_pct: -1.2 },
    { year: 2024, month: 8, return_pct: 3.5 },
    { year: 2024, month: 9, return_pct: 2.7 },
    { year: 2024, month: 10, return_pct: 1.8 },
    { year: 2024, month: 11, return_pct: -0.5 },
    { year: 2024, month: 12, return_pct: 3.3 },
  ],
};

export const ALL_INDICATORS = [
  // ===== TREND (28) =====
  { id: "sma", name: "Simple Moving Average", short_name: "SMA", category: "trend", description: "Calculates the arithmetic mean of a given set of prices over a specific number of periods.", overlay: true, is_premium: false, usage_count: "45.2K" },
  { id: "ema", name: "Exponential Moving Average", short_name: "EMA", category: "trend", description: "A weighted moving average that gives more importance to recent price data.", overlay: true, is_premium: false, usage_count: "42.1K" },
  { id: "wma", name: "Weighted Moving Average", short_name: "WMA", category: "trend", description: "A moving average that assigns linearly increasing weights to more recent data points.", overlay: true, is_premium: false, usage_count: "28.4K" },
  { id: "dema", name: "Double Exponential Moving Average", short_name: "DEMA", category: "trend", description: "Reduces lag by applying EMA twice, providing faster response to price changes.", overlay: true, is_premium: false, usage_count: "19.8K" },
  { id: "tema", name: "Triple Exponential Moving Average", short_name: "TEMA", category: "trend", description: "Further reduces lag by applying EMA three times for ultra-responsive trend detection.", overlay: true, is_premium: false, usage_count: "18.3K" },
  { id: "kama", name: "Kaufman Adaptive Moving Average", short_name: "KAMA", category: "trend", description: "Adapts to market volatility by adjusting smoothing based on efficiency ratio.", overlay: true, is_premium: false, usage_count: "15.7K" },
  { id: "hma", name: "Hull Moving Average", short_name: "HMA", category: "trend", description: "Eliminates lag almost entirely while maintaining smooth curve using weighted calculations.", overlay: true, is_premium: false, usage_count: "22.6K" },
  { id: "vwma", name: "Volume Weighted Moving Average", short_name: "VWMA", category: "trend", description: "A moving average weighted by volume, giving more weight to high-volume periods.", overlay: true, is_premium: false, usage_count: "20.1K" },
  { id: "zlema", name: "Zero Lag EMA", short_name: "ZLEMA", category: "trend", description: "Modified EMA that eliminates lag by de-trending data before applying exponential smoothing.", overlay: true, is_premium: false, usage_count: "14.2K" },
  { id: "mcginley", name: "McGinley Dynamic", short_name: "MGD", category: "trend", description: "Self-adjusting moving average that automatically adjusts speed based on market conditions.", overlay: true, is_premium: false, usage_count: "11.8K" },
  { id: "adx", name: "Average Directional Index", short_name: "ADX", category: "trend", description: "Measures trend strength regardless of direction. Values above 25 indicate strong trends.", overlay: false, is_premium: false, usage_count: "38.7K" },
  { id: "plus_di", name: "Positive Directional Indicator", short_name: "+DI", category: "trend", description: "Measures upward price movement strength as part of the directional movement system.", overlay: false, is_premium: false, usage_count: "24.3K" },
  { id: "minus_di", name: "Negative Directional Indicator", short_name: "-DI", category: "trend", description: "Measures downward price movement strength as part of the directional movement system.", overlay: false, is_premium: false, usage_count: "24.1K" },
  { id: "aroon_up", name: "Aroon Up", short_name: "AROON-U", category: "trend", description: "Measures time since highest high to identify emerging uptrends and trend strength.", overlay: false, is_premium: false, usage_count: "16.5K" },
  { id: "aroon_down", name: "Aroon Down", short_name: "AROON-D", category: "trend", description: "Measures time since lowest low to identify emerging downtrends and trend weakness.", overlay: false, is_premium: false, usage_count: "16.3K" },
  { id: "psar", name: "Parabolic SAR", short_name: "PSAR", category: "trend", description: "Provides potential entry and exit points. Dots above price suggest downtrend, below suggest uptrend.", overlay: true, is_premium: false, usage_count: "32.5K" },
  { id: "supertrend", name: "Supertrend", short_name: "ST", category: "trend", description: "A trend-following indicator that uses ATR to determine trend direction and support/resistance.", overlay: true, is_premium: false, usage_count: "29.8K" },
  { id: "ichimoku_tenkan", name: "Ichimoku Tenkan-sen", short_name: "TENKAN", category: "trend", description: "The conversion line calculated as the midpoint of the highest high and lowest low over 9 periods.", overlay: true, is_premium: false, usage_count: "21.4K" },
  { id: "ichimoku_kijun", name: "Ichimoku Kijun-sen", short_name: "KIJUN", category: "trend", description: "The base line calculated as the midpoint of the highest high and lowest low over 26 periods.", overlay: true, is_premium: false, usage_count: "20.9K" },
  { id: "ichimoku_senkou_a", name: "Ichimoku Senkou Span A", short_name: "SENKOU-A", category: "trend", description: "The leading span A, calculated as the average of Tenkan-sen and Kijun-sen, plotted 26 periods ahead.", overlay: true, is_premium: false, usage_count: "19.2K" },
  { id: "ichimoku_senkou_b", name: "Ichimoku Senkou Span B", short_name: "SENKOU-B", category: "trend", description: "The leading span B, midpoint of the highest high and lowest low over 52 periods, plotted 26 ahead.", overlay: true, is_premium: false, usage_count: "19.0K" },
  { id: "ichimoku_chikou", name: "Ichimoku Chikou Span", short_name: "CHIKOU", category: "trend", description: "The lagging span, current closing price plotted 26 periods back for confirmation.", overlay: true, is_premium: false, usage_count: "17.6K" },
  { id: "linreg", name: "Linear Regression", short_name: "LINREG", category: "trend", description: "Fits a straight line to price data using least squares method to identify trend direction.", overlay: true, is_premium: false, usage_count: "13.9K" },
  { id: "linreg_slope", name: "Linear Regression Slope", short_name: "SLOPE", category: "trend", description: "The slope of the linear regression line indicating rate and direction of price change.", overlay: false, is_premium: false, usage_count: "12.1K" },
  { id: "linreg_angle", name: "Linear Regression Angle", short_name: "ANGLE", category: "trend", description: "Converts regression slope to an angle in degrees for intuitive trend strength assessment.", overlay: false, is_premium: false, usage_count: "10.5K" },
  { id: "t3", name: "T3 Moving Average", short_name: "T3", category: "trend", description: "Tillson T3 moving average offering smooth response with minimal lag through volume factor.", overlay: true, is_premium: false, usage_count: "9.8K" },
  { id: "frama", name: "Fractal Adaptive Moving Average", short_name: "FRAMA", category: "trend", description: "Adapts smoothing based on fractal dimension of price action for intelligent responsiveness.", overlay: true, is_premium: false, usage_count: "8.4K" },
  { id: "triple_ema", name: "Triple EMA", short_name: "TRIX-MA", category: "trend", description: "Triple application of exponential smoothing filtering out insignificant price movements.", overlay: true, is_premium: false, usage_count: "7.9K" },

  // ===== MOMENTUM (25) =====
  { id: "rsi", name: "Relative Strength Index", short_name: "RSI", category: "momentum", description: "Measures the speed and magnitude of recent price changes to evaluate overbought/oversold conditions.", overlay: false, is_premium: false, usage_count: "48.9K" },
  { id: "macd", name: "MACD", short_name: "MACD", category: "momentum", description: "Shows the relationship between two moving averages and generates crossover signals for trend changes.", overlay: false, is_premium: false, usage_count: "46.7K" },
  { id: "macd_signal", name: "MACD Signal Line", short_name: "MACD-S", category: "momentum", description: "The 9-period EMA of the MACD line used to generate buy/sell crossover signals.", overlay: false, is_premium: false, usage_count: "40.2K" },
  { id: "macd_hist", name: "MACD Histogram", short_name: "MACD-H", category: "momentum", description: "Visualizes the difference between MACD and signal line to identify momentum shifts.", overlay: false, is_premium: false, usage_count: "38.5K" },
  { id: "stoch_k", name: "Stochastic %K", short_name: "%K", category: "momentum", description: "Compares closing price to price range over a period to identify momentum and turning points.", overlay: false, is_premium: false, usage_count: "35.6K" },
  { id: "stoch_d", name: "Stochastic %D", short_name: "%D", category: "momentum", description: "The 3-period SMA of %K providing a smoothed signal line for crossover trading.", overlay: false, is_premium: false, usage_count: "34.8K" },
  { id: "stochrsi", name: "Stochastic RSI", short_name: "SRSI", category: "momentum", description: "Applies the Stochastic formula to RSI values for more sensitive overbought/oversold signals.", overlay: false, is_premium: false, usage_count: "30.4K" },
  { id: "cci", name: "Commodity Channel Index", short_name: "CCI", category: "momentum", description: "Measures deviation from the statistical mean, identifying cyclical trends and extremes.", overlay: false, is_premium: false, usage_count: "27.3K" },
  { id: "williams_r", name: "Williams %R", short_name: "W%R", category: "momentum", description: "A momentum oscillator measuring overbought/oversold levels relative to the high-low range.", overlay: false, is_premium: false, usage_count: "25.1K" },
  { id: "roc", name: "Rate of Change", short_name: "ROC", category: "momentum", description: "Measures percentage change in price over a specified number of periods.", overlay: false, is_premium: false, usage_count: "22.8K" },
  { id: "momentum", name: "Momentum", short_name: "MOM", category: "momentum", description: "The absolute difference between current price and price n periods ago.", overlay: false, is_premium: false, usage_count: "21.5K" },
  { id: "tsi", name: "True Strength Index", short_name: "TSI", category: "momentum", description: "Double-smoothed momentum oscillator that captures trend direction and overbought/oversold.", overlay: false, is_premium: false, usage_count: "14.7K" },
  { id: "uo", name: "Ultimate Oscillator", short_name: "UO", category: "momentum", description: "Combines short, medium, and long-term momentum into one oscillator reducing false divergences.", overlay: false, is_premium: false, usage_count: "13.2K" },
  { id: "ao", name: "Awesome Oscillator", short_name: "AO", category: "momentum", description: "Measures market momentum using the difference between 5 and 34-period simple moving averages.", overlay: false, is_premium: false, usage_count: "18.6K" },
  { id: "ppo", name: "Percentage Price Oscillator", short_name: "PPO", category: "momentum", description: "Shows percentage difference between two EMAs, normalizing MACD for cross-security comparison.", overlay: false, is_premium: false, usage_count: "11.4K" },
  { id: "coppock", name: "Coppock Curve", short_name: "COPP", category: "momentum", description: "Long-term momentum indicator designed to identify major market bottoms and buying opportunities.", overlay: false, is_premium: false, usage_count: "8.9K" },
  { id: "dpo", name: "Detrended Price Oscillator", short_name: "DPO", category: "momentum", description: "Removes trend from price to identify cycles and overbought/oversold levels.", overlay: false, is_premium: false, usage_count: "9.7K" },
  { id: "kst", name: "Know Sure Thing", short_name: "KST", category: "momentum", description: "Weighted sum of four smoothed ROC values to identify major trend cycles.", overlay: false, is_premium: false, usage_count: "7.8K" },
  { id: "kst_signal", name: "KST Signal Line", short_name: "KST-S", category: "momentum", description: "Signal line for KST oscillator used to generate crossover buy/sell signals.", overlay: false, is_premium: false, usage_count: "7.2K" },
  { id: "trix", name: "TRIX", short_name: "TRIX", category: "momentum", description: "Rate of change of a triple-smoothed EMA filtering insignificant price movements.", overlay: false, is_premium: false, usage_count: "10.3K" },
  { id: "elder_bull", name: "Elder Ray Bull Power", short_name: "BULL", category: "momentum", description: "Measures buying pressure as the difference between high and EMA.", overlay: false, is_premium: false, usage_count: "9.1K" },
  { id: "elder_bear", name: "Elder Ray Bear Power", short_name: "BEAR", category: "momentum", description: "Measures selling pressure as the difference between low and EMA.", overlay: false, is_premium: false, usage_count: "8.8K" },
  { id: "cmf", name: "Chaikin Money Flow", short_name: "CMF", category: "momentum", description: "Measures accumulation/distribution over a period using volume-weighted close location value.", overlay: false, is_premium: false, usage_count: "16.9K" },
  { id: "mfi", name: "Money Flow Index", short_name: "MFI", category: "momentum", description: "A volume-weighted RSI that measures buying and selling pressure using price and volume.", overlay: false, is_premium: false, usage_count: "19.4K" },
  { id: "force_index", name: "Force Index", short_name: "FI", category: "momentum", description: "Combines price change and volume to measure the power behind price movements.", overlay: false, is_premium: false, usage_count: "12.6K" },

  // ===== VOLATILITY (23) =====
  { id: "bb_upper", name: "Bollinger Upper Band", short_name: "BB-U", category: "volatility", description: "Upper band plotted 2 standard deviations above the moving average indicating resistance.", overlay: true, is_premium: false, usage_count: "41.3K" },
  { id: "bb_middle", name: "Bollinger Middle Band", short_name: "BB-M", category: "volatility", description: "The 20-period simple moving average serving as the center of Bollinger Bands.", overlay: true, is_premium: false, usage_count: "40.8K" },
  { id: "bb_lower", name: "Bollinger Lower Band", short_name: "BB-L", category: "volatility", description: "Lower band plotted 2 standard deviations below the moving average indicating support.", overlay: true, is_premium: false, usage_count: "40.5K" },
  { id: "bb_width", name: "Bollinger Band Width", short_name: "BBW", category: "volatility", description: "Measures the percentage difference between upper and lower bands to quantify volatility.", overlay: false, is_premium: false, usage_count: "26.7K" },
  { id: "bb_pctb", name: "Bollinger %B", short_name: "%B", category: "volatility", description: "Shows where price falls relative to the bands. Values above 1 or below 0 indicate extremes.", overlay: false, is_premium: false, usage_count: "25.4K" },
  { id: "atr", name: "Average True Range", short_name: "ATR", category: "volatility", description: "Measures market volatility by decomposing the entire range of an asset price for a period.", overlay: false, is_premium: false, usage_count: "39.2K" },
  { id: "kc_upper", name: "Keltner Upper Channel", short_name: "KC-U", category: "volatility", description: "Upper channel line based on EMA plus ATR multiplier for dynamic resistance.", overlay: true, is_premium: false, usage_count: "18.9K" },
  { id: "kc_middle", name: "Keltner Middle Channel", short_name: "KC-M", category: "volatility", description: "The center EMA line of Keltner Channels representing the average trend.", overlay: true, is_premium: false, usage_count: "18.5K" },
  { id: "kc_lower", name: "Keltner Lower Channel", short_name: "KC-L", category: "volatility", description: "Lower channel line based on EMA minus ATR multiplier for dynamic support.", overlay: true, is_premium: false, usage_count: "18.3K" },
  { id: "dc_upper", name: "Donchian Upper Channel", short_name: "DC-U", category: "volatility", description: "The highest high over N periods forming a breakout resistance level.", overlay: true, is_premium: false, usage_count: "15.6K" },
  { id: "dc_middle", name: "Donchian Middle Channel", short_name: "DC-M", category: "volatility", description: "The midpoint between upper and lower Donchian channels.", overlay: true, is_premium: false, usage_count: "14.8K" },
  { id: "dc_lower", name: "Donchian Lower Channel", short_name: "DC-L", category: "volatility", description: "The lowest low over N periods forming a breakout support level.", overlay: true, is_premium: true, usage_count: "14.5K" },
  { id: "stddev", name: "Standard Deviation", short_name: "STDEV", category: "volatility", description: "Statistical measure of price dispersion from the mean, quantifying volatility.", overlay: false, is_premium: true, usage_count: "17.2K" },
  { id: "hist_vol", name: "Historical Volatility", short_name: "HV", category: "volatility", description: "Annualized standard deviation of log returns measuring realized price volatility.", overlay: false, is_premium: true, usage_count: "16.1K" },
  { id: "natr", name: "Normalized ATR", short_name: "NATR", category: "volatility", description: "ATR expressed as a percentage of closing price for cross-security volatility comparison.", overlay: false, is_premium: true, usage_count: "13.4K" },
  { id: "true_range", name: "True Range", short_name: "TR", category: "volatility", description: "The greatest of current high-low, abs(high-previous close), or abs(low-previous close).", overlay: false, is_premium: true, usage_count: "20.3K" },
  { id: "chandelier_long", name: "Chandelier Exit Long", short_name: "CE-L", category: "volatility", description: "ATR-based trailing stop set below highest high for managing long position exits.", overlay: true, is_premium: true, usage_count: "11.7K" },
  { id: "chandelier_short", name: "Chandelier Exit Short", short_name: "CE-S", category: "volatility", description: "ATR-based trailing stop set above lowest low for managing short position exits.", overlay: true, is_premium: true, usage_count: "11.2K" },
  { id: "pivot_point", name: "Pivot Point", short_name: "PP", category: "volatility", description: "Central pivot calculated from previous high, low, and close for support/resistance analysis.", overlay: true, is_premium: true, usage_count: "23.8K" },
  { id: "pivot_r1", name: "Pivot Resistance 1", short_name: "R1", category: "volatility", description: "First resistance level derived from pivot point calculations.", overlay: true, is_premium: true, usage_count: "22.1K" },
  { id: "pivot_r2", name: "Pivot Resistance 2", short_name: "R2", category: "volatility", description: "Second resistance level providing extended upside price targets.", overlay: true, is_premium: true, usage_count: "21.3K" },
  { id: "pivot_s1", name: "Pivot Support 1", short_name: "S1", category: "volatility", description: "First support level derived from pivot point calculations.", overlay: true, is_premium: true, usage_count: "21.9K" },
  { id: "pivot_s2", name: "Pivot Support 2", short_name: "S2", category: "volatility", description: "Second support level providing extended downside price targets.", overlay: true, is_premium: true, usage_count: "20.7K" },

  // ===== VOLUME (15) =====
  { id: "vwap", name: "Volume Weighted Average Price", short_name: "VWAP", category: "volume", description: "The ratio of value traded to total volume traded. A benchmark for institutional traders.", overlay: true, is_premium: false, usage_count: "37.4K" },
  { id: "obv", name: "On-Balance Volume", short_name: "OBV", category: "volume", description: "Cumulative volume indicator that adds volume on up days and subtracts on down days.", overlay: false, is_premium: false, usage_count: "28.2K" },
  { id: "ad", name: "Accumulation/Distribution", short_name: "A/D", category: "volume", description: "Measures cumulative money flow using close location value weighted by volume.", overlay: false, is_premium: true, usage_count: "22.7K" },
  { id: "vol_osc", name: "Volume Oscillator", short_name: "VO", category: "volume", description: "Difference between two volume moving averages expressed as a percentage.", overlay: false, is_premium: true, usage_count: "14.3K" },
  { id: "pvt", name: "Price Volume Trend", short_name: "PVT", category: "volume", description: "Cumulative volume adjusted by the percentage change in closing price.", overlay: false, is_premium: true, usage_count: "12.8K" },
  { id: "nvi", name: "Negative Volume Index", short_name: "NVI", category: "volume", description: "Tracks price changes on days when volume decreases from the previous day.", overlay: false, is_premium: true, usage_count: "8.6K" },
  { id: "pvi", name: "Positive Volume Index", short_name: "PVI", category: "volume", description: "Tracks price changes on days when volume increases from the previous day.", overlay: false, is_premium: true, usage_count: "8.3K" },
  { id: "efi", name: "Elder Force Index", short_name: "EFI", category: "volume", description: "Combines price direction and volume magnitude to measure the force behind price moves.", overlay: false, is_premium: true, usage_count: "10.9K" },
  { id: "eom", name: "Ease of Movement", short_name: "EOM", category: "volume", description: "Relates price change to volume to show how easily price moves up or down.", overlay: false, is_premium: true, usage_count: "9.4K" },
  { id: "vol_ma", name: "Volume Moving Average", short_name: "VOL-MA", category: "volume", description: "Simple moving average of volume used to identify above or below average activity.", overlay: false, is_premium: true, usage_count: "19.7K" },
  { id: "rvol", name: "Relative Volume", short_name: "RVOL", category: "volume", description: "Current volume compared to average volume as a ratio for identifying unusual activity.", overlay: false, is_premium: true, usage_count: "16.8K" },
  { id: "vol_roc", name: "Volume Rate of Change", short_name: "VROC", category: "volume", description: "Percentage change in volume over a specified period for trend confirmation.", overlay: false, is_premium: true, usage_count: "11.5K" },
  { id: "mfv", name: "Money Flow Volume", short_name: "MFV", category: "volume", description: "Volume multiplied by the close location value showing directional volume flow.", overlay: false, is_premium: true, usage_count: "10.2K" },
  { id: "vol_profile", name: "Volume Profile", short_name: "VP", category: "volume", description: "Displays volume traded at each price level over a specified time period.", overlay: true, is_premium: true, usage_count: "24.5K" },
  { id: "vwma_vol", name: "VWMA Volume", short_name: "VWMA-V", category: "volume", description: "Volume-weighted moving average applied to volume data for smoothed volume analysis.", overlay: false, is_premium: true, usage_count: "7.6K" },

  // ===== STATISTICAL (15) =====
  { id: "r_squared", name: "R-Squared", short_name: "R2", category: "statistical", description: "Measures the percentage of price movement explained by linear regression trend.", overlay: false, is_premium: true, usage_count: "12.4K" },
  { id: "z_score", name: "Z-Score", short_name: "ZSCORE", category: "statistical", description: "Measures how many standard deviations price is from the mean for statistical analysis.", overlay: false, is_premium: true, usage_count: "14.8K" },
  { id: "typical_price", name: "Typical Price", short_name: "TP", category: "statistical", description: "The average of high, low, and close providing a single representative price.", overlay: true, is_premium: true, usage_count: "11.3K" },
  { id: "median_price", name: "Median Price", short_name: "MP", category: "statistical", description: "The midpoint between high and low prices for a simplified price representation.", overlay: true, is_premium: true, usage_count: "10.7K" },
  { id: "weighted_close", name: "Weighted Close", short_name: "WC", category: "statistical", description: "Close-weighted average giving double weight to closing price in the HLC calculation.", overlay: true, is_premium: true, usage_count: "9.2K" },
  { id: "avg_price", name: "Average Price", short_name: "AVGP", category: "statistical", description: "The average of open, high, low, and close for a balanced price representation.", overlay: true, is_premium: true, usage_count: "10.1K" },
  { id: "ha_open", name: "Heikin-Ashi Open", short_name: "HA-O", category: "statistical", description: "Modified open price using averaged values to smooth price action and reduce noise.", overlay: true, is_premium: true, usage_count: "15.6K" },
  { id: "ha_high", name: "Heikin-Ashi High", short_name: "HA-H", category: "statistical", description: "The maximum of high, HA open, or HA close for smoothed volatility representation.", overlay: true, is_premium: true, usage_count: "14.9K" },
  { id: "ha_low", name: "Heikin-Ashi Low", short_name: "HA-L", category: "statistical", description: "The minimum of low, HA open, or HA close for smoothed support identification.", overlay: true, is_premium: true, usage_count: "14.7K" },
  { id: "ha_close", name: "Heikin-Ashi Close", short_name: "HA-C", category: "statistical", description: "Average of open, high, low, and close creating smoothed candlestick representation.", overlay: true, is_premium: true, usage_count: "15.8K" },
  { id: "fib_236", name: "Fibonacci 23.6%", short_name: "FIB-23.6", category: "statistical", description: "The shallowest Fibonacci retracement level often acting as initial pullback support.", overlay: true, is_premium: true, usage_count: "19.3K" },
  { id: "fib_382", name: "Fibonacci 38.2%", short_name: "FIB-38.2", category: "statistical", description: "Key Fibonacci level frequently acting as support in strong trending markets.", overlay: true, is_premium: true, usage_count: "21.7K" },
  { id: "fib_500", name: "Fibonacci 50%", short_name: "FIB-50", category: "statistical", description: "The midpoint retracement level widely watched for trend continuation setups.", overlay: true, is_premium: true, usage_count: "23.4K" },
  { id: "fib_618", name: "Fibonacci 61.8%", short_name: "FIB-61.8", category: "statistical", description: "The golden ratio retracement level, the most significant Fibonacci support/resistance.", overlay: true, is_premium: true, usage_count: "24.9K" },
  { id: "fib_786", name: "Fibonacci 78.6%", short_name: "FIB-78.6", category: "statistical", description: "The deepest common retracement level indicating potential last line of support.", overlay: true, is_premium: true, usage_count: "16.2K" },
];

export const SAMPLE_LEADERBOARD: {
  rank: number;
  strategy_name: string;
  author_name: string;
  total_return_pct: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  clone_count: number;
  market: Market;
}[] = [
  { rank: 1, strategy_name: "Momentum Alpha v3", author_name: "Marcus Chen", total_return_pct: 48.2, sharpe_ratio: 2.84, max_drawdown_pct: -5.1, win_rate: 68.4, total_trades: 234, clone_count: 1847, market: "stocks" },
  { rank: 2, strategy_name: "Mean Reversion Pro", author_name: "Sarah Mitchell", total_return_pct: 42.7, sharpe_ratio: 2.61, max_drawdown_pct: -6.8, win_rate: 71.2, total_trades: 189, clone_count: 1523, market: "forex" },
  { rank: 3, strategy_name: "Crypto Trend Rider", author_name: "Alex Petrov", total_return_pct: 38.9, sharpe_ratio: 2.15, max_drawdown_pct: -11.3, win_rate: 58.9, total_trades: 312, clone_count: 2104, market: "crypto" },
  { rank: 4, strategy_name: "Volatility Squeeze", author_name: "David Park", total_return_pct: 35.4, sharpe_ratio: 2.42, max_drawdown_pct: -4.2, win_rate: 65.1, total_trades: 167, clone_count: 982, market: "stocks" },
  { rank: 5, strategy_name: "Breakout Hunter", author_name: "Elena Rodriguez", total_return_pct: 33.1, sharpe_ratio: 1.98, max_drawdown_pct: -8.7, win_rate: 55.3, total_trades: 428, clone_count: 1234, market: "crypto" },
  { rank: 6, strategy_name: "RSI Divergence", author_name: "James Wright", total_return_pct: 31.8, sharpe_ratio: 2.33, max_drawdown_pct: -5.5, win_rate: 63.7, total_trades: 198, clone_count: 876, market: "forex" },
  { rank: 7, strategy_name: "VWAP Bounce", author_name: "Aiko Tanaka", total_return_pct: 29.5, sharpe_ratio: 2.18, max_drawdown_pct: -6.1, win_rate: 61.4, total_trades: 256, clone_count: 743, market: "stocks" },
  { rank: 8, strategy_name: "Ichimoku Edge", author_name: "Raj Patel", total_return_pct: 28.2, sharpe_ratio: 2.05, max_drawdown_pct: -7.3, win_rate: 59.8, total_trades: 178, clone_count: 654, market: "forex" },
  { rank: 9, strategy_name: "BB Squeeze Trader", author_name: "Lisa Wang", total_return_pct: 26.9, sharpe_ratio: 1.92, max_drawdown_pct: -8.9, win_rate: 57.6, total_trades: 345, clone_count: 567, market: "stocks" },
  { rank: 10, strategy_name: "Multi-Timeframe Trend", author_name: "Carlos Silva", total_return_pct: 25.3, sharpe_ratio: 2.11, max_drawdown_pct: -5.8, win_rate: 62.3, total_trades: 213, clone_count: 489, market: "futures" },
];

export const SAMPLE_BLOG_POSTS = [
  {
    id: "1",
    title: "How to Build a Profitable Mean Reversion Strategy in 2024",
    slug: "mean-reversion-strategy-2024",
    excerpt: "Mean reversion remains one of the most reliable edges in financial markets. Learn how to build, backtest, and optimize a mean reversion strategy that actually works.",
    content: "",
    cover_image: "/blog/mean-reversion.jpg",
    author: "Marcus Chen",
    author_avatar: "/avatars/marcus.jpg",
    category: "strategy" as const,
    tags: ["mean reversion", "stocks", "backtesting"],
    read_time: 12,
    published: true,
    published_at: "2024-12-15T10:00:00Z",
    created_at: "2024-12-14T08:00:00Z",
    updated_at: "2024-12-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Understanding Sharpe Ratio: The Metric Every Trader Should Master",
    slug: "understanding-sharpe-ratio",
    excerpt: "Sharpe ratio is the gold standard of risk-adjusted performance metrics. This deep dive explains exactly how to calculate, interpret, and improve your strategy's Sharpe ratio.",
    content: "",
    cover_image: "/blog/sharpe-ratio.jpg",
    author: "Sarah Mitchell",
    author_avatar: "/avatars/sarah.jpg",
    category: "education" as const,
    tags: ["sharpe ratio", "risk management", "metrics"],
    read_time: 8,
    published: true,
    published_at: "2024-12-10T10:00:00Z",
    created_at: "2024-12-09T08:00:00Z",
    updated_at: "2024-12-10T10:00:00Z",
  },
  {
    id: "3",
    title: "Crypto Market Analysis: Key Trends for Q1 2025",
    slug: "crypto-market-analysis-q1-2025",
    excerpt: "Our quantitative analysis reveals three major crypto trends heading into 2025. Here is what our backtesting data says about the upcoming quarter.",
    content: "",
    cover_image: "/blog/crypto-trends.jpg",
    author: "Alex Petrov",
    author_avatar: "/avatars/alex.jpg",
    category: "market_update" as const,
    tags: ["crypto", "market analysis", "2025"],
    read_time: 10,
    published: true,
    published_at: "2024-12-05T10:00:00Z",
    created_at: "2024-12-04T08:00:00Z",
    updated_at: "2024-12-05T10:00:00Z",
  },
  {
    id: "4",
    title: "Step-by-Step: Building Your First Strategy with EdgeFinder",
    slug: "building-first-strategy-edgefinder",
    excerpt: "A complete walkthrough for creating, backtesting, and optimizing your first trading strategy using EdgeFinder's visual strategy builder.",
    content: "",
    cover_image: "/blog/first-strategy.jpg",
    author: "EdgeFinder Team",
    author_avatar: "/avatars/team.jpg",
    category: "tutorial" as const,
    tags: ["tutorial", "getting started", "strategy builder"],
    read_time: 15,
    published: true,
    published_at: "2024-11-28T10:00:00Z",
    created_at: "2024-11-27T08:00:00Z",
    updated_at: "2024-11-28T10:00:00Z",
  },
  {
    id: "5",
    title: "Why Most Backtests Lie (And How to Fix Yours)",
    slug: "why-most-backtests-lie",
    excerpt: "Look-ahead bias, survivorship bias, overfitting - learn about the common pitfalls that make backtests unreliable and the techniques to produce trustworthy results.",
    content: "",
    cover_image: "/blog/backtest-bias.jpg",
    author: "David Park",
    author_avatar: "/avatars/david.jpg",
    category: "education" as const,
    tags: ["backtesting", "bias", "methodology"],
    read_time: 11,
    published: true,
    published_at: "2024-11-20T10:00:00Z",
    created_at: "2024-11-19T08:00:00Z",
    updated_at: "2024-11-20T10:00:00Z",
  },
  {
    id: "6",
    title: "Introducing Custom Indicators: Build Your Own Edge",
    slug: "introducing-custom-indicators",
    excerpt: "We are excited to announce custom indicators for Elite users. Create proprietary indicators using our visual formula builder or Python SDK.",
    content: "",
    cover_image: "/blog/custom-indicators.jpg",
    author: "EdgeFinder Team",
    author_avatar: "/avatars/team.jpg",
    category: "product" as const,
    tags: ["product update", "custom indicators", "elite"],
    read_time: 6,
    published: true,
    published_at: "2024-11-15T10:00:00Z",
    created_at: "2024-11-14T08:00:00Z",
    updated_at: "2024-11-15T10:00:00Z",
  },
];
