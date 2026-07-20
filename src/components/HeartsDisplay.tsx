"use client";

import { useState, useEffect } from "react";
import { getComputedHearts, refillHearts } from "@/lib/hearts";

interface HeartsDisplayProps {
  compact?: boolean;
}

export default function HeartsDisplay({ compact = false }: HeartsDisplayProps) {
  const [hearts, setHearts] = useState(getComputedHearts());
  const [regenLabel, setRegenLabel] = useState("");

  function formatRegen(ms: number): string {
    const min = Math.ceil(ms / 60000);
    if (min >= 60) return `${Math.floor(min / 60)}h${min % 60}m`;
    return `${min} min`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const h = getComputedHearts();
      setHearts(h);
      if (h.regenInMs) {
        setRegenLabel(formatRegen(h.regenInMs));
      } else {
        setRegenLabel("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const emptyCount = hearts.max - hearts.current;

  if (compact) {
    return (
      <div className="flex items-center gap-1" title={hearts.current === 0 ? "Plus de vies !" : `${hearts.current}/${hearts.max}`}>
        {Array.from({ length: hearts.current }).map((_, i) => (
          <span key={`full-${i}`} className="text-lg">❤️</span>
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <span key={`empty-${i}`} className="text-lg opacity-30">🖤</span>
        ))}
        {hearts.regenInMs && hearts.current < hearts.max && (
          <span className="text-[10px] text-gray-400 ml-1 font-medium">{regenLabel}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: hearts.current }).map((_, i) => (
        <span key={`full-${i}`} className={`text-xl ${hearts.current <= 2 ? "animate-pulse text-red-500" : ""}`}>
          ❤️
        </span>
      ))}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <span key={`empty-${i}`} className="text-xl opacity-20">❤️</span>
      ))}
      {hearts.regenInMs && hearts.current < hearts.max && (
        <span className="text-xs text-gray-400 ml-2 font-medium">
          +1 dans {regenLabel}
        </span>
      )}
      {hearts.current === 0 && (
        <button
          onClick={() => { refillHearts(); setHearts(getComputedHearts()); }}
          className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold hover:shadow-md transition-all"
        >
          Recharger
        </button>
      )}
    </div>
  );
}
