import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

const isSupabaseConfigured =
  !supabaseUrl.includes("placeholder") && !supabaseAnonKey.includes("placeholder");

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ── Demo auth helpers (localStorage-based, used when Supabase is not configured) ──

export interface DemoUser {
  id: string;
  email: string;
  user_metadata: { full_name: string };
  created_at: string;
}

const DEMO_USERS_KEY = "edgefinder_demo_users";
const DEMO_SESSION_KEY = "edgefinder_demo_session";

function getDemoUsers(): DemoUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDemoUser(user: DemoUser) {
  if (typeof window === "undefined") return;
  const users = getDemoUsers();
  const existing = users.findIndex((u) => u.email === user.email);
  if (existing >= 0) users[existing] = user;
  else users.push(user);
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

export function getDemoSession(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setDemoSession(user: DemoUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(DEMO_SESSION_KEY);
}

function makeDemoUser(email: string, fullName: string): DemoUser {
  return {
    id: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email,
    user_metadata: { full_name: fullName },
    created_at: new Date().toISOString(),
  };
}

// ── Public API (auto-switches between real Supabase and demo mode) ──

export { isSupabaseConfigured };

export async function getSession() {
  if (!isSupabaseConfigured) {
    return getDemoSession() ? { user: getDemoSession() } : null;
  }
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }
  return session;
}

export async function getUser() {
  if (!isSupabaseConfigured) {
    return getDemoSession();
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return user;
}

export async function signInWithMagicLink(email: string) {
  if (!isSupabaseConfigured) {
    // Demo mode: create user if needed, sign in
    let users = getDemoUsers();
    let user = users.find((u) => u.email === email);
    if (!user) {
      user = makeDemoUser(email, email.split("@")[0]);
      saveDemoUser(user);
    }
    setDemoSession(user);
    return { data: { user }, error: null };
  }
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    // Demo mode: create a demo Google user
    const email = "demo.trader@gmail.com";
    const user = makeDemoUser(email, "Demo Trader");
    saveDemoUser(user);
    setDemoSession(user);
    return { data: { user }, error: null };
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    setDemoSession(null);
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured) {
    // Demo mode: check for existing user
    const users = getDemoUsers();
    if (users.find((u) => u.email === email)) {
      return { data: null, error: { message: "An account with this email already exists. Please sign in." } };
    }
    const user = makeDemoUser(email, fullName);
    saveDemoUser(user);
    setDemoSession(user);
    return { data: { user, session: { user } }, error: null };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured) {
    // Demo mode: check if user exists
    const users = getDemoUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return { data: null, error: { message: "No account found with this email. Please sign up first." } };
    }
    setDemoSession(user);
    return { data: { user, session: { user } }, error: null };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}
