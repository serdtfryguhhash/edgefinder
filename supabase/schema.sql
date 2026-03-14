-- EdgeFinder Database Schema
-- Run this in the Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'inactive')),
  stripe_customer_id TEXT UNIQUE,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  strategies_count INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{"default_timeframe": "1d", "default_market": "stocks", "notifications_enabled": true, "email_reports": true, "theme": "dark"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strategies
CREATE TABLE IF NOT EXISTS public.strategies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  market TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  indicators JSONB DEFAULT '[]'::jsonb,
  entry_rules JSONB DEFAULT '[]'::jsonb,
  exit_rules JSONB DEFAULT '[]'::jsonb,
  risk_management JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  clone_count INTEGER DEFAULT 0,
  performance JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard entries
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  strategy_name TEXT NOT NULL,
  author_name TEXT NOT NULL,
  market TEXT NOT NULL,
  total_return_pct NUMERIC NOT NULL,
  sharpe_ratio NUMERIC,
  max_drawdown_pct NUMERIC,
  win_rate NUMERIC,
  total_trades INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0,
  rank INTEGER,
  period TEXT DEFAULT 'all_time' CHECK (period IN ('1m', '3m', '6m', '1y', 'all_time')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions tracking
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('pro', 'elite')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Strategies policies
CREATE POLICY "Users can manage own strategies" ON public.strategies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public strategies are readable" ON public.strategies FOR SELECT USING (is_public = true);

-- Leaderboard policies (readable by all authenticated)
CREATE POLICY "Leaderboard is readable" ON public.leaderboard_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own leaderboard entries" ON public.leaderboard_entries FOR ALL USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'EF-' || upper(substr(md5(random()::text), 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON public.strategies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_is_public ON public.strategies(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.leaderboard_entries(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_return ON public.leaderboard_entries(total_return_pct DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
