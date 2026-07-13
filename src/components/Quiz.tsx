"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { VOCAB, KANJI, GRAMMAR } from "@/data";
import { useI18n } from "@/lib/i18n";

type QuizMode = "vocab" | "kanji" | "grammar" | "mixed";
const ALL_DATA = { vocab: VOCAB, kanji: KANJI, grammar: GRAMMAR };

interface QuizQuestion {
  mode: string;
  jp: string;
  read: string;
  mean: string;
  wrongs: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const { t } = useI18n();
  const [mode, setMode] = useState<QuizMode>("vocab");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const initQuiz = useCallback(() => {
    const modes = mode === "mixed" ? (["vocab", "kanji", "grammar"] as const) : [mode];
    const pool: { mode: string; jp: string; read: string; mean: string; idx: number }[] = [];
    modes.forEach((m) => {
      const data = ALL_DATA[m];
      const indices = shuffle(data.map((_, i) => i)).slice(0, 10);
      indices.forEach((i) => pool.push({ mode: m, ...data[i], idx: i }));
    });
    const qs: QuizQuestion[] = shuffle(pool).map((item) => {
      const data = ALL_DATA[item.mode as keyof typeof ALL_DATA];
      const correctMean = item.mean;
      const pool2 = data.filter((d, i) => i !== item.idx && d.mean !== correctMean).map((d) => d.mean);
      return { mode: item.mode, jp: item.jp, read: item.read, mean: item.mean, wrongs: shuffle(pool2).slice(0, 3) };
    });
    setQuestions(qs);
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [mode]);

  useEffect(() => { initQuiz(); }, [initQuiz]);

  function answer(chosen: string) {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(chosen);
    if (chosen === questions[qIdx].mean) setCorrect((c) => c + 1);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }, 1200);
  }

  if (qIdx >= questions.length && questions.length > 0) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-orange-400 mb-6 shadow-lg">
          <span className="text-4xl font-bold text-white">{pct}%</span>
        </div>
        <div className="text-2xl font-bold mb-1">{correct} / {questions.length}</div>
        <p className="text-gray-500 mb-6">{t("correct_answers")}</p>
        <button onClick={initQuiz} className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all">
          {t("restart")}
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;
  const q = questions[qIdx];
  const opts = useMemo(() => shuffle([q.mean, ...q.wrongs]), [qIdx, questions]);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["vocab", "kanji", "grammar", "mixed"] as QuizMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              mode === m
                ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                : "border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
            }`}
          >
            {m === "mixed" ? "🎯 Mixte" : m === "vocab" ? "📖 Vocab" : m === "kanji" ? "漢字 Kanji" : "🔤 Gram"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-400 font-medium">{qIdx + 1} / {questions.length}</span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-300" style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg text-center mb-6 border border-gray-100 dark:border-gray-800">
        <div className="text-5xl font-bold mb-2">{q.jp}</div>
        {q.mode !== "kanji" && <div className="text-lg text-gray-500">{q.read}</div>}
        <p className="text-sm text-gray-400 mt-4">{t("which_meaning")}</p>
      </div>

      <div className="flex flex-col gap-3">
        {opts.map((o) => {
          let cls = "border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 bg-white dark:bg-[#252220]";
          if (answered && o === q.mean) cls = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700";
          if (answered && o === selectedAnswer && o !== q.mean) cls = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700";

          return (
            <button
              key={o}
              onClick={() => answer(o)}
              disabled={answered}
              className={`py-3.5 px-5 rounded-xl text-center font-medium transition-all ${cls}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
