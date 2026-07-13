"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LISTENING, type JLTPListeningItem } from "@/data";
import { useI18n } from "@/lib/i18n";

type AudioMode = "phrase" | "dialogue";

export default function ListeningExercise({ forcedModule, forcedMode }: { forcedModule?: number; forcedMode?: AudioMode }) {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AudioMode>(forcedMode || "phrase");
  const [processingModule, setProcessingModule] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<JLTPListeningItem[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.8);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const checkVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.some((v) => v.lang.startsWith("ja"))) setVoicesLoaded(true);
      };
      checkVoices();
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }
  }, []);

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const data = useMemo(() => LISTENING[mode === "phrase" ? "phrases" : "dialogues"], [mode]);

  const currentItem = useMemo(() => {
    if (qIdx >= items.length) return null;
    return items[qIdx];
  }, [items, qIdx]);

  const init = useCallback(() => {
    if (forcedModule === undefined) {
      setItems(shuffle(data).slice(0, 10));
    } else {
      const start = (forcedModule - 1) * 10;
      setItems(data.slice(start, start + 10));
    }
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setPlaying(false);
  }, [data, forcedModule]);

  useEffect(() => { if (mounted) { if (forcedMode) setMode(forcedMode); } }, [forcedMode, mounted]);
  useEffect(() => { if (mounted) init(); }, [init, mounted]);

  function play() {
    const synth = synthRef.current;
    if (!synth || !currentItem) return;
    synth.cancel();

    setPlaying(true);
    const u = new SpeechSynthesisUtterance(currentItem.audio.replace(/^[AB]:\s*/gm, "").replace(/\n/g, " "));
    u.lang = "ja-JP";
    u.rate = rate;
    const voices = synth.getVoices();
    const jpVoice = voices.find((v) => v.lang.startsWith("ja"));
    if (jpVoice) u.voice = jpVoice;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    synth.speak(u);
  }

  function answer(idx: number) {
    if (answered || !currentItem) return;
    setAnswered(true);
    setSelectedAnswer(idx);
    if (idx === currentItem.answerIndex) setCorrect((c) => c + 1);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }, 1800);
  }

  if (!mounted) return null;

  if (qIdx >= items.length && items.length > 0) {
    const pct = Math.round((correct / items.length) * 100);
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-orange-400 mb-6 shadow-lg">
          <span className="text-4xl font-bold text-white">{pct}%</span>
        </div>
        <div className="text-2xl font-bold mb-1">{correct} / {items.length}</div>
        <p className="text-gray-500 mb-6">{t("correct_answers")}</p>
        <button onClick={init} className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all">
          {t("restart")}
        </button>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div>
      {/* Mode indicator + module */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white">
          {mode === "phrase" ? "📝 " + t("phrases") : "💬 " + t("dialogues")}
          {forcedModule && <span> — {t("module")} {forcedModule}</span>}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-400 font-medium">{qIdx + 1} / {items.length}</span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-300" style={{ width: `${((qIdx + 1) / items.length) * 100}%` }} />
        </div>
      </div>

      {/* Scene emoji (dialogue mode) */}
      {currentItem.scene && (
        <div className="text-center mb-4">
          <div className="inline-block bg-white/80 dark:bg-[#252220]/80 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-5xl">{currentItem.scene}</span>
          </div>
        </div>
      )}

      {/* Audio player card */}
      <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg text-center mb-6 border border-gray-100 dark:border-gray-800">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold mb-4 uppercase tracking-wide">
          {mode === "dialogue" ? t("dialogues") + " N5" : t("phrases") + " N5"}
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
              <span className="text-sm font-medium">{t("listening_status")}</span>
            </div>
          ) : (
            <>
              <div className="text-2xl mb-2">🎧</div>
              <p className="text-gray-400">{t("press_listen")}</p>
            </>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-5">{currentItem.question}</p>

        {/* Speed controls */}
        <div className="flex gap-2 justify-center mb-4">
          {[
            { v: 0.6, l: "🐢 " + t("slow") },
            { v: 0.8, l: "🚶 " + t("normal") },
            { v: 1.0, l: "🏃 " + t("fast") },
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
          {playing ? "🔊 " + t("listening_status") : "🔊 " + t("listen")}
        </button>

        {!voicesLoaded && mounted && (
          <p className="text-xs text-orange-400 mt-2">
            {lang === "en" ? "Loading Japanese voices..." : "Chargement des voix japonaises..."}
          </p>
        )}

        {answered && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <div className={`text-base font-bold ${selectedAnswer === currentItem.answerIndex ? "text-green-600" : "text-red-600"}`}>
              {selectedAnswer === currentItem.answerIndex ? "✓ 正解 !" : "✗ 不正解"}
            </div>
            <p className="text-sm text-gray-400 mb-1">{lang === "en" ? "Correct answer:" : "Bonne réponse :"}</p>
            <div className="text-lg font-bold text-green-600">
              {currentItem.options[currentItem.answerIndex].emoji} {currentItem.options[currentItem.answerIndex].text}
            </div>
            {currentItem.note && (
              <div className="text-xs text-gray-400 mt-1">{currentItem.note}</div>
            )}
          </div>
        )}
      </div>

      {/* Answer choices (JLPT format: large emoji + text cards) */}
      <div className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wide">
        {mode === "phrase" ? t("choose_answer") : t("choose_answer")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {currentItem.options.map((opt, i) => {
          let cls = "border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 bg-white dark:bg-[#252220]";
          if (answered && i === currentItem.answerIndex) cls = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20";
          if (answered && i === selectedAnswer && i !== currentItem.answerIndex) cls = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20";

          return (
            <button
              key={`${qIdx}-${i}`}
              onClick={() => answer(i)}
              disabled={answered}
              className={`flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-xl text-center font-medium transition-all ${cls}`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="text-sm">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
