"use client";

import { useState, useMemo } from "react";
import Quiz from "./Quiz";
import ListeningExercise from "./ListeningExercise";
import JLPTExercises from "./JLPTExercises";
import { LISTENING } from "@/data";
import { useI18n } from "@/lib/i18n";

type TabType = "quiz" | "listening" | "lecture" | "phrase";

const TABS: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
  { id: "quiz", labelFr: "Quiz", labelEn: "Quiz", icon: "📝" },
  { id: "listening", labelFr: "Écoute", labelEn: "Listening", icon: "🔊" },
  { id: "lecture", labelFr: "Lecture", labelEn: "Reading", icon: "📖" },
  { id: "phrase", labelFr: "Phrase", labelEn: "Sentence", icon: "📝" },
];

export default function ExercicesTabs() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabType>("quiz");
  const [listeningMode, setListeningMode] = useState<"phrase" | "dialogue">("phrase");
  const [listeningModule, setListeningModule] = useState(1);

  const totalModules = useMemo(() => {
    const data = listeningMode === "phrase" ? LISTENING.phrases : LISTENING.dialogues;
    return Math.ceil(data.length / 10);
  }, [listeningMode]);

  return (
    <div>
      {/* Main tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                : "border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
            }`}
          >
            {t.icon} {lang === "en" ? t.labelEn : t.labelFr}
          </button>
        ))}
      </div>

      {tab === "quiz" && <Quiz />}

      {tab === "listening" && (
        <>
          {/* Listening sub-tabs + module selector */}
          <div className="flex gap-2 mb-3">
            <button onClick={() => { setListeningMode("phrase"); setListeningModule(1); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                listeningMode === "phrase"
                  ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-sm"
                  : "border border-gray-200 dark:border-gray-700 text-gray-500"
              }`}
            >
              📝 {t("phrases")}
            </button>
            <button onClick={() => { setListeningMode("dialogue"); setListeningModule(1); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                listeningMode === "dialogue"
                  ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-sm"
                  : "border border-gray-200 dark:border-gray-700 text-gray-500"
              }`}
            >
              💬 {t("dialogues")}
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 font-medium">{t("module")} :</span>
            <select value={listeningModule} onChange={(e) => setListeningModule(Number(e.target.value))}
              className="text-xs px-3 py-1.5 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-red-400 outline-none"
            >
              {Array.from({ length: totalModules }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m} / {totalModules}</option>
              ))}
            </select>
          </div>
          <ListeningExercise forcedModule={listeningModule} forcedMode={listeningMode} />
        </>
      )}

      {tab === "lecture" && <JLPTExercises defaultType="lecture" />}
      {tab === "phrase" && <JLPTExercises defaultType="phrase" />}
    </div>
  );
}
