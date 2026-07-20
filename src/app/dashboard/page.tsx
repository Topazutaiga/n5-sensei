"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { VOCAB, KANJI, GRAMMAR } from "@/data";
import { getGamification, getLevelProgress, updateMissions, type GamificationState } from "@/lib/gamification";
import Mascot from "@/components/Mascot";
import DailyGoal from "@/components/DailyGoal";
import LearningPath from "@/components/LearningPath";

const TOTAL_CARDS = VOCAB.length + KANJI.length + GRAMMAR.length;

function getDueCards(): number {
  if (typeof window === "undefined") return TOTAL_CARDS;
  try {
    const raw = localStorage.getItem("n5sensei_cards");
    if (!raw) return TOTAL_CARDS;
    const cards = JSON.parse(raw) as Record<string, { nextReview: string }>;
    const today = new Date().toISOString().slice(0, 10);
    const reviewed = Object.keys(cards).length;
    const dueNow = Object.values(cards).filter((c) => c.nextReview <= today).length;
    const notReviewed = TOTAL_CARDS - reviewed;
    return notReviewed + dueNow;
  } catch { return TOTAL_CARDS; }
}

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [gam, setGam] = useState<GamificationState | null>(null);
  const [dueCards, setDueCards] = useState(0);

  function refresh() {
    const g = updateMissions(getGamification());
    setGam(g);
    setDueCards(getDueCards());
  }

  useEffect(() => {
    setMounted(true);
    refresh();
    const interval = setInterval(refresh, 3000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(interval); window.removeEventListener("focus", refresh); };
  }, []);

  if (!mounted || !gam) return null;

  const xpInfo = getLevelProgress(gam);
  const unclaimedMissions = gam.dailyMissions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="space-y-5 pb-24">
      {/* Mascot greeting */}
      <Mascot gam={gam} dueCards={dueCards} showLevelUp />

      {/* Daily Goal Ring + Level */}
      <DailyGoal currentXp={gam.dailyXp} streak={gam.streak} level={gam.level} />

      {/* Quick stats row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white dark:bg-[#252220] rounded-xl py-3 px-2 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">{dueCards}</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{lang === "en" ? "due" : "à rév."}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl py-3 px-2 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-lg font-bold text-purple-500">{gam.dailyXp}</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">XP {lang === "en" ? "today" : "ajd"}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl py-3 px-2 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-lg font-bold text-orange-500">{gam.streak}</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">🔥 {lang === "en" ? "streak" : "série"}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl py-3 px-2 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-lg font-bold text-red-500">{gam.totalReviewed}</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{lang === "en" ? "done" : "faits"}</div>
        </div>
      </div>

      {/* Level progress */}
      <div className="bg-white dark:bg-[#252220] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-500 font-semibold">Niveau {gam.level}</span>
          <span className="text-gray-400">{gam.xp} / {xpInfo.current} XP</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${xpInfo.pct}%` }} />
        </div>
        {unclaimedMissions > 0 && (
          <p className="text-xs text-amber-500 mt-2 font-semibold flex items-center gap-1">
            <span>🎁</span>
            {lang === "en" ? `${unclaimedMissions} reward(s) available!` : `${unclaimedMissions} récompense(s) disponible(s) !`}
          </p>
        )}
      </div>

      {/* Duolingo-style Learning Path */}
      <div>
        <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
          <span>🗺️</span>
          <span>{lang === "en" ? "Your learning path" : "Ton parcours"}</span>
        </h3>
        <p className="text-xs text-gray-400 mb-3">{lang === "en" ? "Complete each module to unlock the next" : "Termine chaque module pour débloquer le suivant"}</p>
        <LearningPath gam={gam} dueCards={dueCards} />
      </div>
    </div>
  );
}
