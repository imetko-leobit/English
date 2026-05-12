import type { GrammarProgress, LevelProgress, TopicId } from "./grammarTypes";
import { GRAMMAR_TOPICS } from "./grammarTypes";

const KEY = "english-grammar-progress";

function defaultLevel(index: number): LevelProgress {
  return {
    unlocked: index === 0,
    completed: false,
    quality: 0,
    lastReview: null,
    nextReview: null,
    interval: 1,
    ef: 2.5,
    repetitions: 0,
  };
}

function buildDefault(): GrammarProgress {
  return Object.fromEntries(
    GRAMMAR_TOPICS.map((t) => [
      t.id,
      Object.fromEntries([0, 1, 2, 3].map((i) => [i, defaultLevel(i)])),
    ])
  ) as GrammarProgress;
}

function mergeWithDefaults(saved: Partial<GrammarProgress>): GrammarProgress {
  const result = buildDefault();
  for (const topic of GRAMMAR_TOPICS) {
    const savedTopic = saved[topic.id as TopicId];
    if (!savedTopic) continue;
    for (let i = 0; i < 4; i++) {
      const savedLevel = savedTopic[i];
      if (savedLevel) result[topic.id as TopicId][i] = { ...result[topic.id as TopicId][i], ...savedLevel };
    }
  }
  return result;
}

export function loadGrammarProgress(): GrammarProgress {
  if (typeof window === "undefined") return buildDefault();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return buildDefault();
    return mergeWithDefaults(JSON.parse(raw) as Partial<GrammarProgress>);
  } catch {
    return buildDefault();
  }
}

export function saveGrammarProgress(progress: GrammarProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(progress));
}
