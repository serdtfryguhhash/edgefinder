"use client";

import React, { useState, useMemo } from "react";
import { Search, Lock, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_INDICATORS } from "@/constants";

interface IndicatorToggleProps {
  enabledIndicators: string[];
  onToggle: (indicatorId: string) => void;
  onSelectAll: (category: string) => void;
  onDeselectAll: (category: string) => void;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "trend", label: "Trend" },
  { value: "momentum", label: "Momentum" },
  { value: "volatility", label: "Volatility" },
  { value: "volume", label: "Volume" },
  { value: "statistical", label: "Statistical" },
];

export function IndicatorToggle({ enabledIndicators, onToggle, onSelectAll, onDeselectAll }: IndicatorToggleProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return ALL_INDICATORS.filter((ind) => {
      const matchesSearch = !search || ind.name.toLowerCase().includes(search.toLowerCase()) || ind.short_name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || ind.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const enabledCount = enabledIndicators.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">Indicator Configuration</h3>
        </div>
        <Badge variant="secondary">{enabledCount} of {ALL_INDICATORS.length} enabled</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search indicators..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-transparent p-0">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs data-[state=active]:bg-accent/10 data-[state=active]:text-accent">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeCategory !== "all" && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => onSelectAll(activeCategory)}>Select All</Button>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => onDeselectAll(activeCategory)}>Deselect All</Button>
        </div>
      )}

      <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin pr-2">
        {filtered.map((indicator) => {
          const isEnabled = enabledIndicators.includes(indicator.id);
          return (
            <div key={indicator.id} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{indicator.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">({indicator.short_name})</span>
                    {indicator.is_premium && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 gap-1">
                        <Lock className="h-2.5 w-2.5" /> PRO
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{indicator.description}</p>
                </div>
              </div>
              <Switch checked={isEnabled} onCheckedChange={() => onToggle(indicator.id)} disabled={indicator.is_premium && !isEnabled} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
