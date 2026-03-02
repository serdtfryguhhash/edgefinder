"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  getGamificationData,
  getRank,
  getCurrentRankProgress,
  getNextRankThreshold,
  getRankColor,
  getRankBgColor,
  awardXP,
} from "@/lib/gamification";
import type { TraderRank } from "@/lib/gamification";

export function XPBar({ collapsed = false }: { collapsed?: boolean }) {
  const [totalXP, setTotalXP] = useState(0);
  const [rank, setRank] = useState<TraderRank>("Novice");
  const [progress, setProgress] = useState({ current: 0, max: 100, percent: 0 });
  const [nextRank, setNextRank] = useState<{ rank: TraderRank; xpNeeded: number } | null>(null);

  useEffect(() => {
    const result = awardXP("daily_visit");
    setTotalXP(result.totalXP);
    setRank(result.rank);
    setProgress(getCurrentRankProgress(result.totalXP));
    setNextRank(getNextRankThreshold(result.totalXP));
  }, []);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 px-2 py-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getRankBgColor(rank)}`}>
          <Zap className={`h-4 w-4 ${getRankColor(rank)}`} />
        </div>
        <span className="text-[10px] font-bold data-text">{totalXP}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-3 mb-3 p-3 rounded-lg bg-primary-800/30 border border-white/5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-md ${getRankBgColor(rank)}`}>
            <Zap className={`h-3.5 w-3.5 ${getRankColor(rank)}`} />
          </div>
          <span className={`text-xs font-semibold ${getRankColor(rank)}`}>{rank}</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{totalXP} XP</span>
      </div>
      <Progress value={progress.percent} className="h-1.5 mb-1" />
      {nextRank && (
        <p className="text-[10px] text-muted-foreground">
          {nextRank.xpNeeded} XP to {nextRank.rank}
        </p>
      )}
    </motion.div>
  );
}
