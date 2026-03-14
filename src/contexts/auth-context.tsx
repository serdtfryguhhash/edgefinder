"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import {
  supabase,
  signOut as supabaseSignOut,
  isSupabaseConfigured,
  getDemoSession,
  DemoUser,
} from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | DemoUser | null;
  session: Session | { user: DemoUser } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [session, setSession] = useState<Session | { user: DemoUser } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: check localStorage
      const demoUser = getDemoSession();
      if (demoUser) {
        setUser(demoUser);
        setSession({ user: demoUser });
      }
      setLoading(false);
      return;
    }

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    await supabaseSignOut();
    setUser(null);
    setSession(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
