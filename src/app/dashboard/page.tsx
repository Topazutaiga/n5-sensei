"use client";

import { useEffect, useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { VOCAB, KANJI, GRAMMAR } from "@/data";
import { getGamification, getLevelProgress, updateMissions, type GamificationState, getInitialState } from "@/lib/gamification";
import Mascot from "@/components/Mascot";
import DailyGoal from "@/components/DailyGoal";
import LearningPath from "@/components/LearningPath";
import { showToast } from "@/components/CelebrationToast";

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
  const [showTip, setShowTip] = useState(0);
  const prevGam = useRef<GamificationState>(getInitialState());
  const goalNotified = useRef(false);

  function refresh() {
    const g = updateMissions(getGamification());
    const prev = prevGam.current;

    // Check for new achievements
    if (prev && g) {
      g.achievements.forEach((a) => {
        const wasLocked = prev.achievements.find((pa) => pa.id === a.id && !pa.unlocked);
        if (wasLocked && a.unlocked) {
          const labels: Record<string, { title: string; desc: string }> = {
            first_review: { title: "Première révision ! 🎯", desc: "Tu as révisé ta première carte !" },
            streak_7: { title: "7 jours d'affilée ! 🔥", desc: "Une semaine entière ! Continue !" },
            streak_30: { title: "30 jours !!! 👑", desc: "Un mois complet. Tu es un vrai samouraï !" },
            master_50: { title: "50 cartes maîtrisées ⭐", desc: "Tu progresses sérieusement !" },
            master_100: { title: "100 cartes maîtrisées 🌟", desc: "Incroyable ! Quel niveau !" },
            quiz_10: { title: "10 quiz complétés 📝", desc: "Tu te prépares comme un champion !" },
            quiz_perfect: { title: "50 bonnes réponses 🏆", desc: "La précision est ta force !" },
            review_500: { title: "500 révisions ! 📚", desc: "Une machine de guerre !" },
          };
          const info = labels[a.id];
          if (info) showToast(a.emoji, info.title, info.desc, "from-amber-400 to-yellow-300");
        }
      });

      // Check level up
      if (g.level > prev.level) {
        showToast("🎊", `Niveau ${g.level} !`, "Félicitations, tu progresses !", "from-green-400 to-emerald-500");
      }

      // Check daily goal
      if (g.dailyXp >= 50 && !goalNotified.current) {
        showToast("🎯", "Objectif quotidien atteint !", "Quel dévouement !", "from-green-400 to-emerald-500");
        goalNotified.current = true;
      }
      if (g.dailyXp < 50) goalNotified.current = false;
    }

    prevGam.current = g;
    setGam(g);
    setDueCards(getDueCards());
    setShowTip(Math.floor(Math.random() * 3));
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
  const masteredCount = Object.values(
    JSON.parse(typeof window !== "undefined" ? localStorage.getItem("n5sensei_cards") || "{}" : "{}")
  ).filter((c: any) => c.level >= 3).length;

  const tips = [
    { emoji: "💡", text: lang === "en" ? "10 min daily > 1h once a week" : "10 min par jour > 1h d'affilée" },
    { emoji: "📖", text: lang === "en" ? "Review kanji with stroke order" : "Révise les kanji dans l'ordre des traits" },
    { emoji: "🔊", text: lang === "en" ? "Listen to phrases at slow speed first" : "Écoute les phrases en lent d'abord" },
  ];

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Mascot greeting */}
      <Mascot gam={gam} dueCards={dueCards} showLevelUp />

      {/* Daily Goal Ring */}
      <DailyGoal currentXp={gam.dailyXp} streak={gam.streak} level={gam.level} />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { value: dueCards, label: lang === "en" ? "due" : "à réviser", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { value: gam.dailyXp, label: "XP " + (lang === "en" ? "today" : "ajd"), color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
          { value: gam.streak, label: lang === "en" ? "streak" : "série 🔥", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { value: masteredCount, label: lang === "en" ? "mastered" : "maîtrisés", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl py-3 px-2 text-center animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5 leading-tight font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Level progress bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Niveau {gam.level}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold">
              {xpInfo.pct}%
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">{gam.xp} / {xpInfo.current} XP</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full transition-all duration-700 ease-out shadow-sm" style={{ width: `${xpInfo.pct}%` }} />
        </div>
        {unclaimedMissions > 0 && (
          <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 animate-fade-in">
            <span>🎁</span>
            <span>{unclaimedMissions} {lang === "en" ? "reward(s) available!" : "récompense(s) disponible(s) !"}</span>
          </div>
        )}
      </div>

      {/* Tip of the moment */}
      <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3">
        <span className="text-2xl">{tips[showTip].emoji}</span>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tips[showTip].text}</p>
      </div>

      {/* Learning Path */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-bold text-sm">{lang === "en" ? "Your path" : "Ton parcours"}</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800" />
        </div>
        <LearningPath gam={gam} dueCards={dueCards} />
      </div>
    </div>
  );
}
