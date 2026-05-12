"use client";

import { useState, useRef, useEffect } from "react";
import type { FillBlankExercise } from "@/lib/grammarTypes";

interface Props {
  exercise: FillBlankExercise;
  onComplete: (quality: number) => void;
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function FillBlankView({ exercise, onComplete }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const question = exercise.questions[qIndex];
  const total = exercise.questions.length;
  const isCorrect = submitted && normalize(input) === normalize(question.answer);

  useEffect(() => {
    if (!submitted) inputRef.current?.focus();
  }, [qIndex, submitted]);

  const parts = question.sentence.split("___");

  function submit() {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
  }

  function next() {
    const newResults = [...results, isCorrect];
    if (qIndex + 1 < total) {
      setResults(newResults);
      setQIndex(qIndex + 1);
      setInput("");
      setSubmitted(false);
    } else {
      const correct = newResults.filter(Boolean).length;
      onComplete(Math.round((correct / total) * 3) as 0 | 1 | 2 | 3);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Заповни пропуск
        </p>
        <p className="text-xs text-gray-500">
          {qIndex + 1} / {total}
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 px-6 py-5 space-y-5">
        <div className="text-base text-gray-100 leading-relaxed flex flex-wrap items-baseline gap-1">
          {parts.map((part, i) => (
            <span key={i} className="flex flex-wrap items-baseline gap-1">
              <span>{part}</span>
              {i < parts.length - 1 && (
                <span
                  className={`inline-block border-b-2 min-w-[80px] px-1 text-center font-medium ${
                    submitted
                      ? isCorrect
                        ? "border-green-400 text-green-300"
                        : "border-red-400 text-red-300 line-through"
                      : "border-gray-400 text-gray-300"
                  }`}
                >
                  {submitted ? input || " " : input || "      "}
                </span>
              )}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-500">Підказка: {question.hint}</p>

        {!submitted && (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Введіть відповідь..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={submit}
              disabled={!input.trim()}
              className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-gray-200 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Перевірити
            </button>
          </div>
        )}

        {submitted && (
          <div
            className={`rounded-lg px-4 py-3 border text-sm space-y-1 ${
              isCorrect
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <p>
              <span className="font-semibold">{isCorrect ? "Правильно!" : "Неправильно."}</span>
              {!isCorrect && (
                <span className="ml-1">
                  Правильна відповідь:{" "}
                  <span className="font-mono font-semibold">{question.answer}</span>
                </span>
              )}
            </p>
            <p className="text-xs opacity-80">{question.explanation}</p>
          </div>
        )}
      </div>

      {submitted && (
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
