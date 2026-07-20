"use client";

import { useEffect, useState } from "react";

const DAILY_XP_GOAL = 50;

interface DailyGoalProps {
  currentXp: number;
  streak: number;
  level: number;
}

export default function DailyGoal({ currentXp, streak, level }: DailyGoalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pct = Math.min(100, Math.round((currentXp / DAILY_XP_GOAL) * 100));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-[#252220] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
      {/* Circular progress */}
      <div className="relative flex-shrink-0 w-[90px] h-[90px] flex items-center justify-center">
        <svg className="w-[90px] h-[90px] -rotate-90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" className="dark:stroke-gray-800" />
          <circle
            cx="45" cy="45" r={radius}
            fill="none"
            stroke="url(#dailyGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="dailyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{currentXp}</span>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">XP</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold">Objectif quotidien</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white">
            {pct}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          {pct >= 100
            ? "Objectif atteint ! 🎉 Continue comme ça !"
            : `Encore ${DAILY_XP_GOAL - currentXp} XP pour atteindre ton objectif`}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            🔥 <span className="font-semibold text-gray-600 dark:text-gray-300">{streak}</span> jours
          </span>
          <span className="flex items-center gap-1">
            🏆 <span className="font-semibold text-gray-600 dark:text-gray-300">Niveau {level}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
