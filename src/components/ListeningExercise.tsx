"use client";

import { useState, useEffect, useRef } from "react";
import { LISTENING } from "@/data";

type AudioMode = "phrase" | "dialogue";

export default function ListeningExercise() {
  const [mode, setMode] = useState<AudioMode>("phrase");
  const [questions, setQuestions] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.8);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  function init() {
    const data = LISTENING[mode === "phrase" ? "phrases" : "dialogues"];
    const indices = data.map((_, i) => i);
    shuffleArr(indices);
    setQuestions(indices.slice(0, 10));
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setRevealed(false);
  }

  useEffect(() => {
    init();
  }, [mode]);

  function play() {
    const synth = synthRef.current;
    if (!synth) return;
    synth.cancel();

    const data = LISTENING[mode === "phrase" ? "phrases" : "dialogues"];
    const item = data[questions[qIdx]];
    const text = mode === "dialogue" ? item.jp.replace(/^[AB]:\s*/gm, "").replace(/\n/g, " ") : item.jp;

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

  function answer(chosen: string, btn: HTMLButtonElement) {
    if (answered) return;
    setAnswered(true);
    const data = LISTENING[mode === "phrase" ? "phrases" : "dialogues"];
    const item = data[questions[qIdx]];
    const correctAnswer = "note" in item ? item.note || item.mean : item.mean;
    const isCorrect = chosen === correctAnswer;
    const allBtns = btn.parentElement?.querySelectorAll("button");
    allBtns?.forEach((b) => (b.disabled = true));
    btn.classList.add(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrect((c) => c + 1);
    setRevealed(true);
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setAnswered(false);
      setRevealed(false);
    }, 1500);
  }

  function generateOptions(): string[] {
    const data = LISTENING[mode === "phrase" ? "phrases" : "dialogues"];
    const item = data[questions[qIdx]];
    const correctAnswer = "note" in item ? item.note || item.mean : item.mean;
    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const r = Math.floor(Math.random() * data.length);
      const val = "note" in data[r] ? data[r].note || data[r].mean : data[r].mean;
      if (val !== correctAnswer && !wrongs.has(val)) wrongs.add(val);
    }
    return shuffleArr([correctAnswer, ...wrongs]);
  }

  if (questions.length === 0) return null;

  if (qIdx >= questions.length) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl font-bold text-[#c0392b] mb-2">{correct}</div>
        <p className="text-gray-500">/ {questions.length} bonnes réponses</p>
        <button onClick={init} className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-medium">
          Recommencer
        </button>
      </div>
    );
  }

  const data = LISTENING[mode === "phrase" ? "phrases" : "dialogues"];
  const item = data[questions[qIdx]];
  const options = generateOptions();

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["phrase", "dialogue"] as AudioMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === m ? "bg-[#c0392b] text-white" : "border border-gray-200 dark:border-gray-700 text-gray-500"
            }`}
          >
            {m === "phrase" ? "Phrases" : "Dialogues"}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg text-center mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-[#c0392b] text-white text-xs font-semibold mb-3">
          {mode === "dialogue" ? "Dialogue N5" : "Phrase N5"}
        </span>
        <div className="text-lg font-semibold min-h-[80px] flex items-center justify-center">
          {playing ? "🔊 Écoute..." : "Appuie sur Écouter"}
        </div>
        <p className="text-sm text-gray-400 mt-2">{item.q}</p>

        <div className="flex gap-2 justify-center mt-4">
          <button
            onClick={() => setRate(0.8)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${rate === 0.8 ? "bg-[#c0392b] text-white" : "border border-gray-200 dark:border-gray-700"}`}
          >
            Lent
          </button>
          <button
            onClick={() => setRate(1)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${rate === 1 ? "bg-[#c0392b] text-white" : "border border-gray-200 dark:border-gray-700"}`}
          >
            Normal
          </button>
        </div>

        <button
          onClick={play}
          disabled={playing}
          className="mt-4 px-8 py-3 bg-[#c0392b] text-white rounded-xl font-semibold hover:bg-[#e74c3c] transition-colors disabled:opacity-50"
        >
          {playing ? "🔊 Lecture..." : "🔊 Écouter"}
        </button>

        {revealed && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 italic">
            Réponse : {"note" in item ? item.note || item.mean : item.mean}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {options.map((o) => (
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
