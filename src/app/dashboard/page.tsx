"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function DashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState({ reviewed: 0, mastered: 0, total: 0 });

  useEffect(() => {
    const raw = localStorage.getItem("n5sensei_cards");
    if (raw) {
      const cards = JSON.parse(raw);
      const entries = Object.values(cards) as { level: number; reviewed: number }[];
      setStats({
        reviewed: entries.reduce((s, c) => s + (c.reviewed || 0), 0),
        mastered: entries.filter((c) => c.level >= 3).length,
        total: 300,
      });
    }
  }, []);

  const masteryPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
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
          <div className="text-2xl font-bold">🔥</div>
          <div className="text-xs text-gray-400 mt-1">{t("streak")}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-[#252220] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500 font-medium">{t("progress")}</span>
          <span className="font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">{masteryPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${masteryPct}%` }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/learn"
          className="group bg-white dark:bg-[#252220] rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
          <div className="font-semibold text-sm">{t("flashcards")}</div>
          <div className="text-xs text-gray-400 mt-1">{t("flashcards_desc")}</div>
        </Link>
        <Link
          href="/dashboard/quiz"
          className="group bg-white dark:bg-[#252220] rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📝</div>
          <div className="font-semibold text-sm">{t("quiz")}</div>
          <div className="text-xs text-gray-400 mt-1">{t("quiz_desc")}</div>
        </Link>
        <Link
          href="/dashboard/listening"
          className="group bg-white dark:bg-[#252220] rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔊</div>
          <div className="font-semibold text-sm">{t("listening")}</div>
          <div className="text-xs text-gray-400 mt-1">{t("listening_desc")}</div>
        </Link>
        <Link
          href="/dashboard/exercises"
          className="group bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
          <div className="font-semibold text-sm text-white">{t("exercises")}</div>
          <div className="text-xs text-white/80 mt-1">{t("exercises_desc")}</div>
        </Link>
      </div>
    </div>
  );
}
