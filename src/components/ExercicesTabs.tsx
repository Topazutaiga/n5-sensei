"use client";

import { useState, useMemo } from "react";
import Quiz from "./Quiz";
import ListeningExercise from "./ListeningExercise";
import JLPTExercises from "./JLPTExercises";
import { LISTENING } from "@/data";
import { useI18n } from "@/lib/i18n";
import { getAllExercises } from "@/data/jlpt-exercises";

type TabType = "quiz" | "listening" | "lecture" | "phrase";
type QuizMode = "vocab" | "kanji" | "grammar" | "mixed";

const TABS: { id: TabType; labelFr: string; labelEn: string; icon: string }[] = [
  { id: "quiz", labelFr: "Quiz", labelEn: "Quiz", icon: "📝" },
  { id: "listening", labelFr: "Écoute", labelEn: "Listening", icon: "🔊" },
  { id: "lecture", labelFr: "Lecture", labelEn: "Reading", icon: "📖" },
  { id: "phrase", labelFr: "Phrase", labelEn: "Sentence", icon: "📝" },
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
  const [tab, setTab] = useState<TabType>("quiz");
  const [listeningMode, setListeningMode] = useState<"phrase" | "dialogue">("phrase");
  const [listeningModule, setListeningModule] = useState(1);
  const [quizMode, setQuizMode] = useState<QuizMode>("vocab");
  const [quizModule, setQuizModule] = useState(1);
  const [lectureModule, setLectureModule] = useState(1);
  const [phraseModule, setPhraseModule] = useState(1);

  const totalListeningModules = useMemo(() => {
    const data = listeningMode === "phrase" ? LISTENING.phrases : LISTENING.dialogues;
    return Math.ceil(data.length / Q_PER_MODULE);
  }, [listeningMode]);

  const totalQuizModules = useMemo(() => 35, []);

  const lectureExercises = useMemo(() => {
    const all = getAllExercises();
    return all.filter((e) => e.type === "vocab_reading" || e.type === "kanji_reading");
  }, []);

  const phraseExercises = useMemo(() => {
    const all = getAllExercises();
    return all.filter((e) => e.type === "sentence_completion" || e.type === "grammar_choice" || e.type === "reading_comp");
  }, []);

  const totalLectureModules = useMemo(() => Math.ceil(lectureExercises.length / Q_PER_MODULE), [lectureExercises]);
  const totalPhraseModules = useMemo(() => Math.ceil(phraseExercises.length / Q_PER_MODULE), [phraseExercises]);

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

      {tab === "quiz" && (
        <>
          {/* Quiz mode sub-tabs */}
          <div className="flex gap-2 mb-3">
            {QUIZ_MODES.map((m) => (
              <button key={m.id} onClick={() => { setQuizMode(m.id); setQuizModule(1); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  quizMode === m.id
                    ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-sm"
                    : "border border-gray-200 dark:border-gray-700 text-gray-500"
                }`}
              >
                {m.icon} {lang === "en" ? m.labelEn : m.labelFr}
              </button>
            ))}
          </div>
          <ModuleSelector module={quizModule} total={totalQuizModules} onChange={setQuizModule} />
          <Quiz forcedModule={quizModule} forcedMode={quizMode} />
        </>
      )}

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

      {tab === "lecture" && (
        <>
          <ModuleSelector module={lectureModule} total={totalLectureModules} onChange={setLectureModule} />
          <JLPTExercises defaultType="lecture" forcedModule={lectureModule} />
        </>
      )}

      {tab === "phrase" && (
        <>
          <ModuleSelector module={phraseModule} total={totalPhraseModules} onChange={setPhraseModule} />
          <JLPTExercises defaultType="phrase" forcedModule={phraseModule} />
        </>
      )}
    </div>
  );
}
