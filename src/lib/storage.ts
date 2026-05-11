import type { Word, ReviewLogEntry } from "@/lib/types";

const SM2_KEY = "english-sm2";
const LOG_KEY = "english-review-log";

type Sm2Fields = Pick<
  Word,
  "status" | "interval" | "ef" | "due" | "repetitions" | "lastReview"
>;

export function loadSm2Data(): Record<string, Sm2Fields> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SM2_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Sm2Fields>) : {};
  } catch {
    return {};
  }
}

export function saveSm2Data(data: Record<string, Sm2Fields>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SM2_KEY, JSON.stringify(data));
}

export function loadReviewLog(): ReviewLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as ReviewLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveReviewLog(log: ReviewLogEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

export function recordReview(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  const log = loadReviewLog();
  const existing = log.find((e) => e.date === today);
  if (existing) {
    existing.count += 1;
  } else {
    log.push({ date: today, count: 1 });
  }
  saveReviewLog(log);
}

export function mergeWithStorage(words: Word[]): Word[] {
  const sm2 = loadSm2Data();
  return words.map((w) => {
    const saved = sm2[w.id];
    return saved ? { ...w, ...saved } : w;
  });
}

const CUSTOM_WORDS_KEY = "english-custom-words";

export function loadCustomWords(): Word[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    return raw ? (JSON.parse(raw) as Word[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomWords(words: Word[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
}

export function addCustomWords(newWords: Word[]): void {
  const existing = loadCustomWords();
  const existingIds = new Set(existing.map((w) => w.id));
  const toAdd = newWords.filter((w) => !existingIds.has(w.id));
  saveCustomWords([...existing, ...toAdd]);
}

const DELETED_KEY = "english-deleted-words";

export function loadDeletedWordIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function addDeletedWordId(id: string): void {
  if (typeof window === "undefined") return;
  const ids = loadDeletedWordIds();
  ids.add(id);
  localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]));
}
