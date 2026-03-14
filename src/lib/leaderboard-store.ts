import { SAMPLE_LEADERBOARD } from "@/constants";

export interface LeaderboardEntry {
  rank: number;
  strategy: string;
  author: string;
  market: string;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trades: number;
  clones: number;
}

const STORAGE_KEY = "edgefinder_leaderboard";

function getStoredLeaderboard(): LeaderboardEntry[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof window === "undefined") return;
  // Re-rank
  entries.sort((a, b) => b.totalReturn - a.totalReturn);
  entries.forEach((entry, i) => (entry.rank = i + 1));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getLeaderboard(): LeaderboardEntry[] {
  const stored = getStoredLeaderboard();
  if (stored && stored.length > 0) return stored;
  // Initialize with sample data, mapping from constants shape to store shape
  const initial: LeaderboardEntry[] = SAMPLE_LEADERBOARD.map((entry, i) => ({
    rank: i + 1,
    strategy: entry.strategy_name,
    author: entry.author_name,
    market: entry.market,
    totalReturn: entry.total_return_pct,
    sharpeRatio: entry.sharpe_ratio,
    maxDrawdown: entry.max_drawdown_pct,
    winRate: entry.win_rate,
    trades: entry.total_trades,
    clones: entry.clone_count,
  }));
  saveLeaderboard(initial);
  return initial;
}

export function submitToLeaderboard(entry: Omit<LeaderboardEntry, "rank">): LeaderboardEntry[] {
  const entries = getLeaderboard();
  const newEntry = { ...entry, rank: 0 };
  entries.push(newEntry);
  saveLeaderboard(entries);
  return entries;
}

export function updateCloneCount(strategy: string): LeaderboardEntry[] {
  const entries = getLeaderboard();
  const entry = entries.find((e) => e.strategy === strategy);
  if (entry) {
    entry.clones += 1;
    saveLeaderboard(entries);
  }
  return entries;
}
