"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllExercises, type JLPTQuestion } from "@/data/jlpt-exercises";
import { useI18n } from "@/lib/i18n";

type ExerciseType = "all" | "vocab_reading" | "kanji_reading" | "sentence_completion" | "grammar_choice" | "reading_comp" | "lecture" | "phrase";

const TYPE_LABELS: Record<string, { fr: string; en: string; emoji: string }> = {
  all: { fr: "Tout", en: "All", emoji: "🎯" },
  vocab_reading: { fr: "Vocabulaire", en: "Vocabulary", emoji: "📖" },
  kanji_reading: { fr: "Kanji", en: "Kanji", emoji: "漢字" },
  sentence_completion: { fr: "Phrase", en: "Sentence", emoji: "📝" },
  grammar_choice: { fr: "Grammaire", en: "Grammar", emoji: "🔤" },
  reading_comp: { fr: "Lecture", en: "Reading", emoji: "📚" },
  lecture: { fr: "Lecture", en: "Reading", emoji: "📖" },
  phrase: { fr: "Phrase", en: "Sentence", emoji: "📝" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function JLPTExercises({ defaultType = "all", forcedModule }: { defaultType?: ExerciseType; forcedModule?: number }) {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useState<ExerciseType>(defaultType);
  const [questions, setQuestions] = useState<JLPTQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const isAuto = defaultType === "lecture" || defaultType === "phrase";

  const allExercises = useMemo(() => mounted ? getAllExercises() : [], [mounted]);

  const filteredExercises = useMemo(() => {
    if (!mounted) return [];
    if (type === "lecture") return shuffle(allExercises.filter((e) => e.type === "vocab_reading" || e.type === "kanji_reading"));
    if (type === "phrase") return shuffle(allExercises.filter((e) => e.type === "sentence_completion" || e.type === "grammar_choice" || e.type === "reading_comp"));
    if (type === "all") return shuffle([...allExercises]);
    return shuffle(allExercises.filter((e) => e.type === type));
  }, [type, allExercises, mounted]);

  const sortedPool = useMemo(() => isAuto ? filteredExercises : [], [filteredExercises, isAuto]);

  useEffect(() => {
    if (mounted && isAuto && sortedPool.length > 0) {
      const sliced = forcedModule
        ? sortedPool.slice((forcedModule - 1) * 10, forcedModule * 10)
        : sortedPool.slice(0, 10);
      setQuestions(sliced);
      setQIdx(0);
      setCorrect(0);
    }
  }, [mounted, isAuto, sortedPool, forcedModule]);

  function start() {
    const pool = type === "all" ? shuffle([...allExercises]) : shuffle(allExercises.filter((e) => e.type === type));
    const sliced = forcedModule
      ? pool.slice((forcedModule - 1) * 10, forcedModule * 10)
      : pool.slice(0, 10);
    setQuestions(sliced);
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }

  function answer(chosen: string) {
    if (answered || qIdx >= questions.length) return;
    setAnswered(true);
    setSelectedAnswer(chosen);
    if (chosen === questions[qIdx].answer) setCorrect((c) => c + 1);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }, 1800);
  }

  if (!mounted) return null;

  if (isAuto && questions.length === 0) return null;

  if (questions.length === 0) {
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(TYPE_LABELS) as ExerciseType[]).filter((t) => t !== "lecture" && t !== "phrase").map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                type === t
                  ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                  : "border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
              }`}
            >
              {TYPE_LABELS[t].emoji} {TYPE_LABELS[t].fr}
            </button>
          ))}
        </div>

        <button
          onClick={start}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
        >
          Commencer ({filteredExercises.length} exercices)
        </button>
      </div>
    );
  }

  if (qIdx >= questions.length) {
    const pct = Math.round((correct / questions.length) * 100);
    const encouragements = ["すごい！ 🎉", "よくできました！ 👏", "がんばったね！ 💪", "すばらしい！ ⭐", "Perfect！ 🌸"];
    const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-orange-400 mb-6 shadow-lg">
          <span className="text-4xl font-bold text-white">{pct}%</span>
        </div>
        <div className="text-2xl font-bold mb-1">{msg}</div>
        <div className="text-lg text-gray-500 mb-6">{correct} / {questions.length}</div>
        <button onClick={() => setQuestions([])} className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          {t("restart")}
        </button>
      </div>
    );
  }

  const q = questions[qIdx];
  if (!q) return null;
  const typeInfo = TYPE_LABELS[q.type];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-400 font-medium">{qIdx + 1} / {questions.length}</span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-lg mb-6 border border-gray-100 dark:border-gray-800">
        <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold mb-3">
          {typeInfo.emoji} {typeInfo.fr}
        </span>

        <div className="text-lg font-semibold whitespace-pre-line">{q.question}</div>
      </div>

      <div className="flex flex-col gap-3">
        {q.options.map((o) => {
          let cls = "border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 bg-white dark:bg-[#252220]";
          if (answered && o === q.answer) cls = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700";
          if (answered && o === selectedAnswer && o !== q.answer) cls = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700";

          return (
            <button
              key={`${qIdx}-${o}`}
              onClick={() => answer(o)}
              disabled={answered}
              className={`py-3.5 px-5 rounded-xl text-center font-medium transition-all ${cls}`}
            >
              {o}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 text-center">
          <div className={`text-lg font-bold ${selectedAnswer === q.answer ? "text-green-600" : "text-red-600"}`}>
            {selectedAnswer === q.answer ? "✓ 正解 !" : "✗ 不正解"}
          </div>
          {selectedAnswer !== q.answer && (
            <div className="text-sm text-gray-500 mt-1">
              {lang === "en" ? "Correct answer:" : "Bonne réponse :"} {q.answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
