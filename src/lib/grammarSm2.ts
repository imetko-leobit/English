import type { LevelProgress } from "./grammarTypes";

export function applyGrammarRating(level: LevelProgress, quality: number): LevelProgress {
  const now = Date.now();
  let { interval, ef, repetitions } = level;

  if (quality < 2) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ef);
    repetitions += 1;
  }

  ef = Math.max(1.3, ef + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));

  return {
    ...level,
    interval,
    ef,
    repetitions,
    quality,
    lastReview: now,
    nextReview: now + interval * 86_400_000,
    completed: true,
    unlocked: true,
  };
}

export function formatNextReview(ts: number | null): string {
  if (!ts) return "—";
  const days = Math.round((ts - Date.now()) / 86_400_000);
  if (days <= 0) return "сьогодні";
  if (days === 1) return "завтра";
  return `через ${days} дн.`;
}
