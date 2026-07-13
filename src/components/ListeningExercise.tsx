"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LISTENING } from "@/data";

type AudioMode = "phrase" | "dialogue";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ListeningExercise() {
  const [mode, setMode] = useState<AudioMode>("phrase");
  const [questions, setQuestions] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.8);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [mounted, setMounted] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const checkVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.some((v) => v.lang.startsWith("ja"))) {
          setVoicesLoaded(true);
        }
      };
      checkVoices();
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }
  }, []);

  const data = useMemo(() => LISTENING[mode === "phrase" ? "phrases" : "dialogues"], [mode]);

  const currentItem = useMemo(() => {
    if (questions.length === 0 || qIdx >= questions.length) return null;
    return data[questions[qIdx]];
  }, [questions, qIdx, data]);

  const correctAnswer = useMemo((): string => {
    if (!currentItem) return "";
    return currentItem.mean;
  }, [currentItem]);

  const options = useMemo((): string[] => {
    if (!currentItem) return [];
    const wrongs = new Set<string>();
    const allAnswers = data.map((item) => item.mean);
    while (wrongs.size < 3) {
      const val = allAnswers[Math.floor(Math.random() * allAnswers.length)];
      if (val !== correctAnswer && !wrongs.has(val)) wrongs.add(val);
    }
    return shuffle([...wrongs, correctAnswer]);
  }, [currentItem, correctAnswer, data]);

  const init = useCallback(() => {
    const indices = shuffle(data.map((_, i) => i));
    setQuestions(indices.slice(0, 10));
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setPlaying(false);
  }, [data]);

  useEffect(() => { init(); }, [init]);

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
    if (chosen === correctAnswer) setCorrect((c) => c + 1);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }, 1800);
  }

  if (!mounted || questions.length === 0) return null;

  if (qIdx >= questions.length) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-orange-400 mb-6 shadow-lg">
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
          {[
            { v: 0.6, l: "🐢 Lent" },
            { v: 0.8, l: "🚶 Normal" },
            { v: 1.0, l: "🏃 Rapide" },
          ].map(({ v, l }) => (
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
          disabled={playing || !voicesLoaded}
          className="px-10 py-3.5 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {playing ? "🔊 Lecture..." : "🔊 Écouter"}
        </button>

        {!voicesLoaded && mounted && (
          <p className="text-xs text-orange-400 mt-2">Chargement des voix japonaises...</p>
        )}

        {answered && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <div className="text-lg font-bold text-green-600">{currentItem.jp}</div>
            <div className="text-sm text-gray-500">{correctAnswer}</div>
            {mode === "dialogue" && "note" in currentItem && (
              <div className="text-xs text-gray-400 mt-1">{(currentItem as { note: string }).note}</div>
            )}
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

      <div className="text-center mt-4">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
          <div className="h-1.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full" style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }} />
          </div>
          {qIdx + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
}
