"use client";

import { useEffect, useState } from "react";
import { trackVisit } from "@/lib/engagement";
import { Flame } from "lucide-react";

export function StreakBadge() {
  const [streak, setStreak] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const data = trackVisit();
    setStreak(data.currentStreak);
    setTotalVisits(data.totalVisits);
  }, []);

  if (streak === 0) return null;

  return (
    <div
      className="relative flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Flame className="w-4 h-4" />
      <span>{streak}</span>
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
          <div className="font-semibold">{streak} day streak!</div>
          <div className="text-gray-400">{totalVisits} total visits</div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}
