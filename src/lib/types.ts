export type WordStatus = "new" | "learning" | "learned";
export type WordCategory =
  | "general"
  | "business"
  | "academic"
  | "phrasal verbs"
  | "idioms"
  | "slang"
  | "tech";
export type MeaningFreq = "primary" | "secondary" | "rare";

export interface Meaning {
  freq: MeaningFreq;
  freqLabel: "основне" | "розмовне" | "рідко";
  definition: string;
  translation: string;
  example: string;
}

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  category: WordCategory;
  meanings: Meaning[];
  status: WordStatus;
  interval: number;
  ef: number;
  due: number;
  repetitions: number;
  lastReview: number | null;
}

export interface ReviewLogEntry {
  date: string;
  count: number;
}
