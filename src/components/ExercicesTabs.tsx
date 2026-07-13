"use client";

import { useState } from "react";
import Quiz from "./Quiz";
import ListeningExercise from "./ListeningExercise";
import JLPTExercises from "./JLPTExercises";

type TabType = "quiz" | "listening" | "jlpt";

const TABS: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
  { id: "quiz", labelFr: "Quiz", labelEn: "Quiz", icon: "📝" },
  { id: "listening", labelFr: "Écoute", labelEn: "Listening", icon: "🔊" },
  { id: "jlpt", labelFr: "JLPT", labelEn: "JLPT", icon: "🎯" },
];

export default function ExercicesTabs() {
  const [tab, setTab] = useState<TabType>("quiz");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                : "border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
            }`}
          >
            {t.icon} {t.labelFr}
          </button>
        ))}
      </div>

      {tab === "quiz" && <Quiz />}
      {tab === "listening" && <ListeningExercise />}
      {tab === "jlpt" && <JLPTExercises />}
    </div>
  );
}
