"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type GamificationState } from "@/lib/gamification";

interface PathNode {
  href: string;
  icon: string;
  label: string;
  bgColor: string;
  desc: string;
  estimate: string;
}

const PATH_NODES: PathNode[] = [
  { href: "/dashboard/learn", icon: "⚡", label: "Flashcards", bgColor: "from-green-400 to-emerald-500", desc: "Vocab, kanji, grammaire", estimate: "5-10 min" },
  { href: "/dashboard/quiz", icon: "📝", label: "Quiz", bgColor: "from-purple-400 to-violet-500", desc: "Quiz de lecture", estimate: "3-5 min" },
  { href: "/dashboard/listening", icon: "🔊", label: "Écoute", bgColor: "from-orange-400 to-amber-500", desc: "Phrases et dialogues", estimate: "5-8 min" },
  { href: "/dashboard/exercises", icon: "🎯", label: "Exercices", bgColor: "from-red-400 to-rose-500", desc: "Type examen JLPT", estimate: "5-10 min" },
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
  // Consider a node "completed" if user has done it at least once
  const nodeProgress = {
    "/dashboard/learn": totalReviewed > 0 ? "completed" as const : (totalReviewed > 0 ? "completed" as const : "available" as const),
    "/dashboard/quiz": (gam?.totalQuizComplete || 0) > 0 ? "completed" as const : (totalReviewed > 5 ? "available" as const : "locked" as const),
    "/dashboard/listening": (gam?.totalCorrect || 0) > 3 ? "completed" as const : (totalReviewed > 10 ? "available" as const : "locked" as const),
    "/dashboard/exercises": (gam?.totalCorrect || 0) > 5 ? "completed" as const : (totalReviewed > 15 ? "available" as const : "locked" as const),
  };

  if (!mounted) return null;

  return (
    <div className="relative py-2">
      {/* Vertical path line */}
      <div className="absolute left-[23px] top-10 bottom-10 w-[3px] bg-gradient-to-b from-green-400 via-purple-400 via-orange-400 to-red-400 rounded-full opacity-30" />

      <div className="space-y-0">
        {PATH_NODES.map((node, i) => {
          const state = pathname.startsWith(node.href) ? "current" : nodeProgress[node.href as keyof typeof nodeProgress];
          const isLocked = state === "locked";
          const isCompleted = state === "completed";
          const isCurrent = state === "current";

          return (
            <div key={node.href} className="relative flex items-start gap-4 pb-8 last:pb-0">
              {/* Node circle */}
              <Link
                href={isLocked ? "#" : node.href}
                className={`relative z-10 flex-shrink-0 w-[50px] h-[50px] rounded-full flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 ${
                  isLocked
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-60"
                    : isCompleted
                    ? `bg-gradient-to-br ${node.bgColor} text-white shadow-md`
                    : `bg-gradient-to-br ${node.bgColor} text-white shadow-md animate-pulse-soft`
                } ${isCurrent ? "ring-4 ring-offset-2 ring-offset-[#fdf6f0] dark:ring-offset-[#1c1a18] ring-green-400 scale-110" : ""}`}
                onClick={(e) => { if (isLocked) e.preventDefault(); }}
              >
                {isCompleted ? "✓" : node.icon}
              </Link>

              {/* Content card */}
              <Link
                href={isLocked ? "#" : node.href}
                className={`flex-1 min-w-0 rounded-2xl p-4 border-2 transition-all duration-300 ${
                  isLocked
                    ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-50"
                    : isCurrent
                    ? "bg-white dark:bg-[#252220] border-green-400 dark:border-green-600 shadow-lg shadow-green-200/20 dark:shadow-green-900/20"
                    : "bg-white dark:bg-[#252220] border-gray-100 dark:border-gray-800 hover:border-green-300 hover:shadow-md"
                }`}
                onClick={(e) => { if (isLocked) e.preventDefault(); }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{node.label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isCompleted ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                      isLocked ? "bg-gray-100 dark:bg-gray-800 text-gray-400" :
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    }`}>
                      {isCompleted ? "Fait ✓" : isLocked ? "🔒" : "À faire"}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{node.estimate}</span>
                </div>
                <p className="text-xs text-gray-500">{node.desc}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
