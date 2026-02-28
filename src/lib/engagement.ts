"use client";

const STORAGE_KEY = "app_engagement";

interface EngagementData {
  lastVisit: string;
  currentStreak: number;
  longestStreak: number;
  totalVisits: number;
  actionsCompleted: number;
  userName: string;
  joinedDate: string;
}

function getEngagement(): EngagementData {
  if (typeof window === "undefined") return getDefault();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefault();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefault();
  }
}

function getDefault(): EngagementData {
  return {
    lastVisit: "",
    currentStreak: 0,
    longestStreak: 0,
    totalVisits: 0,
    actionsCompleted: 0,
    userName: "",
    joinedDate: new Date().toISOString().split("T")[0],
  };
}

function saveEngagement(data: EngagementData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function trackVisit(): EngagementData {
  const data = getEngagement();
  const today = new Date().toISOString().split("T")[0];

  if (data.lastVisit === today) return data;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (data.lastVisit === yesterday) {
    data.currentStreak += 1;
  } else if (data.lastVisit && data.lastVisit !== today) {
    data.currentStreak = 1;
  } else {
    data.currentStreak = 1;
  }

  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  data.totalVisits += 1;
  data.lastVisit = today;

  if (!data.joinedDate) data.joinedDate = today;

  saveEngagement(data);
  return data;
}

export function trackAction(): void {
  const data = getEngagement();
  data.actionsCompleted += 1;
  saveEngagement(data);
}

export function setUserName(name: string): void {
  const data = getEngagement();
  data.userName = name;
  saveEngagement(data);
}

export function getStats(): EngagementData {
  return getEngagement();
}
