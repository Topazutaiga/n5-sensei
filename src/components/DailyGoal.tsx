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
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  if (!mounted) return null;

  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-5 animate-fade-in">
      {/* Circular progress */}
      <div className="relative flex-shrink-0 w-[96px] h-[96px] flex items-center justify-center">
        <svg className="w-[96px] h-[96px] -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#f0e8e0" strokeWidth="7" className="dark:stroke-gray-800" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="url(#dgGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out drop-shadow-sm"
          />
          {pct >= 100 && (
            <path d="M32 48 l10 10 l22 -22" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce-in" />
          )}
          <defs>
            <linearGradient id="dgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${pct >= 100 ? "text-green-500" : "text-gray-800 dark:text-gray-200"}`}>{currentXp}</span>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">XP</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-sm">Objectif quotidien</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            pct >= 100
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
          }`}>
            {pct >= 100 ? "Complété ✓" : `${pct}%`}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
          {pct >= 100
            ? "Objectif atteint ! � Quelle discipline !"
            : `Encore ${DAILY_XP_GOAL - currentXp} XP pour atteindre ton objectif`}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">{streak}</span>
            <span>jours</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-base">🏆</span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">Niveau {level}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
