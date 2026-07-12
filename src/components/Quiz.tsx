"use client";

import { useState, useEffect } from "react";
import { VOCAB, KANJI, GRAMMAR } from "@/data";

type QuizMode = "vocab" | "kanji" | "grammar" | "mixed";

const ALL_DATA = { vocab: VOCAB, kanji: KANJI, grammar: GRAMMAR };

interface QuizQuestion {
  mode: string;
  jp: string;
  read: string;
  mean: string;
  wrongs: string[];
}

export default function Quiz() {
  const [mode, setMode] = useState<QuizMode>("vocab");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);

  function initQuiz() {
    const modes = mode === "mixed" ? (["vocab", "kanji", "grammar"] as const) : [mode];
    const pool: { mode: string; jp: string; read: string; mean: string; idx: number }[] = [];
    modes.forEach((m) => {
      const data = ALL_DATA[m];
      for (let i = 0; i < Math.min(50, data.length); i++) {
        pool.push({ mode: m, ...data[i], idx: i });
      }
    });
    shuffleArr(pool);
    const qs: QuizQuestion[] = pool.slice(0, 10).map((item) => {
      const data = ALL_DATA[item.mode as keyof typeof ALL_DATA];
      const wrongs = getWrong(item.mode, item.idx, 3, item.mean);
      return { mode: item.mode, jp: item.jp, read: item.read, mean: item.mean, wrongs };
    });
    setQuestions(qs);
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
  }

  useEffect(() => {
    initQuiz();
  }, [mode]);

  function getWrong(m: string, idx: number, count: number, correctMean: string): string[] {
    const data = ALL_DATA[m as keyof typeof ALL_DATA];
    const pool = data.filter((d, i) => i !== idx && d.mean !== correctMean).map((d) => d.mean);
    shuffleArr(pool);
    return pool.slice(0, count);
  }

  function answer(chosen: string, btn: HTMLButtonElement) {
    if (answered) return;
    setAnswered(true);
    const allBtns = btn.parentElement?.querySelectorAll("button");
    allBtns?.forEach((b) => (b.disabled = true));
    const isCorrect = chosen === questions[qIdx].mean;
    btn.classList.add(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrect((c) => c + 1);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
    }, 800);
  }

  if (qIdx >= questions.length && questions.length > 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl font-bold text-[#c0392b] mb-2">{correct}</div>
        <p className="text-gray-500">/ {questions.length} bonnes réponses</p>
        <button onClick={initQuiz} className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-medium">
          Recommencer
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;
  const q = questions[qIdx];
  const opts = shuffleArr([...q.mean, ...q.wrongs]);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["vocab", "kanji", "grammar", "mixed"] as QuizMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === m ? "bg-[#c0392b] text-white" : "border border-gray-200 dark:border-gray-700 text-gray-500"
            }`}
          >
            {m === "mixed" ? "Mixte" : m === "vocab" ? "Vocabulaire" : m === "kanji" ? "Kanji" : "Grammaire"}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg text-center mb-4">
        <div className="text-4xl font-bold mb-1">{q.jp}</div>
        {q.mode !== "kanji" && <div className="text-lg text-gray-500">{q.read}</div>}
        <p className="text-sm text-gray-400 mt-4">Quelle est la signification ?</p>
      </div>

      <div className="flex flex-col gap-2">
        {opts.map((o) => (
          <button
            key={o}
            onClick={(e) => answer(o, e.currentTarget)}
            className="py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center font-medium transition-colors hover:border-[#c0392b]"
          >
            {o}
          </button>
        ))}
      </div>

      <div className="text-center mt-3 text-sm text-gray-400">
        Question {qIdx + 1} / {questions.length}
      </div>
    </div>
  );
}

function shuffleArr<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
