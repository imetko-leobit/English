"use client";

import { useState } from "react";
import type { Word } from "@/lib/types";
import type { Quality } from "@/lib/sm2";
import { applyRating } from "@/lib/sm2";
import { mergeWithStorage, saveSm2Data, recordReview } from "@/lib/storage";
import { WORDS } from "@/data/words";

const SM2_KEYS: (keyof Word)[] = [
  "status",
  "interval",
  "ef",
  "due",
  "repetitions",
  "lastReview",
];

function pickSm2(word: Word) {
  return Object.fromEntries(SM2_KEYS.map((k) => [k, word[k]])) as Pick<
    Word,
    "status" | "interval" | "ef" | "due" | "repetitions" | "lastReview"
  >;
}

export function useWords() {
  const [words, setWords] = useState<Word[]>(() => mergeWithStorage(WORDS));

  function rate(id: string, quality: Quality) {
    setWords((prev) => {
      const updated = prev.map((w) =>
        w.id === id ? applyRating(w, quality) : w
      );
      const sm2Data = Object.fromEntries(
        updated.map((w) => [w.id, pickSm2(w)])
      );
      saveSm2Data(sm2Data);
      recordReview();
      return updated;
    });
  }

  return { words, rate };
}
