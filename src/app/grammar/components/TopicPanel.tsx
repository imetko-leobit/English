"use client";

import { GRAMMAR_TOPICS, LEVEL_LABELS } from "@/lib/grammarTypes";
import type { TopicId, GrammarProgress } from "@/lib/grammarTypes";

interface Props {
  progress: GrammarProgress;
  activeTopic: TopicId | null;
  activeLevel: number | null;
  onSelectLevel: (topicId: TopicId, level: number) => void;
}

function LevelDot({
  index,
  progress,
  active,
  onClick,
}: {
  index: number;
  progress: { unlocked: boolean; completed: boolean; nextReview: number | null };
  active: boolean;
  onClick: () => void;
}) {
  const isDue = progress.completed && progress.nextReview !== null && progress.nextReview <= Date.now();

  if (!progress.unlocked) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-600 bg-gray-800/50 cursor-not-allowed"
        title={`${LEVEL_LABELS[index]} — заблоковано`}
      >
        <span>🔒</span>
        <span className="hidden sm:inline">{LEVEL_LABELS[index]}</span>
      </span>
    );
  }

  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors border";
  const style = active
    ? "border-gray-100 bg-gray-700 text-gray-100"
    : progress.completed
    ? isDue
      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20"
      : "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
    : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700";

  return (
    <button className={`${base} ${style}`} onClick={onClick}>
      <span>{progress.completed ? (isDue ? "↻" : "✓") : "○"}</span>
      <span className="hidden sm:inline">{LEVEL_LABELS[index]}</span>
    </button>
  );
}

export default function TopicPanel({ progress, activeTopic, activeLevel, onSelectLevel }: Props) {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-gray-800">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Теми</h2>
      </div>
      <nav className="flex flex-col gap-0.5 p-2">
        {GRAMMAR_TOPICS.map((topic) => {
          const tp = progress[topic.id];
          const mastered = [0, 1, 2, 3].every((i) => tp[i].completed);
          const isActive = activeTopic === topic.id;

          return (
            <div
              key={topic.id}
              className={`rounded-lg border transition-colors ${
                isActive ? "border-gray-700 bg-gray-800" : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span
                  className={`flex-1 text-sm font-medium leading-tight ${
                    isActive ? "text-gray-100" : "text-gray-300"
                  }`}
                >
                  {topic.title}
                </span>
                {mastered && (
                  <span className="shrink-0 text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/30 px-1.5 py-0.5 rounded">
                    Вивчено
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 px-3 pb-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <LevelDot
                    key={i}
                    index={i}
                    progress={tp[i]}
                    active={isActive && activeLevel === i}
                    onClick={() => tp[i].unlocked && onSelectLevel(topic.id, i)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
