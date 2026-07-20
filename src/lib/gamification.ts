"use client";

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  dailyXp: number;
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  totalReviewed: number;
  totalCorrect: number;
  totalQuizComplete: number;
}

export interface DailyMission {
  id: string;
  labelKey: string;
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  labelKey: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

const MISSIONS: Omit<DailyMission, "progress" | "completed" | "claimed">[] = [
  { id: "review_10", labelKey: "mission_review_10", target: 10, xpReward: 50 },
  { id: "quiz_1", labelKey: "mission_quiz_1", target: 1, xpReward: 30 },
  { id: "listen_3", labelKey: "mission_listen_3", target: 3, xpReward: 40 },
  { id: "correct_5", labelKey: "mission_correct_5", target: 5, xpReward: 35 },
];

const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  { id: "first_review", labelKey: "ach_first_review", emoji: "🎯" },
  { id: "streak_7", labelKey: "ach_streak_7", emoji: "🔥" },
  { id: "streak_30", labelKey: "ach_streak_30", emoji: "💪" },
  { id: "master_50", labelKey: "ach_master_50", emoji: "⭐" },
  { id: "master_100", labelKey: "ach_master_100", emoji: "🌟" },
  { id: "quiz_10", labelKey: "ach_quiz_10", emoji: "📝" },
  { id: "quiz_perfect", labelKey: "ach_quiz_perfect", emoji: "🏆" },
  { id: "review_500", labelKey: "ach_review_500", emoji: "📚" },
];

const XP_PER_LEVEL = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

export function getInitialState(): GamificationState {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastActivityDate: "",
    dailyXp: 0,
    dailyMissions: MISSIONS.map((m) => ({ ...m, progress: 0, completed: false, claimed: false })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: null })),
    totalReviewed: 0,
    totalCorrect: 0,
    totalQuizComplete: 0,
  };
}

export function getGamification(): GamificationState {
  if (typeof window === "undefined") return getInitialState();
  try {
    const raw = localStorage.getItem("n5sensei_gamification");
    if (raw) return JSON.parse(raw);
  } catch {}
  return getInitialState();
}

export function saveGamification(state: GamificationState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("n5sensei_gamification", JSON.stringify(state));
  } catch {}
}

export function addXp(state: GamificationState, amount: number): GamificationState {
  const today = new Date().toISOString().slice(0, 10);
  const s = { ...state, xp: state.xp + amount, dailyXp: state.dailyXp + amount, lastActivityDate: today };
  while (s.xp >= XP_PER_LEVEL(s.level)) {
    s.xp -= XP_PER_LEVEL(s.level);
    s.level += 1;
  }
  return s;
}

export function checkAchievements(state: GamificationState, cards: Record<string, { level: number }>): GamificationState {
  const today = new Date().toISOString().slice(0, 10);
  const s = { ...state, achievements: [...state.achievements] };
  const mastered = Object.values(cards).filter((c) => c.level >= 3).length;

  const checks: [string, () => boolean][] = [
    ["first_review", () => state.totalReviewed >= 1],
    ["streak_7", () => state.streak >= 7],
    ["streak_30", () => state.streak >= 30],
    ["master_50", () => mastered >= 50],
    ["master_100", () => mastered >= 100],
    ["quiz_10", () => state.totalQuizComplete >= 10],
    ["quiz_perfect", () => state.totalCorrect >= 50],
    ["review_500", () => state.totalReviewed >= 500],
  ];

  s.achievements = s.achievements.map((a) => {
    const check = checks.find(([id]) => id === a.id);
    if (check && check[1]() && !a.unlocked) {
      return { ...a, unlocked: true, unlockedAt: today };
    }
    return a;
  });

  return s;
}

export function updateMissions(state: GamificationState): GamificationState {
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = localStorage.getItem("n5sensei_mission_date");

  if (storedDate !== today) {
    localStorage.setItem("n5sensei_mission_date", today);
    return {
      ...state,
      dailyMissions: MISSIONS.map((m) => ({ ...m, progress: 0, completed: false, claimed: false })),
    };
  }

  const s = { ...state, dailyMissions: [...state.dailyMissions] };
  s.dailyMissions = s.dailyMissions.map((m) => {
    if (m.progress >= m.target && !m.claimed) {
      return { ...m, completed: true };
    }
    return m;
  });

  return s;
}

export function claimMission(state: GamificationState, missionId: string): GamificationState {
  let s = { ...state, dailyMissions: [...state.dailyMissions] };
  s.dailyMissions = s.dailyMissions.map((m) => {
    if (m.id === missionId && m.completed && !m.claimed) {
      s = addXp(s, m.xpReward);
      return { ...m, claimed: true };
    }
    return m;
  });
  return s;
}

export function getLevelProgress(state: GamificationState): { current: number; next: number; pct: number } {
  const current = XP_PER_LEVEL(state.level);
  const pct = Math.min(100, Math.round((state.xp / current) * 100));
  return { current, next: current, pct };
}
