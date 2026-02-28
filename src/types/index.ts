export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  referral_code: string;
  referred_by: string | null;
  strategies_count: number;
  backtests_count: number;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  default_timeframe: Timeframe;
  default_market: Market;
  notifications_enabled: boolean;
  email_reports: boolean;
  theme: "dark" | "light";
}

export type SubscriptionTier = "free" | "pro" | "elite";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "inactive";

export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  description: string;
  market: Market;
  timeframe: Timeframe;
  indicators: StrategyIndicator[];
  entry_rules: TradingRule[];
  exit_rules: TradingRule[];
  risk_management: RiskManagement;
  is_public: boolean;
  is_published: boolean;
  clone_count: number;
  likes_count: number;
  performance_score: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  author?: Pick<User, "id" | "full_name" | "avatar_url">;
}

export interface StrategyIndicator {
  id: string;
  indicator_id: string;
  name: string;
  category: IndicatorCategory;
  parameters: Record<string, number | string | boolean>;
  overlay: boolean;
  color: string;
}

export interface TradingRule {
  id: string;
  type: "entry" | "exit";
  condition: RuleCondition;
  logic_operator?: "AND" | "OR";
}

export interface RuleCondition {
  left_operand: Operand;
  operator: ComparisonOperator;
  right_operand: Operand;
}

export interface Operand {
  type: "indicator" | "price" | "value" | "candle";
  indicator_id?: string;
  field?: string;
  value?: number;
}

export type ComparisonOperator =
  | "crosses_above"
  | "crosses_below"
  | "greater_than"
  | "less_than"
  | "equals"
  | "greater_than_or_equal"
  | "less_than_or_equal";

export interface RiskManagement {
  position_size_type: "fixed" | "percent" | "kelly";
  position_size_value: number;
  stop_loss_type: "fixed" | "atr" | "percent" | "trailing";
  stop_loss_value: number;
  take_profit_type: "fixed" | "atr" | "percent" | "risk_reward";
  take_profit_value: number;
  max_open_positions: number;
  max_daily_trades: number;
  max_drawdown_percent: number;
}

export interface Backtest {
  id: string;
  strategy_id: string;
  user_id: string;
  status: BacktestStatus;
  start_date: string;
  end_date: string;
  initial_capital: number;
  market: Market;
  timeframe: Timeframe;
  symbol: string;
  results: BacktestResults | null;
  equity_curve: EquityPoint[];
  trades: Trade[];
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  strategy?: Strategy;
}

export type BacktestStatus = "pending" | "running" | "completed" | "failed" | "canceled";

export interface BacktestResults {
  total_return: number;
  total_return_pct: number;
  annualized_return: number;
  max_drawdown: number;
  max_drawdown_pct: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  calmar_ratio: number;
  win_rate: number;
  profit_factor: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  avg_win: number;
  avg_loss: number;
  avg_win_pct: number;
  avg_loss_pct: number;
  largest_win: number;
  largest_loss: number;
  avg_holding_period: string;
  max_consecutive_wins: number;
  max_consecutive_losses: number;
  expectancy: number;
  recovery_factor: number;
  ulcer_index: number;
  final_equity: number;
  total_fees: number;
  benchmark_return: number;
  alpha: number;
  beta: number;
  volatility: number;
  monthly_returns: MonthlyReturn[];
}

export interface EquityPoint {
  timestamp: string;
  equity: number;
  drawdown: number;
  benchmark: number;
}

export interface Trade {
  id: string;
  entry_date: string;
  exit_date: string;
  direction: "long" | "short";
  entry_price: number;
  exit_price: number;
  quantity: number;
  pnl: number;
  pnl_pct: number;
  fees: number;
  exit_reason: "take_profit" | "stop_loss" | "signal" | "end_of_test";
  holding_period: string;
}

export interface MonthlyReturn {
  year: number;
  month: number;
  return_pct: number;
}

export interface Indicator {
  id: string;
  name: string;
  short_name: string;
  description: string;
  category: IndicatorCategory;
  parameters: IndicatorParameter[];
  overlay: boolean;
  is_premium: boolean;
  usage_count: number;
  created_at: string;
}

export type IndicatorCategory =
  | "trend"
  | "momentum"
  | "volatility"
  | "volume"
  | "oscillator"
  | "support_resistance"
  | "pattern"
  | "statistical"
  | "custom";

export interface IndicatorParameter {
  name: string;
  label: string;
  type: "number" | "string" | "boolean" | "select";
  default_value: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
  description: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: "pending" | "completed" | "expired";
  reward_amount: number;
  reward_paid: boolean;
  created_at: string;
  completed_at: string | null;
  referred_user?: Pick<User, "full_name" | "avatar_url" | "created_at">;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  author_avatar: string;
  category: BlogCategory;
  tags: string[];
  read_time: number;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type BlogCategory =
  | "strategy"
  | "analysis"
  | "education"
  | "product"
  | "market_update"
  | "tutorial";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  status: "active" | "unsubscribed";
  source: string;
  created_at: string;
}

export type Market = "stocks" | "forex" | "crypto" | "futures" | "options";
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w" | "1M";

export interface LeaderboardEntry {
  rank: number;
  strategy: Strategy;
  author: Pick<User, "id" | "full_name" | "avatar_url">;
  total_return_pct: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  clone_count: number;
  likes_count: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price_monthly: number;
  price_annual: number;
  stripe_monthly_price_id: string;
  stripe_annual_price_id: string;
  features: string[];
  limits: PlanLimits;
  highlighted: boolean;
  cta: string;
}

export interface PlanLimits {
  strategies: number;
  backtests_per_day: number;
  historical_data_years: number;
  indicators: number;
  export_formats: string[];
  api_access: boolean;
  priority_support: boolean;
  custom_indicators: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ExportOptions {
  format: "pdf" | "csv" | "json";
  include_trades: boolean;
  include_equity_curve: boolean;
  include_monthly_returns: boolean;
  include_charts: boolean;
}
