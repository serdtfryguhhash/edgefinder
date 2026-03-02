"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Search, GitFork } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAMPLE_LEADERBOARD } from "@/constants";
import { formatPercent, getInitials, getRankBadgeColor } from "@/lib/utils";
import { StrategyFork } from "@/components/features/strategy-fork";
import { ShareCard } from "@/components/shared/ShareCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("all_time");
  const [marketFilter, setMarketFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_LEADERBOARD.filter((entry) => {
    const matchesSearch = entry.strategy_name.toLowerCase().includes(search.toLowerCase()) ||
      entry.author_name.toLowerCase().includes(search.toLowerCase());
    const matchesMarket = marketFilter === "all" || entry.market === marketFilter;
    return matchesSearch && matchesMarket;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Top-performing strategies ranked by risk-adjusted returns. Fork the best strategies from our community.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SAMPLE_LEADERBOARD.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`glass-card relative overflow-hidden ${index === 0 ? "ring-1 ring-yellow-500/30" : ""}`}>
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRankBadgeColor(entry.rank)}`} />
              <CardContent className="p-5 text-center">
                <div className="mb-3">
                  {index === 0 ? (
                    <Crown className="h-8 w-8 text-yellow-500 mx-auto" />
                  ) : (
                    <Medal className={`h-8 w-8 mx-auto ${index === 1 ? "text-gray-400" : "text-orange-600"}`} />
                  )}
                </div>
                <Avatar className="h-12 w-12 mx-auto mb-2">
                  <AvatarFallback className="text-sm">{getInitials(entry.author_name)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm">{entry.strategy_name}</p>
                <p className="text-xs text-muted-foreground mb-3">by {entry.author_name}</p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold data-text text-accent">{formatPercent(entry.total_return_pct)}</p>
                    <p className="text-[10px] text-muted-foreground">Return</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold data-text text-secondary-400">{entry.sharpe_ratio.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">Sharpe</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <StrategyFork
                    strategyId={`leaderboard_${entry.rank}`}
                    strategyName={entry.strategy_name}
                    authorName={entry.author_name}
                    forkCount={entry.clone_count}
                    variant="button"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs flex-1">
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle>Share Performance</DialogTitle>
                      </DialogHeader>
                      <ShareCard
                        strategyName={entry.strategy_name}
                        returnPct={entry.total_return_pct}
                        sharpeRatio={entry.sharpe_ratio}
                        winRate={entry.win_rate}
                        maxDrawdown={entry.max_drawdown_pct}
                        timePeriod="All Time"
                        authorName={entry.author_name}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies or traders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={marketFilter} onValueChange={setMarketFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Markets</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="futures">Futures</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 Month</SelectItem>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="6m">6 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Full Leaderboard Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium w-12">Rank</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Strategy</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Market</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Return</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Sharpe</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Win Rate</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Max DD</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Trades</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">
                    <GitFork className="h-3.5 w-3.5 inline" /> Forks
                  </th>
                  <th className="py-3 px-4 w-28"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, index) => (
                  <motion.tr
                    key={entry.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className={`text-sm font-bold data-text ${entry.rank <= 3 ? "text-yellow-500" : "text-muted-foreground"}`}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-[10px]">{getInitials(entry.author_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{entry.strategy_name}</p>
                          <p className="text-xs text-muted-foreground">{entry.author_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] capitalize">{entry.market}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-bold data-text text-accent">{formatPercent(entry.total_return_pct)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-mono">{entry.sharpe_ratio.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-mono">{entry.win_rate}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-mono text-destructive">{formatPercent(entry.max_drawdown_pct)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-mono">{entry.total_trades}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-mono text-muted-foreground">{entry.clone_count}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StrategyFork
                        strategyId={`leaderboard_${entry.rank}`}
                        strategyName={entry.strategy_name}
                        authorName={entry.author_name}
                        forkCount={0}
                        variant="button"
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
