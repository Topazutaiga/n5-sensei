"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ reviewed: 0, mastered: 0, streak: 0 });

  useEffect(() => {
    const raw = localStorage.getItem("n5sensei_cards");
    if (raw) {
      const cards = JSON.parse(raw);
      const entries = Object.values(cards) as { level: number; reviewed: number }[];
      setStats({
        reviewed: entries.reduce((s, c) => s + (c.reviewed || 0), 0),
        mastered: entries.filter((c) => c.level >= 3).length,
        streak: 0,
      });
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#252220] rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#c0392b]">{stats.reviewed}</div>
          <div className="text-xs text-gray-500">revus</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#c0392b]">{stats.mastered}</div>
          <div className="text-xs text-gray-500">maîtrisés</div>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#c0392b]">🔥 {stats.streak}</div>
          <div className="text-xs text-gray-500">jours</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/learn"
          className="bg-white dark:bg-[#252220] rounded-xl p-6 text-center shadow-sm hover:ring-2 hover:ring-[#c0392b] transition-all"
        >
          <div className="text-3xl mb-2">⚡</div>
          <div className="font-semibold">Apprendre</div>
        </Link>
        <Link
          href="/dashboard/quiz"
          className="bg-white dark:bg-[#252220] rounded-xl p-6 text-center shadow-sm hover:ring-2 hover:ring-[#c0392b] transition-all"
        >
          <div className="text-3xl mb-2">📝</div>
          <div className="font-semibold">Quiz</div>
        </Link>
        <Link
          href="/dashboard/listening"
          className="bg-white dark:bg-[#252220] rounded-xl p-6 text-center shadow-sm hover:ring-2 hover:ring-[#c0392b] transition-all"
        >
          <div className="text-3xl mb-2">🔊</div>
          <div className="font-semibold">Écoute</div>
        </Link>
        <div className="bg-white dark:bg-[#252220] rounded-xl p-6 text-center shadow-sm opacity-50">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-semibold text-gray-400">Bientôt</div>
        </div>
      </div>
    </div>
  );
}
