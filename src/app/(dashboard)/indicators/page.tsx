"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Activity, Lock, TrendingUp, BarChart3, Waves, Volume2, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_INDICATORS, INDICATOR_CATEGORIES } from "@/constants";

const STORAGE_KEY = "edgefinder_enabled_indicators";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  trend: TrendingUp,
  momentum: Activity,
  volatility: Waves,
  volume: Volume2,
  statistical: BarChart3,
};

function getStoredIndicators(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeIndicators(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function IndicatorsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [enabledIndicators, setEnabledIndicators] = useState<string[]>([]);

  useEffect(() => {
    setEnabledIndicators(getStoredIndicators());
  }, []);

  const toggleIndicator = useCallback((id: string) => {
    setEnabledIndicators((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      storeIndicators(next);
      return next;
    });
  }, []);

  const filtered = ALL_INDICATORS.filter((ind) => {
    const matchesSearch =
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.short_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || ind.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Indicator Library</h1>
          <p className="text-muted-foreground">
            Browse and explore 106 technical indicators across all categories.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {ALL_INDICATORS.length} indicators, {enabledIndicators.length} enabled
        </Badge>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {INDICATOR_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat.value] || Activity;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value === activeCategory ? "all" : cat.value)}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeCategory === cat.value
                  ? "border-accent/50 bg-accent/5"
                  : "border-white/5 bg-card/50 hover:bg-card/70"
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${activeCategory === cat.value ? "text-accent" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium">{cat.label}</p>
              <p className="text-xs text-muted-foreground">{cat.count} indicators</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search indicators... (e.g., RSI, MACD, Bollinger)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="trend" className="text-xs">Trend</TabsTrigger>
            <TabsTrigger value="momentum" className="text-xs">Momentum</TabsTrigger>
            <TabsTrigger value="volatility" className="text-xs">Volatility</TabsTrigger>
            <TabsTrigger value="volume" className="text-xs">Volume</TabsTrigger>
            <TabsTrigger value="statistical" className="text-xs">Statistical</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Indicator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((indicator, index) => {
          const Icon = categoryIcons[indicator.category] || Activity;
          const isEnabled = enabledIndicators.includes(indicator.id);
          return (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <Card className="glass-card-hover group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800/50 group-hover:bg-primary-800 transition-colors">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{indicator.name}</h3>
                          {indicator.is_premium && (
                            <Badge variant="premium" className="text-[9px] gap-0.5">
                              <Lock className="h-2.5 w-2.5" />
                              PRO
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">{indicator.short_name}</p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleIndicator(indicator.id)}
                      disabled={indicator.is_premium && !isEnabled}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {indicator.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {indicator.category}
                      </Badge>
                      {indicator.overlay && (
                        <Badge variant="secondary" className="text-[10px]">
                          Overlay
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {indicator.usage_count} uses
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No indicators found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
