"use client";

import { useState, useMemo } from "react";
import Quiz from "./Quiz";
import ListeningExercise from "./ListeningExercise";
import JLPTExercises from "./JLPTExercises";
import { LISTENING } from "@/data";
import { useI18n } from "@/lib/i18n";
import { getAllExercises } from "@/data/jlpt-exercises";

type TabType = "listening" | "vocab" | "comprehension";
type QuizMode = "vocab" | "kanji" | "grammar" | "mixed";

const TABS: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
  { id: "listening", labelFr: "Écoute", labelEn: "Listening", icon: "🔊" },
  { id: "vocab", labelFr: "Vocab/Kanjis", labelEn: "Vocab/Kanji", icon: "📖" },
  { id: "comprehension", labelFr: "Compréhension", labelEn: "Comprehension", icon: "📝" },
];

const QUIZ_MODES: { id: QuizMode; labelFr: string; labelEn: string; icon: string }[] = [
  { id: "vocab", labelFr: "Vocab", labelEn: "Vocab", icon: "📖" },
  { id: "kanji", labelFr: "Kanji", labelEn: "Kanji", icon: "漢字" },
  { id: "grammar", labelFr: "Grammaire", labelEn: "Grammar", icon: "🔤" },
  { id: "mixed", labelFr: "Mixte", labelEn: "Mixed", icon: "🎯" },
];

const Q_PER_MODULE = 10;

function ModuleSelector({ module, total, onChange }: { module: number; total: number; onChange: (m: number) => void }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs text-gray-500 font-medium">{t("module")} :</span>
      <select value={module} onChange={(e) => onChange(Number(e.target.value))}
        className="text-xs px-3 py-1.5 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-red-400 outline-none"
      >
        {Array.from({ length: total }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m} / {total}</option>
        ))}
      </select>
    </div>
  );
}

export default function ExercicesTabs() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabType>("listening");
  const [listeningMode, setListeningMode] = useState<"phrase" | "dialogue">("phrase");
  const [listeningModule, setListeningModule] = useState(1);
  const [vocabMode, setVocabMode] = useState<QuizMode>("vocab");
  const [vocabModule, setVocabModule] = useState(1);
  const [comprehensionModule, setComprehensionModule] = useState(1);

  const totalListeningModules = useMemo(() => {
    const data = listeningMode === "phrase" ? LISTENING.phrases : LISTENING.dialogues;
    return Math.ceil(data.length / Q_PER_MODULE);
  }, [listeningMode]);

  const totalVocabModules = useMemo(() => 35, []);

  const comprehensionExercises = useMemo(() => {
    const all = getAllExercises();
    return all.filter((e) => e.type === "sentence_completion" || e.type === "grammar_choice" || e.type === "reading_comp");
  }, []);

  const totalComprehensionModules = useMemo(() => Math.ceil(comprehensionExercises.length / Q_PER_MODULE), [comprehensionExercises]);

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

      {tab === "listening" && (
        <>
          {/* Listening sub-tabs */}
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
          <ModuleSelector module={listeningModule} total={totalListeningModules} onChange={setListeningModule} />
          <ListeningExercise forcedModule={listeningModule} forcedMode={listeningMode} />
        </>
      )}

      {tab === "vocab" && (
        <>
          {/* Vocab mode sub-tabs */}
          <div className="flex gap-2 mb-3">
            {QUIZ_MODES.map((m) => (
              <button key={m.id} onClick={() => { setVocabMode(m.id); setVocabModule(1); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  vocabMode === m.id
                    ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-sm"
                    : "border border-gray-200 dark:border-gray-700 text-gray-500"
                }`}
              >
                {m.icon} {lang === "en" ? m.labelEn : m.labelFr}
              </button>
            ))}
          </div>
          <ModuleSelector module={vocabModule} total={totalVocabModules} onChange={setVocabModule} />
          <Quiz key={`${vocabMode}-${vocabModule}`} forcedModule={vocabModule} forcedMode={vocabMode} />
        </>
      )}

      {tab === "comprehension" && (
        <>
          <ModuleSelector module={comprehensionModule} total={totalComprehensionModules} onChange={setComprehensionModule} />
          <JLPTExercises key={`comprehension-${comprehensionModule}`} defaultType="phrase" forcedModule={comprehensionModule} />
        </>
      )}
    </div>
  );
}
