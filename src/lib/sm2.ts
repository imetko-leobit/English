import type { Word, WordStatus } from "@/lib/types";

export type Quality = 0 | 1 | 2 | 3;

export function applyRating(word: Word, quality: Quality): Word {
  const now = Date.now();
  let { interval, ef, repetitions } = word;

  if (quality < 2) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ef);
    repetitions += 1;
  }

  ef = Math.max(
    1.3,
    ef + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)
  );

  const due = now + interval * 86_400_000;

  const status: WordStatus =
    repetitions === 0
      ? "new"
      : repetitions >= 4 || interval >= 21
        ? "learned"
        : "learning";

  return { ...word, interval, ef, repetitions, due, lastReview: now, status };
}
