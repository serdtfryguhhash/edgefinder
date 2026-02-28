"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATS } from "@/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Zap className="h-3 w-3 mr-1" />
              Now with 200+ indicators and multi-market support
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Discover Your{" "}
            <span className="gradient-text">Trading Edge</span>
            <br />
            Before Risking Capital
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-8"
          >
            Build, backtest, and optimize trading strategies across stocks, forex, crypto,
            and futures. Institutional-grade analytics without the institutional price tag.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/signup">
              <Button size="xl" variant="glow" className="group">
                Start Free — No Credit Card
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="xl" variant="outline" className="group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-8 sm:gap-12 mb-16"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold data-text text-foreground">
                  {stat.value}
                  <span className="text-accent">{stat.suffix}</span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl" />
            <div className="relative rounded-xl border border-white/10 bg-primary-900/90 backdrop-blur-sm p-1 shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">edgefinder.io/dashboard</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Return", value: "+24.8%", icon: TrendingUp, color: "text-accent" },
                    { label: "Sharpe Ratio", value: "1.85", icon: Zap, color: "text-secondary-400" },
                    { label: "Win Rate", value: "62.5%", icon: TrendingUp, color: "text-accent" },
                    { label: "Max Drawdown", value: "-7.2%", icon: Shield, color: "text-yellow-500" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-primary-800/50 p-4 border border-white/5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className={`text-xl font-bold data-text ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                {/* Simplified Chart Preview */}
                <div className="rounded-lg bg-primary-800/30 border border-white/5 p-4 h-48 flex items-end gap-1">
                  {Array.from({ length: 60 }, (_, i) => {
                    const h = 20 + Math.sin(i * 0.15) * 15 + Math.random() * 10 + (i * 0.8);
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent/80 transition-all"
                        style={{ height: `${Math.min(h, 95)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by traders at leading firms worldwide
            </p>
            <div className="flex items-center justify-center gap-8 opacity-40">
              {["Citadel", "Two Sigma", "DE Shaw", "Bridgewater", "Point72"].map((name) => (
                <span key={name} className="text-sm font-semibold tracking-wider uppercase">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
