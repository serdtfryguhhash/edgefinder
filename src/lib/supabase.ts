import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

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

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }
  return session;
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return user;
}

export async function signInWithMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
