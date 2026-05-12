export type TopicId =
  | "present-perfect"
  | "conditionals"
  | "passive-voice"
  | "modal-verbs";

export interface GrammarTopic {
  id: TopicId;
  title: string;
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  { id: "present-perfect", title: "Present Perfect vs Past Simple" },
  { id: "conditionals", title: "Conditionals" },
  { id: "passive-voice", title: "Passive Voice" },
  { id: "modal-verbs", title: "Modal Verbs" },
];

export const LEVEL_LABELS = [
  "Правило",
  "Вибір відповіді",
  "Заповни пропуск",
  "Трансформація",
] as const;

export interface RuleCard {
  type: "rule";
  title: string;
  formula: string;
  markers: string[];
  examples: { sentence: string; note: string }[];
  summary: string;
}

export interface MultipleChoiceQuestion {
  sentence: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface MultipleChoiceExercise {
  type: "multiple-choice";
  questions: MultipleChoiceQuestion[];
}

export interface FillBlankQuestion {
  sentence: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface FillBlankExercise {
  type: "fill-blank";
  questions: FillBlankQuestion[];
}

export interface TransformationQuestion {
  original: string;
  instruction: string;
  answer: string;
  explanation: string;
}

export interface TransformationExercise {
  type: "transformation";
  questions: TransformationQuestion[];
}

export type ExerciseData =
  | RuleCard
  | MultipleChoiceExercise
  | FillBlankExercise
  | TransformationExercise;

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  quality: number;
  lastReview: number | null;
  nextReview: number | null;
  interval: number;
  ef: number;
  repetitions: number;
}

export type TopicProgress = Record<number, LevelProgress>;
export type GrammarProgress = Record<TopicId, TopicProgress>;
