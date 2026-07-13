"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { VOCAB, KANJI, GRAMMAR, type VocabItem, type KanjiItem, type GrammarItem } from "@/data";
import { useI18n } from "@/lib/i18n";

type CardMode = "vocab" | "kanji" | "grammar";
type CardData = VocabItem | KanjiItem | GrammarItem;

const ALL_DATA: Record<CardMode, CardData[]> = { vocab: VOCAB, kanji: KANJI, grammar: GRAMMAR };
const MODE_LABELS: Record<CardMode, { fr: string; en: string; emoji: string }> = {
  vocab: { fr: "Vocabulaire", en: "Vocabulary", emoji: "📖" },
  kanji: { fr: "Kanji", en: "Kanji", emoji: "漢字" },
  grammar: { fr: "Grammaire", en: "Grammar", emoji: "🔤" },
};

interface CardState { level: number; nextReview: string; reviewed: number; }

export default function Flashcards() {
  const { t } = useI18n();
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

  function getCardState(i: number): CardState {
    const key = `${mode}_${i}`;
    return cards[key] || { level: 0, nextReview: new Date().toISOString().slice(0, 10), reviewed: 0 };
  }

  const buildSession = useCallback(() => {
    const data = ALL_DATA[mode];
    let indices = data.map((_, i) => i).filter((i) => getCardState(i).nextReview <= new Date().toISOString().slice(0, 10));
    if (indices.length === 0) indices = data.map((_, i) => i);
    shuffleArr(indices);
    setSession(indices);
    setIdx(0);
    setFlipped(false);
  }, [mode, cards]);

  useEffect(() => { buildSession(); }, [buildSession]);

  function flip() { if (!flipped) setFlipped(true); }

  function rate(level: number) {
    if (!flipped) { flip(); return; }
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

    const today = new Date().toISOString().slice(0, 10);
    const streakRaw = localStorage.getItem("n5sensei_streak");
    if (streakRaw) {
      const streakData = JSON.parse(streakRaw) as { lastDate: string; count: number };
      if (streakData.lastDate === today) {
        // Already studied today, no change
      } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newCount = streakData.lastDate === yesterday ? streakData.count + 1 : 1;
        localStorage.setItem("n5sensei_streak", JSON.stringify({ lastDate: today, count: newCount }));
      }
    } else {
      localStorage.setItem("n5sensei_streak", JSON.stringify({ lastDate: today, count: 1 }));
    }

    setIdx((i) => i + 1);
    setFlipped(false);
  }

  if (session.length === 0 || idx >= session.length) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-400 shadow-lg mb-6">
          <span className="text-5xl">🎉</span>
        </div>
        <p className="text-xl font-bold mb-6">{t("session_done")}</p>
        <button onClick={buildSession} className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all">
          {t("restart")}
        </button>
      </div>
    );
  }

  const card = ALL_DATA[mode][session[idx]];
  const isKanji = mode === "kanji";

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["vocab", "kanji", "grammar"] as CardMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              mode === m
                ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                : "border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
            }`}
          >
            {MODE_LABELS[m].emoji} {t(m === "vocab" ? "vocabulaire" : m === "kanji" ? "kanji" : "grammaire")}
          </button>
        ))}
      </div>

      <div
        onClick={flip}
        className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer select-none border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold mb-4 uppercase tracking-wide">
          {MODE_LABELS[mode].emoji} {t(mode === "vocab" ? "vocabulaire" : mode === "kanji" ? "kanji" : "grammaire")}
        </span>
        <div className="text-5xl font-bold mb-3">{card.jp}</div>
        {flipped ? (
          <>
            <div className="text-xl text-gray-500 mb-1">{isKanji && (card as KanjiItem).read}</div>
            <div className="text-base text-gray-400">{card.mean}</div>
          </>
        ) : (
          <p className="text-sm text-gray-400 mt-4">Clique pour retourner</p>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={() => rate(0)} className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">
          💢 {t("hard")}
        </button>
        <button onClick={() => rate(1)} className="flex-1 py-3.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors">
          👌 {t("ok")}
        </button>
        <button onClick={() => rate(2)} className="flex-1 py-3.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors">
          ⚡ {t("easy")}
        </button>
      </div>

      <div className="text-center mt-4">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
          <div className="h-1.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full" style={{ width: `${((idx + 1) / session.length) * 100}%` }} />
          </div>
          {idx + 1} / {session.length}
        </div>
      </div>
    </div>
  );
}

function shuffleArr(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
