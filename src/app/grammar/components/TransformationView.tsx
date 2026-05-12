"use client";

import { useState, useRef, useEffect } from "react";
import type { TransformationExercise } from "@/lib/grammarTypes";

interface Props {
  exercise: TransformationExercise;
  onComplete: (quality: number) => void;
}

type Phase = "writing" | "self-assess";

export default function TransformationView({ exercise, onComplete }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("writing");
  const [results, setResults] = useState<boolean[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const question = exercise.questions[qIndex];
  const total = exercise.questions.length;

  useEffect(() => {
    if (phase === "writing") textareaRef.current?.focus();
  }, [qIndex, phase]);

  function submit() {
    if (!input.trim()) return;
    setPhase("self-assess");
  }

  function assess(correct: boolean) {
    const newResults = [...results, correct];
    if (qIndex + 1 < total) {
      setResults(newResults);
      setQIndex(qIndex + 1);
      setInput("");
      setPhase("writing");
    } else {
      const count = newResults.filter(Boolean).length;
      onComplete(Math.round((count / total) * 3) as 0 | 1 | 2 | 3);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Трансформація речення
        </p>
        <p className="text-xs text-gray-500">
          {qIndex + 1} / {total}
        </p>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900 px-6 py-5 space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Оригінал</p>
          <p className="text-base text-gray-100 italic">&ldquo;{question.original}&rdquo;</p>
        </div>

        <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 px-4 py-2.5">
          <p className="text-sm text-blue-300">
            <span className="font-semibold">Завдання: </span>
            {question.instruction}
          </p>
        </div>

        {phase === "writing" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Ваш варіант:</p>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Напишіть трансформоване речення..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={submit}
                disabled={!input.trim()}
                className="px-5 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-gray-200 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Перевірити
              </button>
            </div>
          </div>
        )}

        {phase === "self-assess" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Ваша відповідь:</p>
              <p className="text-sm text-gray-200 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                {input}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Правильна відповідь:</p>
              <p className="text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                {question.answer}
              </p>
              <p className="text-xs text-gray-400">{question.explanation}</p>
            </div>
            <div className="pt-1">
              <p className="text-xs text-gray-500 mb-2">Чи правильна ваша відповідь?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => assess(true)}
                  className="flex-1 py-2 rounded-lg border border-green-500/40 bg-green-500/10 text-green-300 text-sm font-medium hover:bg-green-500/20 transition-colors"
                >
                  Так, правильно
                </button>
                <button
                  onClick={() => assess(false)}
                  className="flex-1 py-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  Ні, помилився
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
