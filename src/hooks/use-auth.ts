"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, signInWithMagicLink, signInWithGoogle, signOut } from "@/lib/supabase";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const mockUser: User = {
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || "Trader",
            avatar_url: session.user.user_metadata?.avatar_url || null,
            subscription_tier: "free",
            subscription_status: "active",
            stripe_customer_id: null,
            referral_code: "EF-DEMO01",
            referred_by: null,
            strategies_count: 3,
            backtests_count: 12,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            onboarding_completed: true,
            preferences: {
              default_timeframe: "1d",
              default_market: "stocks",
              notifications_enabled: true,
              email_reports: true,
              theme: "dark",
            },
          };
          setState({ user: mockUser, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      }
    );

    // Check for existing session
    setState((prev) => ({ ...prev, loading: false }));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }
    setState((prev) => ({ ...prev, loading: false }));
    return { error: null };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { error } = await signInWithGoogle();
    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }
    setState((prev) => ({ ...prev, loading: false }));
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await signOut();
    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }
    setState({ user: null, loading: false, error: null });
    return { error: null };
  }, []);

  return {
    ...state,
    login,
    loginWithGoogle,
    logout,
  };
}
