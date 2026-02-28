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
  { value: "trend", label: "Trend", description: "Identify market direction and trend strength", count: 38 },
  { value: "momentum", label: "Momentum", description: "Measure speed of price changes", count: 32 },
  { value: "volatility", label: "Volatility", description: "Assess market volatility and risk", count: 24 },
  { value: "volume", label: "Volume", description: "Analyze trading volume patterns", count: 28 },
  { value: "oscillator", label: "Oscillators", description: "Find overbought/oversold conditions", count: 30 },
  { value: "support_resistance", label: "Support & Resistance", description: "Key price levels and zones", count: 18 },
  { value: "pattern", label: "Patterns", description: "Candlestick and chart patterns", count: 22 },
  { value: "statistical", label: "Statistical", description: "Statistical analysis tools", count: 16 },
  { value: "custom", label: "Custom", description: "User-created indicators", count: 0 },
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

export const SAMPLE_INDICATORS = [
  { id: "sma", name: "Simple Moving Average", short_name: "SMA", category: "trend" as const, description: "Calculates the arithmetic mean of a given set of prices over a specific number of periods.", overlay: true, is_premium: false, usage_count: 45230 },
  { id: "ema", name: "Exponential Moving Average", short_name: "EMA", category: "trend" as const, description: "A weighted moving average that gives more importance to recent price data.", overlay: true, is_premium: false, usage_count: 42180 },
  { id: "rsi", name: "Relative Strength Index", short_name: "RSI", category: "momentum" as const, description: "Measures the speed and magnitude of recent price changes to evaluate overbought/oversold conditions.", overlay: false, is_premium: false, usage_count: 38940 },
  { id: "macd", name: "MACD", short_name: "MACD", category: "momentum" as const, description: "Shows the relationship between two moving averages. Generates crossover signals for trend changes.", overlay: false, is_premium: false, usage_count: 36720 },
  { id: "bb", name: "Bollinger Bands", short_name: "BB", category: "volatility" as const, description: "Plots bands 2 standard deviations above and below a simple moving average to measure volatility.", overlay: true, is_premium: false, usage_count: 34500 },
  { id: "atr", name: "Average True Range", short_name: "ATR", category: "volatility" as const, description: "Measures market volatility by decomposing the entire range of an asset price for a period.", overlay: false, is_premium: false, usage_count: 28900 },
  { id: "vwap", name: "Volume Weighted Average Price", short_name: "VWAP", category: "volume" as const, description: "The ratio of value traded to total volume traded. A benchmark for institutional traders.", overlay: true, is_premium: false, usage_count: 27400 },
  { id: "stoch", name: "Stochastic Oscillator", short_name: "STOCH", category: "oscillator" as const, description: "Compares a closing price to a range of prices over a period to predict price turning points.", overlay: false, is_premium: false, usage_count: 25600 },
  { id: "ichimoku", name: "Ichimoku Cloud", short_name: "ICHI", category: "trend" as const, description: "A comprehensive indicator providing support/resistance, trend direction, momentum, and trade signals.", overlay: true, is_premium: true, usage_count: 22100 },
  { id: "fib", name: "Fibonacci Retracement", short_name: "FIB", category: "support_resistance" as const, description: "Horizontal lines indicating possible support and resistance at key Fibonacci levels.", overlay: true, is_premium: true, usage_count: 19800 },
  { id: "obv", name: "On-Balance Volume", short_name: "OBV", category: "volume" as const, description: "Uses volume flow to predict changes in stock price direction.", overlay: false, is_premium: false, usage_count: 18200 },
  { id: "adx", name: "Average Directional Index", short_name: "ADX", category: "trend" as const, description: "Measures trend strength regardless of direction. Values above 25 indicate strong trends.", overlay: false, is_premium: false, usage_count: 17500 },
  { id: "cci", name: "Commodity Channel Index", short_name: "CCI", category: "oscillator" as const, description: "Measures deviation from the statistical mean, identifying cyclical trends.", overlay: false, is_premium: false, usage_count: 15300 },
  { id: "williams", name: "Williams %R", short_name: "W%R", category: "oscillator" as const, description: "A momentum oscillator measuring overbought/oversold levels, similar to Stochastic.", overlay: false, is_premium: false, usage_count: 13200 },
  { id: "psar", name: "Parabolic SAR", short_name: "PSAR", category: "trend" as const, description: "Provides potential entry and exit points. Dots above price suggest downtrend, below suggest uptrend.", overlay: true, is_premium: false, usage_count: 14800 },
  { id: "mfi", name: "Money Flow Index", short_name: "MFI", category: "volume" as const, description: "A volume-weighted RSI that measures buying and selling pressure.", overlay: false, is_premium: true, usage_count: 11200 },
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
    excerpt: "Look-ahead bias, survivorship bias, overfitting — learn about the common pitfalls that make backtests unreliable and the techniques to produce trustworthy results.",
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
