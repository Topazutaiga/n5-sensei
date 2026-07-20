"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VOCAB, KANJI, GRAMMAR } from "@/data";
import { getGamification, getLevelProgress, updateMissions, type GamificationState } from "@/lib/gamification";

const TOTAL_CARDS = VOCAB.length + KANJI.length + GRAMMAR.length;

const LEVEL_NAMES: Record<number, { fr: string; en: string; emoji: string }> = {
  1: { fr: "Débutant", en: "Beginner", emoji: "🌱" },
  2: { fr: "Apprenti", en: "Apprentice", emoji: "🌿" },
  3: { fr: "Étudiant", en: "Student", emoji: "📚" },
  4: { fr: "Motivé", en: "Motivated", emoji: "🔥" },
  5: { fr: "Assidu", en: "Diligent", emoji: "⭐" },
  6: { fr: "Expert", en: "Expert", emoji: "🌟" },
  7: { fr: "Maître", en: "Master", emoji: "👑" },
  8: { fr: "Légende", en: "Legend", emoji: "🏆" },
};

function getLevelName(level: number, lang: "fr" | "en") {
  const names = Object.keys(LEVEL_NAMES).map(Number);
  let closest = 1;
  for (const n of names) {
    if (n <= level && n >= closest) closest = n;
  }
  return LEVEL_NAMES[closest] || LEVEL_NAMES[1];
}

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

  const levelInfo = getLevelName(gam.level, lang);
  const xpInfo = getLevelProgress(gam);
  const unclaimedMissions = gam.dailyMissions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="space-y-5 pb-24">
      {/* Level & XP Card */}
      <div className="bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-3xl font-bold">{levelInfo.emoji} Niveau {gam.level}</div>
            <div className="text-sm text-white/80 mt-0.5">{levelInfo[lang === "en" ? "en" : "fr"]}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{gam.streak}🔥</div>
            <div className="text-xs text-white/80">{lang === "en" ? "day streak" : "jours d'affilée"}</div>
          </div>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${xpInfo.pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-white/70 mt-1">
          <span>{gam.xp} / {xpInfo.current} XP</span>
          <span>{unclaimedMissions > 0 ? (lang === "en" ? `${unclaimedMissions} rewards!` : `${unclaimedMissions} récompenses !`) : ""}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-[#252220] rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">{dueCards}</div>
          <div className="text-xs text-gray-400 mt-0.5">{lang === "en" ? "due today" : "à réviser"}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold">{gam.dailyXp}</div>
          <div className="text-xs text-gray-400 mt-0.5">{lang === "en" ? "XP today" : "XP aujourd'hui"}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold">{gam.totalReviewed}</div>
          <div className="text-xs text-gray-400 mt-0.5">{lang === "en" ? "total" : "total révisés"}</div>
        </div>
      </div>

      {/* Daily Missions */}
      <div className="bg-white dark:bg-[#252220] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <span>🎯</span>
          <span>{lang === "en" ? "Daily Missions" : "Missions quotidiennes"}</span>
          <span className="text-xs text-gray-400 font-normal ml-auto">{gam.dailyMissions.filter((m) => m.completed).length}/{gam.dailyMissions.length}</span>
        </h3>
        <div className="space-y-2">
          {gam.dailyMissions.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                m.claimed ? "bg-green-500 text-white" :
                m.completed ? "bg-amber-500 text-white" :
                "bg-gray-100 dark:bg-gray-800 text-gray-400"
              }`}>
                {m.claimed ? "✓" : m.completed ? "!" : String(m.progress)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{lang === "en" ? ({
                  mission_review_10: "Review 10 cards",
                  mission_quiz_1: "Complete a quiz",
                  mission_listen_3: "Practice listening 3x",
                  mission_correct_5: "Get 5 correct answers",
                })[m.id] || m.id : ({
                  mission_review_10: "Révise 10 cartes",
                  mission_quiz_1: "Fais un quiz",
                  mission_listen_3: "Pratique l'écoute 3x",
                  mission_correct_5: "5 bonnes réponses",
                })[m.id] || m.id}</div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-0.5">
                  <div className={`h-full rounded-full transition-all ${
                    m.claimed ? "bg-green-500" : "bg-gradient-to-r from-red-500 to-orange-400"
                  }`} style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }} />
                </div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{m.progress}/{m.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-[#252220] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <span>🏆</span>
          <span>{lang === "en" ? "Achievements" : "Succès"}</span>
          <span className="text-xs text-gray-400 font-normal ml-auto">{gam.achievements.filter((a) => a.unlocked).length}/{gam.achievements.length}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {gam.achievements.map((a) => (
            <div key={a.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              a.unlocked
                ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50"
            }`}>
              <span>{a.emoji}</span>
              <span>{t(a.id as keyof typeof t)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/learn"
          className="group bg-white dark:bg-[#252220] rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
          <div className="font-semibold text-sm">{t("flashcards")}</div>
          <div className="text-xs text-gray-400 mt-1">{t("flashcards_desc")}</div>
        </Link>
        <Link href="/dashboard/quiz"
          className="group bg-white dark:bg-[#252220] rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📝</div>
          <div className="font-semibold text-sm">{t("quiz")}</div>
          <div className="text-xs text-gray-400 mt-1">{t("quiz_desc")}</div>
        </Link>
        <Link href="/dashboard/listening"
          className="group bg-white dark:bg-[#252220] rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔊</div>
          <div className="font-semibold text-sm">{t("listening")}</div>
          <div className="text-xs text-gray-400 mt-1">{t("listening_desc")}</div>
        </Link>
        <Link href="/dashboard/exercises"
          className="group bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
          <div className="font-semibold text-sm text-white">{t("exercises")}</div>
          <div className="text-xs text-white/80 mt-1">{t("exercises_desc")}</div>
        </Link>
      </div>
    </div>
  );
}
