"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Mail, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signInWithPassword, signInWithMagicLink, signInWithGoogle, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (!isSupabaseConfigured) {
      // Demo mode: session created instantly, redirect
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      if (mode === "password") {
        if (!password) {
          setError("Please enter your password");
          setLoading(false);
          return;
        }

        const { data, error: signInError } = await signInWithPassword(email, password);

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        if (data?.session) {
          router.push("/dashboard");
        }
      } else {
        const { error: magicLinkError } = await signInWithMagicLink(email);

        if (magicLinkError) {
          setError(magicLinkError.message);
          setLoading(false);
          return;
        }

        if (!isSupabaseConfigured) {
          // Demo mode: session created instantly
          router.push("/dashboard");
        } else {
          setSent(true);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Activity className="h-6 w-6 text-accent" />
            </div>
            <span className="text-2xl font-bold">
              Edge<span className="text-accent">Finder</span>
            </span>
          </Link>
        </div>

        <Card className="border-white/5">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your trading dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mx-auto mb-4">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We sent a magic link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Click the link in the email to sign in. The link expires in 10 minutes.
                </p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                >
                  Use a different email
                </Button>
              </motion.div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full mb-4 h-11"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    or continue with email
                  </span>
                </div>

                {/* Mode toggle */}
                <div className="flex rounded-lg border border-white/10 p-1 mb-4">
                  <button
                    type="button"
                    onClick={() => { setMode("password"); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      mode === "password"
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Lock className="h-3 w-3" />
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("magic-link"); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      mode === "magic-link"
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail className="h-3 w-3" />
                    Magic Link
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="trader@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="h-11"
                      required
                    />
                  </div>

                  {mode === "password" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-accent hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          className="h-11 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11"
                    variant="glow"
                    disabled={loading || !email || (mode === "password" && !password)}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : mode === "magic-link" ? (
                      <Mail className="h-4 w-4 mr-2" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    {mode === "password" ? "Sign In" : "Send Magic Link"}
                    {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
