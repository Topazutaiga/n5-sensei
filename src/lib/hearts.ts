"use client";

const MAX_HEARTS = 5;
const REGEN_INTERVAL_MS = 30 * 60 * 1000; // 30 min per heart
const STORAGE_KEY = "n5sensei_hearts";

interface HeartsState {
  current: number;
  lastLostAt: number | null; // timestamp when heart was last lost
}

export function getHearts(): HeartsState {
  if (typeof window === "undefined") return { current: MAX_HEARTS, lastLostAt: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { current: MAX_HEARTS, lastLostAt: null };
}

function saveHearts(state: HeartsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function getComputedHearts(): { current: number; max: number; regenInMs: number | null } {
  const state = getHearts();
  const now = Date.now();

  if (state.current >= MAX_HEARTS || !state.lastLostAt) {
    return { current: Math.min(MAX_HEARTS, state.current), max: MAX_HEARTS, regenInMs: null };
  }

  // Calculate how many hearts regenerated since last lost
  const elapsed = now - state.lastLostAt;
  const regened = Math.floor(elapsed / REGEN_INTERVAL_MS);
  const newCurrent = Math.min(MAX_HEARTS, state.current + regened);

  // Calculate time until next heart
  const nextRegenMs = regened > 0
    ? REGEN_INTERVAL_MS - (elapsed % REGEN_INTERVAL_MS)
    : REGEN_INTERVAL_MS - elapsed;

  // Update localStorage with regenerated hearts
  const updated: HeartsState = {
    current: newCurrent,
    lastLostAt: newCurrent >= MAX_HEARTS ? null : state.lastLostAt,
  };
  saveHearts(updated);

  return {
    current: newCurrent,
    max: MAX_HEARTS,
    regenInMs: newCurrent >= MAX_HEARTS ? null : nextRegenMs,
  };
}

export function loseHeart(): { current: number; max: number; regenInMs: number | null } {
  const state = getHearts();
  const now = Date.now();

  // First regenerate any pending hearts
  let current = state.current;
  let lastLostAt = state.lastLostAt;

  if (lastLostAt && current < MAX_HEARTS) {
    const elapsed = now - lastLostAt;
    const regened = Math.floor(elapsed / REGEN_INTERVAL_MS);
    current = Math.min(MAX_HEARTS, current + regened);
  }

  // Lose one heart
  current = Math.max(0, current - 1);
  lastLostAt = now;

  const updated: HeartsState = { current, lastLostAt };
  saveHearts(updated);

  return {
    current,
    max: MAX_HEARTS,
    regenInMs: current >= MAX_HEARTS ? null : REGEN_INTERVAL_MS,
  };
}

export function refillHearts(): { current: number; max: number; regenInMs: null } {
  const state: HeartsState = { current: MAX_HEARTS, lastLostAt: null };
  saveHearts(state);
  return { current: MAX_HEARTS, max: MAX_HEARTS, regenInMs: null };
}
