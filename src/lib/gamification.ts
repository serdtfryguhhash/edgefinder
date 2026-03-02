"use client";

const STORAGE_KEY = "edgefinder_gamification";

export type XPAction =
  | "strategy_created"
  | "backtest_run"
  | "strategy_published"
  | "strategy_cloned"
  | "daily_visit";

export type TraderRank = "Novice" | "Analyst" | "Strategist" | "Quant" | "Master";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface GamificationData {
  totalXP: number;
  xpHistory: { action: XPAction; amount: number; timestamp: string }[];
  achievements: Achievement[];
  lastDailyVisit: string;
}

const XP_VALUES: Record<XPAction, number> = {
  strategy_created: 50,
  backtest_run: 25,
  strategy_published: 100,
  strategy_cloned: 200,
  daily_visit: 10,
};

const RANK_THRESHOLDS: { rank: TraderRank; minXP: number }[] = [
  { rank: "Master", minXP: 4000 },
  { rank: "Quant", minXP: 1500 },
  { rank: "Strategist", minXP: 600 },
  { rank: "Analyst", minXP: 200 },
  { rank: "Novice", minXP: 0 },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first_strategy", title: "First Strategy", description: "Create your first trading strategy", icon: "GitBranch", unlockedAt: null },
  { id: "first_backtest", title: "First Backtest", description: "Run your first backtest", icon: "Play", unlockedAt: null },
  { id: "publisher", title: "Publisher", description: "Publish a strategy to the community", icon: "Share2", unlockedAt: null },
  { id: "streak_7", title: "Week Warrior", description: "Visit 7 days in a row", icon: "Flame", unlockedAt: null },
  { id: "xp_500", title: "Rising Star", description: "Earn 500 XP", icon: "Star", unlockedAt: null },
  { id: "xp_2000", title: "Power Trader", description: "Earn 2000 XP", icon: "Zap", unlockedAt: null },
  { id: "strategies_5", title: "Strategist", description: "Create 5 strategies", icon: "Layers", unlockedAt: null },
  { id: "backtests_10", title: "Data Driven", description: "Run 10 backtests", icon: "BarChart3", unlockedAt: null },
  { id: "cloned_once", title: "Trendsetter", description: "Have a strategy cloned by someone", icon: "Copy", unlockedAt: null },
  { id: "master_rank", title: "Grand Master", description: "Reach Master rank", icon: "Crown", unlockedAt: null },
];

function getDefault(): GamificationData {
  return {
    totalXP: 0,
    xpHistory: [],
    achievements: DEFAULT_ACHIEVEMENTS,
    lastDailyVisit: "",
  };
}

function getData(): GamificationData {
  if (typeof window === "undefined") return getDefault();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefault();
  try {
    const data = JSON.parse(stored) as GamificationData;
    if (!data.achievements || data.achievements.length < DEFAULT_ACHIEVEMENTS.length) {
      const existingIds = new Set((data.achievements || []).map((a: Achievement) => a.id));
      const merged = [
        ...(data.achievements || []),
        ...DEFAULT_ACHIEVEMENTS.filter((a) => !existingIds.has(a.id)),
      ];
      data.achievements = merged;
    }
    return data;
  } catch {
    return getDefault();
  }
}

function saveData(data: GamificationData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRank(xp: number): TraderRank {
  for (const threshold of RANK_THRESHOLDS) {
    if (xp >= threshold.minXP) return threshold.rank;
  }
  return "Novice";
}

export function getNextRankThreshold(xp: number): { rank: TraderRank; xpNeeded: number } | null {
  const currentRank = getRank(xp);
  const currentIndex = RANK_THRESHOLDS.findIndex((t) => t.rank === currentRank);
  if (currentIndex <= 0) return null;
  const next = RANK_THRESHOLDS[currentIndex - 1];
  return { rank: next.rank, xpNeeded: next.minXP - xp };
}

export function getCurrentRankProgress(xp: number): { current: number; max: number; percent: number } {
  const currentRank = getRank(xp);
  const currentIndex = RANK_THRESHOLDS.findIndex((t) => t.rank === currentRank);
  const currentMin = RANK_THRESHOLDS[currentIndex].minXP;

  if (currentIndex <= 0) {
    return { current: xp, max: xp, percent: 100 };
  }

  const nextMin = RANK_THRESHOLDS[currentIndex - 1].minXP;
  const progress = xp - currentMin;
  const range = nextMin - currentMin;
  return { current: progress, max: range, percent: Math.min(100, (progress / range) * 100) };
}

export function awardXP(action: XPAction): {
  xpAwarded: number;
  totalXP: number;
  rank: TraderRank;
  newAchievements: Achievement[];
  rankUp: boolean;
} {
  const data = getData();
  const oldRank = getRank(data.totalXP);

  if (action === "daily_visit") {
    const today = new Date().toISOString().split("T")[0];
    if (data.lastDailyVisit === today) {
      return {
        xpAwarded: 0,
        totalXP: data.totalXP,
        rank: oldRank,
        newAchievements: [],
        rankUp: false,
      };
    }
    data.lastDailyVisit = today;
  }

  const xpAmount = XP_VALUES[action];
  data.totalXP += xpAmount;
  data.xpHistory.push({
    action,
    amount: xpAmount,
    timestamp: new Date().toISOString(),
  });

  const newRank = getRank(data.totalXP);
  const rankUp = newRank !== oldRank;

  const newAchievements = checkAchievements(data, action);

  saveData(data);

  return {
    xpAwarded: xpAmount,
    totalXP: data.totalXP,
    rank: newRank,
    newAchievements,
    rankUp,
  };
}

function checkAchievements(data: GamificationData, action: XPAction): Achievement[] {
  const unlocked: Achievement[] = [];
  const now = new Date().toISOString();

  const strategyCount = data.xpHistory.filter((h) => h.action === "strategy_created").length;
  const backtestCount = data.xpHistory.filter((h) => h.action === "backtest_run").length;

  const checks: { id: string; condition: boolean }[] = [
    { id: "first_strategy", condition: action === "strategy_created" && strategyCount >= 1 },
    { id: "first_backtest", condition: action === "backtest_run" && backtestCount >= 1 },
    { id: "publisher", condition: action === "strategy_published" },
    { id: "xp_500", condition: data.totalXP >= 500 },
    { id: "xp_2000", condition: data.totalXP >= 2000 },
    { id: "strategies_5", condition: strategyCount >= 5 },
    { id: "backtests_10", condition: backtestCount >= 10 },
    { id: "cloned_once", condition: action === "strategy_cloned" },
    { id: "master_rank", condition: getRank(data.totalXP) === "Master" },
  ];

  for (const check of checks) {
    const achievement = data.achievements.find((a) => a.id === check.id);
    if (achievement && !achievement.unlockedAt && check.condition) {
      achievement.unlockedAt = now;
      unlocked.push(achievement);
    }
  }

  return unlocked;
}

export function getGamificationData(): GamificationData {
  return getData();
}

export function getXPForAction(action: XPAction): number {
  return XP_VALUES[action];
}

export function getRankColor(rank: TraderRank): string {
  switch (rank) {
    case "Master": return "text-yellow-500";
    case "Quant": return "text-purple-400";
    case "Strategist": return "text-blue-400";
    case "Analyst": return "text-accent";
    case "Novice": return "text-muted-foreground";
  }
}

export function getRankBgColor(rank: TraderRank): string {
  switch (rank) {
    case "Master": return "bg-yellow-500/10";
    case "Quant": return "bg-purple-400/10";
    case "Strategist": return "bg-blue-400/10";
    case "Analyst": return "bg-accent/10";
    case "Novice": return "bg-muted/50";
  }
}
