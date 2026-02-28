import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  referral_code: z.string().optional(),
});

export const strategySchema = z.object({
  name: z
    .string()
    .min(3, "Strategy name must be at least 3 characters")
    .max(100, "Strategy name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  market: z.enum(["stocks", "forex", "crypto", "futures", "options"]),
  timeframe: z.enum(["1m", "5m", "15m", "1h", "4h", "1d", "1w", "1M"]),
  is_public: z.boolean().default(false),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
});

export const backtestSchema = z.object({
  strategy_id: z.string().uuid("Invalid strategy ID"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  initial_capital: z
    .number()
    .min(1000, "Minimum initial capital is $1,000")
    .max(10000000, "Maximum initial capital is $10,000,000"),
  symbol: z.string().min(1, "Symbol is required"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().optional(),
  source: z.string().default("website"),
});

export const settingsSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  default_timeframe: z.enum(["1m", "5m", "15m", "1h", "4h", "1d", "1w", "1M"]),
  default_market: z.enum(["stocks", "forex", "crypto", "futures", "options"]),
  notifications_enabled: z.boolean(),
  email_reports: z.boolean(),
});

export const exportSchema = z.object({
  format: z.enum(["pdf", "csv", "json"]),
  include_trades: z.boolean().default(true),
  include_equity_curve: z.boolean().default(true),
  include_monthly_returns: z.boolean().default(true),
  include_charts: z.boolean().default(false),
});

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be less than 200 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z
    .string()
    .min(50, "Excerpt must be at least 50 characters")
    .max(500, "Excerpt must be less than 500 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  category: z.enum([
    "strategy",
    "analysis",
    "education",
    "product",
    "market_update",
    "tutorial",
  ]),
  tags: z.array(z.string()).max(10).default([]),
  published: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type StrategyInput = z.infer<typeof strategySchema>;
export type BacktestInput = z.infer<typeof backtestSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ExportInput = z.infer<typeof exportSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
