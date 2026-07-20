"use client";

import { useState, useEffect, useCallback } from "react";

interface Toast {
  id: number;
  emoji: string;
  title: string;
  desc: string;
  color: string;
}

let toastId = 0;
let addToastFn: ((t: Omit<Toast, "id">) => void) | null = null;

export function showToast(emoji: string, title: string, desc: string, color = "from-green-400 to-emerald-500") {
  if (addToastFn) addToastFn({ emoji, title, desc, color });
}

export default function CelebrationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: "calc(100vw - 32px)" }}>
      {toasts.map((t, i) => (
        <div
          key={t.id}
          className="glass-card-strong rounded-2xl px-5 py-4 shadow-xl animate-fade-in-up flex items-center gap-4 pointer-events-auto"
          style={{ animationDelay: "0ms", width: "360px", maxWidth: "100%" }}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
            {t.emoji}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm">{t.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
