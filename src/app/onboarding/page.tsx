"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, ArrowLeft, Check, BarChart3, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MARKETS, TIMEFRAMES } from "@/constants";

const steps = [
  {
    title: "What do you trade?",
    description: "Select your primary market to customize your experience.",
    icon: BarChart3,
  },
  {
    title: "Your preferred timeframe?",
    description: "We'll set this as your default for new strategies.",
    icon: TrendingUp,
  },
  {
    title: "Your experience level?",
    description: "This helps us tailor the onboarding and suggest strategies.",
    icon: Shield,
  },
];

const experienceLevels = [
  { value: "beginner", label: "Beginner", desc: "New to systematic trading and backtesting" },
  { value: "intermediate", label: "Intermediate", desc: "Some experience with technical analysis" },
  { value: "advanced", label: "Advanced", desc: "Experienced with quantitative strategies" },
  { value: "professional", label: "Professional", desc: "Full-time trader or fund manager" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const canProceed = () => {
    if (step === 0) return !!selectedMarket;
    if (step === 1) return !!selectedTimeframe;
    if (step === 2) return !!selectedExperience;
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Activity className="h-6 w-6 text-accent" />
            </div>
            <span className="text-2xl font-bold">
              Edge<span className="text-accent">Finder</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Let&apos;s set up your account</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  i < step
                    ? "bg-accent text-accent-foreground"
                    : i === step
                    ? "bg-accent/20 text-accent ring-2 ring-accent/50"
                    : "bg-primary-800 text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-px ${i < step ? "bg-accent" : "bg-white/10"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{steps[step].title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{steps[step].description}</p>
                </div>

                {/* Step 1: Market */}
                {step === 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MARKETS.map((market) => (
                      <button
                        key={market.value}
                        onClick={() => setSelectedMarket(market.value)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          selectedMarket === market.value
                            ? "border-accent/50 bg-accent/10"
                            : "border-white/5 bg-primary-800/30 hover:bg-primary-800/50"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{market.icon}</span>
                        <span className="text-sm font-medium">{market.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Timeframe */}
                {step === 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf.value}
                        onClick={() => setSelectedTimeframe(tf.value)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          selectedTimeframe === tf.value
                            ? "border-accent/50 bg-accent/10"
                            : "border-white/5 bg-primary-800/30 hover:bg-primary-800/50"
                        }`}
                      >
                        <span className="text-lg font-bold data-text block mb-1">{tf.shortLabel}</span>
                        <span className="text-xs text-muted-foreground">{tf.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Experience */}
                {step === 2 && (
                  <div className="space-y-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setSelectedExperience(level.value)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          selectedExperience === level.value
                            ? "border-accent/50 bg-accent/10"
                            : "border-white/5 bg-primary-800/30 hover:bg-primary-800/50"
                        }`}
                      >
                        <span className="text-sm font-semibold block">{level.label}</span>
                        <span className="text-xs text-muted-foreground">{level.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              variant="default"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/dashboard">
              <Button variant="glow" disabled={!canProceed()}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
