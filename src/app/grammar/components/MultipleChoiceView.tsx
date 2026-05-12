"use client";

import { useState } from "react";
import type { MultipleChoiceExercise } from "@/lib/grammarTypes";

interface Props {
  exercise: MultipleChoiceExercise;
  onComplete: (quality: number) => void;
}

export default function MultipleChoiceView({ exercise, onComplete }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const question = exercise.questions[qIndex];
  const total = exercise.questions.length;
  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  function pick(i: number) {
    if (answered) return;
    setSelected(i);
  }

  function next() {
    const newResults = [...results, isCorrect];
    if (qIndex + 1 < total) {
      setResults(newResults);
      setQIndex(qIndex + 1);
      setSelected(null);
    } else {
      const correct = newResults.filter(Boolean).length;
      onComplete(Math.round((correct / total) * 3) as 0 | 1 | 2 | 3);
    }
  }

  function optionStyle(i: number) {
    const base =
      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors";
    if (!answered) {
      return `${base} border-gray-700 bg-gray-800 text-gray-200 hover:border-gray-500 hover:bg-gray-700 cursor-pointer`;
    }
    if (i === question.correct) {
      return `${base} border-green-500/50 bg-green-500/10 text-green-300`;
    }
    if (i === selected) {
      return `${base} border-red-500/50 bg-red-500/10 text-red-300`;
    }
    return `${base} border-gray-700/50 bg-gray-800/50 text-gray-500`;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Вибір відповіді
        </p>
        <p className="text-xs text-gray-500">
          {qIndex + 1} / {total}
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 px-6 py-5 space-y-5">
        <p className="text-base text-gray-100 leading-relaxed">{question.sentence}</p>

        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button key={i} className={optionStyle(i)} onClick={() => pick(i)}>
              <span className="font-mono text-xs text-gray-500 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        {answered && (
          <div
            className={`rounded-lg px-4 py-3 border text-sm ${
              isCorrect
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <span className="font-semibold mr-1">{isCorrect ? "Правильно!" : "Неправильно."}</span>
            {question.explanation}
          </div>
        )}
      </div>

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={next}
            className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-white transition-colors"
          >
            {qIndex + 1 < total ? "Далі →" : "Завершити"}
          </button>
        </div>
      )}
    </div>
  );
}
