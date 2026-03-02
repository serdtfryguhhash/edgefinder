"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Shield,
  TrendingUp,
  GitBranch,
  BarChart3,
  Clock,
  Users,
  Medal,
  CheckCircle,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPercent } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHALLENGES_STORAGE_KEY = "edgefinder_challenges";

type ChallengeType = "sharpe" | "drawdown" | "strategies" | "win_rate";

interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: string;
  target: number;
  unit: string;
  month: string;
  participants: number;
  optedIn: boolean;
  progress: number;
  completed: boolean;
  reward: string;
}

const MONTHLY_CHALLENGES: Omit<Challenge, "optedIn" | "progress" | "completed">[] = [
  {
    id: "challenge_sharpe_2026_03",
    type: "sharpe",
    title: "Best Sharpe Ratio",
    description: "Achieve the highest Sharpe ratio on any strategy backtest this month.",
    icon: "Zap",
    target: 3.0,
    unit: "Sharpe",
    month: "March 2026",
    participants: 847,
    reward: "Quant Badge",
  },
  {
    id: "challenge_drawdown_2026_03",
    type: "drawdown",
    title: "Lowest Max Drawdown",
    description: "Run a profitable backtest with the lowest maximum drawdown percentage.",
    icon: "Shield",
    target: 3.0,
    unit: "% Max DD",
    month: "March 2026",
    participants: 623,
    reward: "Risk Master Badge",
  },
  {
    id: "challenge_strategies_2026_03",
    type: "strategies",
    title: "Most Strategies Created",
    description: "Create and save the most trading strategies this month.",
    icon: "GitBranch",
    target: 10,
    unit: "Strategies",
    month: "March 2026",
    participants: 1205,
    reward: "Builder Badge",
  },
  {
    id: "challenge_winrate_2026_03",
    type: "win_rate",
    title: "Best Win Rate",
    description: "Achieve the highest win rate on a backtest with at least 50 trades.",
    icon: "Target",
    target: 75,
    unit: "% Win Rate",
    month: "March 2026",
    participants: 934,
    reward: "Precision Badge",
  },
];

function getChallengeData(): Record<string, { optedIn: boolean; progress: number; completed: boolean }> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveChallengeData(data: Record<string, { optedIn: boolean; progress: number; completed: boolean }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(data));
}

const leaderboardData = [
  { name: "Marcus C.", value: 2.84, rank: 1 },
  { name: "Sarah M.", value: 2.61, rank: 2 },
  { name: "Alex P.", value: 2.42, rank: 3 },
  { name: "David P.", value: 2.15, rank: 4 },
  { name: "Elena R.", value: 1.98, rank: 5 },
  { name: "You", value: 1.85, rank: 6 },
];

const challengeIcons: Record<string, React.ElementType> = {
  Zap: TrendingUp,
  Shield: Shield,
  GitBranch: GitBranch,
  Target: Target,
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<ChallengeType>("sharpe");

  useEffect(() => {
    const savedData = getChallengeData();
    const withState = MONTHLY_CHALLENGES.map((c) => ({
      ...c,
      optedIn: savedData[c.id]?.optedIn || false,
      progress: savedData[c.id]?.progress || 0,
      completed: savedData[c.id]?.completed || false,
    }));
    setChallenges(withState);
  }, []);

  const optIn = useCallback((challengeId: string) => {
    const updated = challenges.map((c) =>
      c.id === challengeId ? { ...c, optedIn: true, progress: Math.random() * c.target * 0.7 } : c
    );
    setChallenges(updated);

    const saveState: Record<string, { optedIn: boolean; progress: number; completed: boolean }> = {};
    updated.forEach((c) => {
      saveState[c.id] = { optedIn: c.optedIn, progress: c.progress, completed: c.completed };
    });
    saveChallengeData(saveState);
  }, [challenges]);

  const activeChallenge = challenges.find((c) => c.type === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Trading Challenges
        </h1>
        <p className="text-muted-foreground">
          Compete in monthly challenges, track your progress, and earn special badges.
        </p>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {challenges.map((challenge, index) => {
          const Icon = challengeIcons[challenge.icon] || Trophy;
          const progressPct = challenge.optedIn
            ? Math.min((challenge.progress / challenge.target) * 100, 100)
            : 0;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`glass-card-hover cursor-pointer transition-all ${activeTab === challenge.type ? "ring-1 ring-accent/30" : ""}`}
                onClick={() => setActiveTab(challenge.type)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                      <Icon className="h-5 w-5 text-yellow-500" />
                    </div>
                    {challenge.completed && (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Complete
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold mb-1">{challenge.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{challenge.description}</p>

                  {challenge.optedIn ? (
                    <>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-mono font-semibold">
                          {challenge.progress.toFixed(1)} / {challenge.target} {challenge.unit}
                        </span>
                      </div>
                      <Progress value={progressPct} className="h-1.5" />
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        optIn(challenge.id);
                      }}
                    >
                      Join Challenge
                    </Button>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {challenge.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {challenge.month}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {challenge.reward}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Challenge Detail / Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Challenge Leaderboard</CardTitle>
            <CardDescription>
              {activeChallenge?.title} — Top performers this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaderboardData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={70} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v) => [`${v}`, activeChallenge?.unit || ""]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {leaderboardData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.name === "You" ? "#22C55E" : i < 3 ? "#f59e0b" : "#3b82f6"}
                        fillOpacity={entry.name === "You" ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Top Participants</CardTitle>
            <CardDescription>Ranked by {activeChallenge?.unit || "performance"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <motion.div
                  key={entry.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${entry.name === "You" ? "bg-accent/5 border border-accent/20" : "hover:bg-white/[0.02]"} transition-colors`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${index < 3 ? "bg-yellow-500/10" : "bg-primary-800/50"}`}>
                    {index < 3 ? (
                      <Medal className={`h-4 w-4 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-600"}`} />
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground">#{entry.rank}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`text-sm font-medium ${entry.name === "You" ? "text-accent" : ""}`}>
                      {entry.name}
                    </p>
                  </div>

                  <span className="text-sm font-bold font-mono data-text">
                    {entry.value.toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Challenge Rewards
          </CardTitle>
          <CardDescription>Complete challenges to earn special badges and recognition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`text-center p-4 rounded-lg border ${challenge.completed ? "border-yellow-500/20 bg-yellow-500/5" : "border-white/5 bg-primary-800/20"}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full mx-auto mb-2 ${challenge.completed ? "bg-yellow-500/10" : "bg-primary-800/50"}`}>
                  <Trophy className={`h-6 w-6 ${challenge.completed ? "text-yellow-500" : "text-muted-foreground"}`} />
                </div>
                <p className="text-xs font-semibold mb-0.5">{challenge.reward}</p>
                <p className="text-[10px] text-muted-foreground">{challenge.title}</p>
                {challenge.completed && (
                  <Badge variant="success" className="text-[10px] mt-2">Earned</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
