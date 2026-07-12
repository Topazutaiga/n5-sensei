"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LISTENING } from "@/data";

type AudioMode = "phrase" | "dialogue";

export default function ListeningExercise() {
  const [mode, setMode] = useState<AudioMode>("phrase");
  const [questions, setQuestions] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.8);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const data = useMemo(() => LISTENING[mode === "phrase" ? "phrases" : "dialogues"], [mode]);

  const currentItem = useMemo(() => {
    if (questions.length === 0 || qIdx >= questions.length) return null;
    return data[questions[qIdx]];
  }, [questions, qIdx, data]);

  const correctAnswer = useMemo((): string => {
    if (!currentItem) return "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = currentItem as any;
    if (item.note) return String(item.note);
    return String(item.mean);
  }, [currentItem]);

  const options = useMemo((): string[] => {
    if (!currentItem) return [];
    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const r = Math.floor(Math.random() * data.length);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = data[r] as any;
      const val: string = item.note ? String(item.note) : String(item.mean);
      if (val !== correctAnswer && !wrongs.has(val)) wrongs.add(val);
    }
    const result: string[] = [...Array.from(wrongs), correctAnswer];
    return shuffleArr(result);
  }, [currentItem, correctAnswer, data]);

  const init = useCallback(() => {
    const indices = data.map((_, i) => i);
    shuffleArr(indices);
    setQuestions(indices.slice(0, 10));
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setRevealed(false);
    setPlaying(false);
  }, [data]);

  useEffect(() => {
    init();
  }, [init]);

  function play() {
    const synth = synthRef.current;
    if (!synth || !currentItem) return;
    synth.cancel();

    const text = mode === "dialogue"
      ? currentItem.jp.replace(/^[AB]:\s*/gm, "").replace(/\n/g, " ")
      : currentItem.jp;

    setPlaying(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = rate;
    const voices = synth.getVoices();
    const jpVoice = voices.find((v) => v.lang.startsWith("ja"));
    if (jpVoice) u.voice = jpVoice;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    synth.speak(u);
  }

  function answer(chosen: string) {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(chosen);
    if (chosen === String(correctAnswer)) setCorrect((c) => c + 1);
    setRevealed(true);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setRevealed(false);
    }, 1800);
  }

  if (questions.length === 0) return null;

  if (qIdx >= questions.length) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-400 mb-6">
          <span className="text-4xl font-bold text-white">{pct}%</span>
        </div>
        <div className="text-2xl font-bold mb-1">{correct} / {questions.length}</div>
        <p className="text-gray-500 mb-6">bonnes réponses</p>
        <button onClick={init} className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Recommencer
        </button>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["phrase", "dialogue"] as AudioMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              mode === m
                ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                : "border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
            }`}
          >
            {m === "phrase" ? "📝 Phrases" : "💬 Dialogues"}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg text-center mb-6 border border-gray-100 dark:border-gray-800">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold mb-4 uppercase tracking-wide">
          {mode === "dialogue" ? "Dialogue N5" : "Phrase N5"}
        </span>

        <div className="min-h-[60px] flex items-center justify-center mb-4">
          {playing ? (
            <div className="flex items-center gap-2 text-red-500">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-red-400 rounded animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="w-1 h-6 bg-red-500 rounded animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1 h-3 bg-red-400 rounded animate-pulse" style={{ animationDelay: "300ms" }} />
                <div className="w-1 h-5 bg-red-500 rounded animate-pulse" style={{ animationDelay: "450ms" }} />
                <div className="w-1 h-4 bg-red-400 rounded animate-pulse" style={{ animationDelay: "600ms" }} />
              </div>
              <span className="text-sm font-medium">Écoute en cours...</span>
            </div>
          ) : (
            <span className="text-gray-400">Appuie sur Écouter</span>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-5">{currentItem.q}</p>

        <div className="flex gap-2 justify-center mb-4">
          {[{ v: 0.7, l: "0.7x" }, { v: 0.85, l: "0.85x" }, { v: 1, l: "1x" }].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setRate(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                rate === v
                  ? "bg-gradient-to-r from-red-500 to-orange-400 text-white"
                  : "border border-gray-200 dark:border-gray-700 text-gray-500"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <button
          onClick={play}
          disabled={playing}
          className="px-10 py-3.5 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {playing ? "🔊 Lecture..." : "🔊 Écouter"}
        </button>

        {revealed && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-400">Réponse : </span>
            <span className="text-sm font-semibold text-green-600">{String(correctAnswer)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {options.map((o) => {
          let cls = "border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 bg-white dark:bg-[#252220]";
          if (answered && o === correctAnswer) cls = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700";
          if (answered && o === selectedAnswer && o !== correctAnswer) cls = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700";

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

      <div className="text-center mt-4 text-sm text-gray-400 font-medium">
        {qIdx + 1} / {questions.length}
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
