import type { Word } from "@/lib/types";
import rawWords from "./words.json";

type RawWord = Omit<Word, "status" | "interval" | "ef" | "due" | "repetitions" | "lastReview">;

export const WORDS: Word[] = (rawWords as RawWord[]).map((w) => ({
  ...w,
  status: "new" as const,
  interval: 0,
  ef: 2.5,
  due: Date.now(),
  repetitions: 0,
  lastReview: null,
}));
