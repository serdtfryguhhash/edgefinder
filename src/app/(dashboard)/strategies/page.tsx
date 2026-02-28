"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,

  GitBranch,
  MoreVertical,

  Clock,
  Copy,
  Trash2,
  Eye,

  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPercent } from "@/lib/utils";

const strategies = [
  {
    id: "1",
    name: "Momentum Alpha v3",
    description: "Multi-factor momentum strategy combining RSI, MACD, and volume confirmation for trend-following entries in large-cap equities.",
    market: "stocks",
    timeframe: "1d",
    returnPct: 24.8,
    sharpe: 1.85,
    winRate: 62.5,
    trades: 156,
    status: "active",
    isPublic: true,
    tags: ["momentum", "trend-following", "large-cap"],
    lastBacktest: "2 hours ago",
    created: "2024-01-15",
  },
  {
    id: "2",
    name: "Mean Reversion Pro",
    description: "Statistical mean reversion strategy using Bollinger Bands and RSI divergence in major forex pairs. Optimized for range-bound markets.",
    market: "forex",
    timeframe: "4h",
    returnPct: 18.2,
    sharpe: 2.14,
    winRate: 71.2,
    trades: 189,
    status: "active",
    isPublic: true,
    tags: ["mean-reversion", "forex", "statistical"],
    lastBacktest: "5 hours ago",
    created: "2024-02-20",
  },
  {
    id: "3",
    name: "Crypto Trend Rider",
    description: "Trend-following strategy using EMA crossovers with ATR-based stops for cryptocurrency markets. Includes position sizing based on volatility.",
    market: "crypto",
    timeframe: "1h",
    returnPct: -3.4,
    sharpe: 0.42,
    winRate: 45.8,
    trades: 312,
    status: "draft",
    isPublic: false,
    tags: ["crypto", "trend", "EMA"],
    lastBacktest: "1 day ago",
    created: "2024-03-10",
  },
];

export default function StrategiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMarket, setFilterMarket] = useState("all");

  const filteredStrategies = strategies.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarket = filterMarket === "all" || s.market === filterMarket;
    return matchesSearch && matchesMarket;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Strategies</h1>
          <p className="text-muted-foreground">
            Build, manage, and backtest your trading strategies.
          </p>
        </div>
        <Link href="/strategies/new">
          <Button variant="glow" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "stocks", "forex", "crypto", "futures"].map((market) => (
            <Button
              key={market}
              variant={filterMarket === market ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilterMarket(market)}
              className="text-xs capitalize"
            >
              {market}
            </Button>
          ))}
        </div>
      </div>

      {filteredStrategies.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-800/50 mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No strategies found</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              {searchQuery
                ? `No strategies match "${searchQuery}". Try a different search term.`
                : "Create your first strategy to start discovering your trading edge."}
            </p>
            <Link href="/strategies/new">
              <Button variant="glow" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Strategy
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="glass-card-hover group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-800/50 group-hover:bg-primary-800 transition-colors">
                      <GitBranch className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/strategies/${strategy.id}`}
                              className="text-base font-semibold hover:text-accent transition-colors"
                            >
                              {strategy.name}
                            </Link>
                            <Badge
                              variant={strategy.status === "active" ? "success" : "outline"}
                              className="text-[10px]"
                            >
                              {strategy.status}
                            </Badge>
                            {strategy.isPublic && (
                              <Badge variant="secondary" className="text-[10px]">
                                <Eye className="h-2.5 w-2.5 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {strategy.description}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Run Backtest
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {strategy.market}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {strategy.timeframe}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {strategy.lastBacktest}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {strategy.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-primary-800/50 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p
                          className={`text-lg font-bold data-text ${
                            strategy.returnPct >= 0 ? "text-accent" : "text-destructive"
                          }`}
                        >
                          {formatPercent(strategy.returnPct)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Return</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold data-text text-secondary-400">
                          {strategy.sharpe.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Sharpe</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold data-text">
                          {strategy.winRate}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">Win Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold data-text text-muted-foreground">
                          {strategy.trades}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Trades</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
