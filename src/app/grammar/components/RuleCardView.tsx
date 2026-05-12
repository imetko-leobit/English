"use client";

import type { RuleCard } from "@/lib/grammarTypes";

interface Props {
  exercise: RuleCard;
  onComplete: (quality: number) => void;
}

export default function RuleCardView({ exercise, onComplete }: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Правило</p>
          <h2 className="text-xl font-semibold text-gray-100">{exercise.title}</h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Структура</p>
            <div className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 font-mono text-sm text-blue-300">
              {exercise.formula}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Маркери</p>
            <div className="flex flex-wrap gap-2">
              {exercise.markers.map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/30 text-blue-300"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Приклади</p>
            <div className="space-y-3">
              {exercise.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-3">
                  <p className="text-sm text-gray-100 italic mb-1">&ldquo;{ex.sentence}&rdquo;</p>
                  <p className="text-xs text-gray-400">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Підсумок</p>
            <p className="text-sm text-gray-300">{exercise.summary}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onComplete(3)}
          className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-white transition-colors"
        >
          Зрозуміло →
        </button>
      </div>
    </div>
  );
}
