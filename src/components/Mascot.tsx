"use client";

import { useState, useEffect, useRef } from "react";
import { type GamificationState } from "@/lib/gamification";

interface MascotMessage {
  emoji: string;
  message: string;
  mood: "neutral" | "happy" | "excited" | "celebrate" | "tip";
}

const GREETINGS: Record<string, MascotMessage[]> = {
  morning: [
    { emoji: "🌅", message: "おはよう！Ready to study today?", mood: "happy" },
    { emoji: "☀️", message: "Bonne matinée ! Le japonais t'attend !", mood: "happy" },
  ],
  afternoon: [
    { emoji: "🌸", message: "こんにちは ! On révise un peu ?", mood: "neutral" },
    { emoji: "📚", message: "Une petite session étude ? がんばろう！", mood: "happy" },
  ],
  evening: [
    { emoji: "🌙", message: "こんばんは ! Parfait pour réviser avant de dormir", mood: "neutral" },
    { emoji: "🦉", message: "Super moment pour étudier. Le calme du soir aide à mémoriser !", mood: "tip" },
  ],
  night: [
    { emoji: "🌃", message: "Il est tard ! Un peu de révision puis au lit ! おやすみ", mood: "tip" },
  ],
};

const STREAK_MESSAGES: { min: number; max: number; messages: MascotMessage[] }[] = [
  { min: 0, max: 0, messages: [
    { emoji: "👋", message: "Bienvenue ! Commence par réviser quelques cartes", mood: "neutral" },
  ]},
  { min: 1, max: 2, messages: [
    { emoji: "🔥", message: "1er jour ! Le plus important est fait : commencer !", mood: "happy" },
  ]},
  { min: 3, max: 6, messages: [
    { emoji: "💪", message: "Belle série ! Continue comme ça !", mood: "happy" },
    { emoji: "📈", message: "Tu progresses chaque jour. すごい！", mood: "happy" },
  ]},
  { min: 7, max: 13, messages: [
    { emoji: "🎉", message: "7 jours ! C'est énorme ! Une habitude se crée !", mood: "celebrate" },
    { emoji: "⭐", message: "Une semaine déjà ! よくできました！", mood: "excited" },
  ]},
  { min: 14, max: 29, messages: [
    { emoji: "🔥", message: "2 semaines ! Tu déchire ! すばらしい！", mood: "excited" },
    { emoji: "🏆", message: "La discipline paie. Continue !", mood: "celebrate" },
  ]},
  { min: 30, max: Infinity, messages: [
    { emoji: "👑", message: "30 jours !!! Tu es un vrai samouraï de l'étude !", mood: "celebrate" },
    { emoji: "🌟", message: "Legendaire ! 30 jours d'affilée !", mood: "excited" },
  ]},
];

const LEVEL_UP_MESSAGES: MascotMessage[] = [
  { emoji: "🎊", message: "Niveau supérieur ! おめでとう！", mood: "excited" },
  { emoji: "📈", message: "Tu montes en niveau ! Continue comme ça !", mood: "celebrate" },
  { emoji: "🌸", message: "Nouveau niveau débloqué ! すごい！", mood: "excited" },
];

const DUE_MESSAGES: { mins: number; max: number; messages: MascotMessage[] }[] = [
  { mins: 0, max: 0, messages: [
    { emoji: "🎉", message: "Tout est à jour ! Prends une pause ou va plus loin.", mood: "celebrate" },
  ]},
  { mins: 1, max: 10, messages: [
    { emoji: "📚", message: "Tu as quelques cartes à réviser. C'est le moment !", mood: "neutral" },
  ]},
  { mins: 11, max: 30, messages: [
    { emoji: "💪", message: "Pas mal de révisions t'attendent ! À l'œuvre !", mood: "happy" },
  ]},
  { mins: 31, max: Infinity, messages: [
    { emoji: "🔥", message: "Beaucoup de révisions ! Commence par les plus anciennes.", mood: "tip" },
  ]},
];

const GENERAL_TIPS: MascotMessage[] = [
  { emoji: "💡", message: "Astuce : réviser 10 minutes chaque jour est plus efficace qu'une heure d'affilée !", mood: "tip" },
  { emoji: "📝", message: "N'oublie pas de faire les quiz pour tester ta mémoire !", mood: "tip" },
  { emoji: "🔊", message: "Entraîne-toi à écouter les phrases pour progresser en compréhension !", mood: "tip" },
  { emoji: "🎯", message: "Les exercices type JLPT sont parfaits pour se préparer à l'examen !", mood: "tip" },
  { emoji: "📖", message: "Révise les kanji régulièrement : c'est la clé de la lecture !", mood: "tip" },
  { emoji: "🌊", message: "Petit à petit, l'oiseau fait son nid. 継続は力なり (la persévérance est force).", mood: "tip" },
];

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  if (h < 22) return "evening";
  return "night";
}

function pick<T extends MascotMessage>(arr: T[]): T {
  const daySeed = new Date().toISOString().slice(0, 10);
  const idx = daySeed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % arr.length;
  return arr[idx % arr.length];
}

function getGreeting(): MascotMessage {
  const tod = getTimeOfDay();
  const msgs = GREETINGS[tod];
  return pick(msgs);
}

function getStreakMessage(streak: number): MascotMessage | null {
  for (const tier of STREAK_MESSAGES) {
    if (streak >= tier.min && streak <= tier.max) {
      return pick(tier.messages);
    }
  }
  return null;
}

function getDueMessage(due: number): MascotMessage {
  for (const tier of DUE_MESSAGES) {
    if (due >= tier.mins && due <= tier.max) {
      return pick(tier.messages);
    }
  }
  return { emoji: "📚", message: "Réviser régulièrement est la clé du succès !", mood: "tip" as const };
}

function getRandomTip(): MascotMessage {
  return pick(GENERAL_TIPS);
}

function getLevelUpMessage(): MascotMessage {
  return pick(LEVEL_UP_MESSAGES);
}

const CHARACTERS = {
  sensei: {
    neutral: "🧑‍🏫",
    happy: "😊",
    excited: "🤩",
    celebrate: "🎉",
    tip: "💡",
    default: "🧑‍🏫",
  },
};

interface MascotProps {
  gam?: GamificationState | null;
  dueCards?: number;
  className?: string;
  compact?: boolean;
  showLevelUp?: boolean;
}

export default function Mascot({ gam, dueCards = 0, className = "", compact = false, showLevelUp = false }: MascotProps) {
  const [msg, setMsg] = useState<MascotMessage>({ emoji: "👋", message: "", mood: "neutral" });
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const prevLevel = useRef(gam?.level || 1);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!gam) return;

    // Check level up
    if (showLevelUp && gam.level > prevLevel.current) {
      setMsg(getLevelUpMessage());
      setAnimating(true);
      setTimeout(() => setAnimating(false), 3000);
      prevLevel.current = gam.level;
      return;
    }

    // Priority: streak > due cards > greeting > tip
    if (gam.streak > 0) {
      const streakMsg = getStreakMessage(gam.streak);
      if (streakMsg) { setMsg(streakMsg); return; }
    }

    if (dueCards > 0) {
      setMsg(getDueMessage(dueCards));
      return;
    }

    // Alternate between greeting and tips
    const isTip = new Date().getMinutes() % 3 === 0;
    if (isTip) {
      setMsg(getRandomTip());
    } else {
      setMsg(getGreeting());
    }
  }, [gam, dueCards, showLevelUp]);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm ${visible ? "animate-fade-in" : "opacity-0"} ${className}`}>
        <span className="text-xl">🧑‍🏫</span>
        <div className="bg-white dark:bg-[#252220] rounded-2xl px-3 py-1.5 shadow-sm border border-gray-100 dark:border-gray-800 text-xs max-w-[200px]">
          {msg.message}
        </div>
      </div>
    );
  }

  const moodEmoji = {
    neutral: "🧑‍🏫",
    happy: "😊",
    excited: "🤩",
    celebrate: "🎉",
    tip: "💡",
  };

  return (
    <div className={`relative transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}>
      <div className={`flex items-start gap-3 ${animating ? "animate-bounce" : ""}`}>
        {/* Character avatar */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center text-3xl shadow-md border-2 border-red-200 dark:border-red-800 transition-all duration-300 ${
          msg.mood === "excited" || msg.mood === "celebrate" ? "scale-110" : ""
        }`}>
          {moodEmoji[msg.mood]}
        </div>

        {/* Speech bubble */}
        <div className="flex-1 relative">
          <div className="glass-card-strong rounded-2xl rounded-tl-sm p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-[10px] font-bold shadow-sm">
                  SENSEI
                </div>
                {gam && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    Niveau {gam.level} · {gam.xp} XP
                  </span>
                )}
              </div>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-300 hover:text-gray-500 text-sm leading-none flex-shrink-0 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="mr-1.5">{msg.emoji}</span>
              {msg.message}
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute left-[-6px] top-4 w-3 h-3 bg-white dark:bg-[#252220] border-l border-b border-gray-100 dark:border-gray-800 transform -rotate-45 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
}
