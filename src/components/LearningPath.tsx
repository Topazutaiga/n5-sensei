"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type GamificationState } from "@/lib/gamification";

interface PathNode {
  href: string;
  icon: string;
  label: string;
  bgGradient: string;
  shadowColor: string;
  desc: string;
  estimate: string;
}

const PATH_NODES: PathNode[] = [
  { href: "/dashboard/learn", icon: "⚡", label: "Flashcards", bgGradient: "from-green-400 to-emerald-500", shadowColor: "rgba(34,197,94,0.3)", desc: "Vocabulaire, kanji, grammaire", estimate: "5-10 min" },
  { href: "/dashboard/quiz", icon: "📝", label: "Quiz", bgGradient: "from-violet-400 to-purple-500", shadowColor: "rgba(168,85,247,0.3)", desc: "Teste tes lectures", estimate: "3-5 min" },
  { href: "/dashboard/listening", icon: "🔊", label: "Écoute", bgGradient: "from-orange-400 to-amber-500", shadowColor: "rgba(249,115,22,0.3)", desc: "Phrases et dialogues N5", estimate: "5-8 min" },
  { href: "/dashboard/exercises", icon: "🎯", label: "Exercices JLPT", bgGradient: "from-rose-400 to-red-500", shadowColor: "rgba(239,68,68,0.3)", desc: "Type examen", estimate: "5-10 min" },
];

interface LearningPathProps {
  gam: GamificationState | null;
  dueCards: number;
}

export default function LearningPath({ gam, dueCards }: LearningPathProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalReviewed = gam?.totalReviewed || 0;
  const totalQuiz = gam?.totalQuizComplete || 0;
  const totalCorrect = gam?.totalCorrect || 0;

  const getState = (minReviewed: number, minActions: number, href: string): "locked" | "available" | "current" | "completed" => {
    if (pathname.startsWith(href)) return "current";
    if (href === "/dashboard/learn") return totalReviewed > 0 ? "completed" : "available";
    const act = href === "/dashboard/quiz" ? totalQuiz : totalCorrect;
    if (act > 0) return "completed";
    if (totalReviewed >= minReviewed) return "available";
    return "locked";
  };

  if (!mounted) return null;

  return (
    <div className="relative py-1">
      {/* Vertical connecting line */}
      <div className="absolute left-[25px] top-12 bottom-12 w-[3px] bg-gradient-to-b from-green-400 via-purple-400 via-orange-400 to-red-400 rounded-full opacity-20" />

      <div className="space-y-3">
        {PATH_NODES.map((node, i) => {
          const thresholds = [[0, 0], [5, 0], [10, 3], [15, 5]];
          const state = getState(thresholds[i][0], thresholds[i][1], node.href);
          const isLocked = state === "locked";
          const isCompleted = state === "completed";
          const isCurrent = state === "current";

          return (
            <div key={node.href} className="relative flex items-start gap-4">
              {/* Step circle */}
              <Link
                href={isLocked ? "#" : node.href}
                onClick={(e) => { if (isLocked) e.preventDefault(); }}
                className={`relative z-10 flex-shrink-0 w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  isLocked
                    ? "bg-gray-200/50 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed"
                    : isCompleted
                    ? `bg-gradient-to-br ${node.bgGradient} text-white shadow-lg`
                    : `bg-gradient-to-br ${node.bgGradient} text-white shadow-lg animate-pulse-soft`
                } ${isCurrent ? "ring-4 ring-offset-2 ring-offset-[#fdf6f0] dark:ring-offset-[#1c1a18] ring-green-400 scale-110" : ""}`}
                style={isCompleted || isCurrent ? { boxShadow: `0 4px 16px ${node.shadowColor}` } : {}}
              >
                {isCompleted ? "✓" : isLocked ? "🔒" : node.icon}
              </Link>

              {/* Content card */}
              <Link
                href={isLocked ? "#" : node.href}
                onClick={(e) => { if (isLocked) e.preventDefault(); }}
                className={`flex-1 min-w-0 rounded-2xl p-4 transition-all duration-300 ${
                  isLocked
                    ? "glass-card opacity-50 cursor-not-allowed"
                    : isCurrent
                    ? "glass-card-strong border-green-300 dark:border-green-700 shadow-lg"
                    : "glass-card hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{node.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                      isLocked ? "bg-gray-100 dark:bg-gray-800 text-gray-400" :
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    }`}>
                      {isCompleted ? "Complété" : isLocked ? "Fermé" : "Disponible"}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{node.estimate}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{node.desc}</p>
                {isCompleted && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] text-green-500 font-semibold">✓ Terminé</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] text-gray-400">+25 XP</span>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
