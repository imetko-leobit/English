"use client";

import { LEVEL_LABELS } from "@/lib/grammarTypes";
import { formatNextReview } from "@/lib/grammarSm2";

interface Props {
  topicTitle: string;
  levelIndex: number;
  quality: number;
  nextReview: number | null;
  hasNextLevel: boolean;
  topicMastered: boolean;
  onNextLevel: () => void;
  onBackToTopics: () => void;
}

const QUALITY_LABELS = ["Потрібно повторити", "Слабо", "Добре", "Відмінно"];
const QUALITY_COLORS = [
  "text-red-400 border-red-500/30 bg-red-500/10",
  "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "text-green-400 border-green-500/30 bg-green-500/10",
];

export default function LevelCompleteView({
  topicTitle,
  levelIndex,
  quality,
  nextReview,
  hasNextLevel,
  topicMastered,
  onNextLevel,
  onBackToTopics,
}: Props) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-8">
      <div className="text-5xl">{topicMastered ? "🏆" : quality >= 2 ? "✅" : "📝"}</div>

      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-1">
          {topicMastered ? "Тему вивчено!" : "Рівень завершено"}
        </h2>
        <p className="text-sm text-gray-400">
          {topicTitle} — {LEVEL_LABELS[levelIndex]}
        </p>
      </div>

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${QUALITY_COLORS[quality]}`}
      >
        <span>{QUALITY_LABELS[quality]}</span>
        <span className="text-xs opacity-70">({quality}/3)</span>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-4 text-left space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Інтервальне повторення
        </p>
        <p className="text-sm text-gray-300">
          Наступне повторення:{" "}
          <span className="font-semibold text-gray-100">{formatNextReview(nextReview)}</span>
        </p>
      </div>

      {topicMastered && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-300">
          Ви успішно пройшли всі 4 рівні цієї теми!
        </div>
      )}

      <div className="flex flex-col gap-2">
        {hasNextLevel && !topicMastered && (
          <button
            onClick={onNextLevel}
            className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-white transition-colors"
          >
            Наступний рівень →
          </button>
        )}
        <button
          onClick={onBackToTopics}
          className="w-full py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
        >
          До списку тем
        </button>
      </div>
    </div>
  );
}
