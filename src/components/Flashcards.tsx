"use client";

import { useEffect, useState } from "react";
import { VOCAB, KANJI, GRAMMAR, type VocabItem, type KanjiItem, type GrammarItem } from "@/data";

type CardMode = "vocab" | "kanji" | "grammar";
type CardData = VocabItem | KanjiItem | GrammarItem;

const ALL_DATA: Record<CardMode, CardData[]> = {
  vocab: VOCAB,
  kanji: KANJI,
  grammar: GRAMMAR,
};

const MODE_LABELS: Record<CardMode, string> = {
  vocab: "Vocabulaire",
  kanji: "Kanji",
  grammar: "Grammaire",
};

interface CardState {
  level: number;
  nextReview: string;
  reviewed: number;
}

export default function Flashcards() {
  const [mode, setMode] = useState<CardMode>("vocab");
  const [session, setSession] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cards, setCards] = useState<Record<string, CardState>>({});

  useEffect(() => {
    const raw = localStorage.getItem("n5sensei_cards");
    if (raw) setCards(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("n5sensei_cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    const data = ALL_DATA[mode];
    const indices = data.map((_, i) => i);
    shuffle(indices);
    setSession(indices);
    setIdx(0);
    setFlipped(false);
  }, [mode]);

  function getCardState(i: number): CardState {
    const key = `${mode}_${i}`;
    return cards[key] || { level: 0, nextReview: new Date().toISOString().slice(0, 10), reviewed: 0 };
  }

  function cardDue(i: number) {
    return getCardState(i).nextReview <= new Date().toISOString().slice(0, 10);
  }

  function buildSession() {
    const data = ALL_DATA[mode];
    let indices = data.map((_, i) => i).filter((i) => cardDue(i));
    if (indices.length === 0) indices = data.map((_, i) => i);
    shuffle(indices);
    setSession(indices);
    setIdx(0);
    setFlipped(false);
  }

  useEffect(() => {
    buildSession();
  }, [mode]);

  function flip() {
    if (!flipped) setFlipped(true);
  }

  function rate(level: number) {
    if (!flipped) {
      flip();
      return;
    }
    if (idx >= session.length) return;
    const i = session[idx];
    const key = `${mode}_${i}`;
    const prev = getCardState(i);
    let newLevel = prev.level;
    if (level === 0) newLevel = Math.max(0, prev.level - 1);
    else if (level === 1) newLevel = Math.min(3, prev.level + 1);
    else if (level === 2) newLevel = Math.min(5, prev.level + 2);
    const intervals = [0, 1, 2, 4, 7, 14];
    const days = intervals[Math.min(newLevel, intervals.length - 1)];
    const next = new Date();
    next.setDate(next.getDate() + days);
    setCards((c) => ({
      ...c,
      [key]: { level: newLevel, nextReview: next.toISOString().slice(0, 10), reviewed: prev.reviewed + 1 },
    }));
    setIdx((i) => i + 1);
    setFlipped(false);
  }

  if (session.length === 0 || idx >= session.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-lg font-semibold">Session terminée !</p>
        <button onClick={buildSession} className="mt-4 px-6 py-2 bg-[#c0392b] text-white rounded-xl font-medium">
          Recommencer
        </button>
      </div>
    );
  }

  const card = ALL_DATA[mode][session[idx]];
  const isKanji = mode === "kanji";

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["vocab", "kanji", "grammar"] as CardMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === m ? "bg-[#c0392b] text-white" : "border border-gray-200 dark:border-gray-700 text-gray-500"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div
        onClick={flip}
        className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-[#c0392b] text-white text-xs font-semibold mb-3">
          {MODE_LABELS[mode]}
        </span>
        <div className="text-4xl font-bold mb-2">{card.jp}</div>
        {flipped && (
          <>
            <div className="text-xl text-gray-500 mb-1">{isKanji && (card as KanjiItem).read}</div>
            <div className="text-base text-gray-500">{card.mean}</div>
          </>
        )}
        {!flipped && <p className="text-sm text-gray-400 mt-4">Clique pour retourner</p>}
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={() => rate(0)} className="flex-1 py-3 bg-[#e74c3c] text-white rounded-xl font-semibold">
          💢 Dur
        </button>
        <button onClick={() => rate(1)} className="flex-1 py-3 bg-[#f39c12] text-white rounded-xl font-semibold">
          👌 OK
        </button>
        <button onClick={() => rate(2)} className="flex-1 py-3 bg-[#27ae60] text-white rounded-xl font-semibold">
          ⚡ Facile
        </button>
      </div>

      <div className="text-center mt-3 text-sm text-gray-400">
        {idx + 1} / {session.length}
      </div>
    </div>
  );
}

function shuffle(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
