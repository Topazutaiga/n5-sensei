"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VOCAB, KANJI, GRAMMAR } from "@/data";

const TOTAL_CARDS = VOCAB.length + KANJI.length + GRAMMAR.length;

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, mastered: 0, total: TOTAL_CARDS, streak: 0 });

  function loadStats() {
    const raw = localStorage.getItem("n5sensei_cards");
    let reviewed = 0;
    let mastered = 0;
    if (raw) {
      try {
        const cards = JSON.parse(raw) as Record<string, { level: number; reviewed: number }>;
        const entries = Object.values(cards);
        reviewed = entries.reduce((sum, c) => sum + (c.reviewed || 0), 0);
        mastered = entries.filter((c) => c.level >= 3).length;
      } catch {}
    }

    let streak = 0;
    const streakRaw = localStorage.getItem("n5sensei_streak");
    if (streakRaw) {
      try {
        const streakData = JSON.parse(streakRaw) as { lastDate: string; count: number };
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (streakData.lastDate === today || streakData.lastDate === yesterday) {
          streak = streakData.count;
        }
      } catch {}
    }

    setStats({ reviewed, mastered, total: TOTAL_CARDS, streak });
  }

  useEffect(() => {
    setMounted(true);
    loadStats();
    const interval = setInterval(loadStats, 2000);
    window.addEventListener("focus", loadStats);
    return () => { clearInterval(interval); window.removeEventListener("focus", loadStats); };
  }, []);

  const masteryPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
  const vocabPct = VOCAB.length > 0 ? Math.round((stats.mastered / (TOTAL_CARDS) * 100)) : 0;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#252220] rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">{stats.reviewed}</div>
          <div className="text-xs text-gray-400 mt-1">{t("reviewed")}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">{stats.mastered}</div>
          <div className="text-xs text-gray-400 mt-1">{t("mastered")}</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold">🔥 {stats.streak}</div>
          <div className="text-xs text-gray-400 mt-1">{t("streak")}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252220] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500 font-medium">{t("progress")}</span>
          <span className="font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">{masteryPct}% ({stats.mastered}/{stats.total})</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${masteryPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{lang === "en" ? "Vocab: " + VOCAB.length : "Vocabulaire : " + VOCAB.length}</span>
          <span>{lang === "en" ? "Kanji: " + KANJI.length : "Kanji : " + KANJI.length}</span>
          <span>{lang === "en" ? "Gram: " + GRAMMAR.length : "Grammaire : " + GRAMMAR.length}</span>
        </div>
      </div>

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
