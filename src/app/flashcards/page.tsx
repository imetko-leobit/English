"use client";

import { useState, useRef, useEffect } from "react";
import type { Word, WordCategory } from "@/lib/types";
import type { Quality } from "@/lib/sm2";
import { useWords } from "@/hooks/useWords";
import CategoryTag from "@/components/CategoryTag";
import FreqBadge from "@/components/FreqBadge";

const CATEGORY_KEY = "english-category-filter";

const CATEGORY_LABELS: { value: WordCategory | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "general", label: "Загальне" },
  { value: "business", label: "Бізнес" },
  { value: "academic", label: "Академічне" },
  { value: "tech", label: "Технології" },
  { value: "phrasal verbs", label: "Фразові дієслова" },
  { value: "idioms", label: "Ідіоми" },
  { value: "slang", label: "Сленг" },
];

function getSavedCategory(): WordCategory | "all" {
  if (typeof window === "undefined") return "all";
  return (localStorage.getItem(CATEGORY_KEY) as WordCategory | "all") ?? "all";
}

function filterByCategory(words: Word[], cat: WordCategory | "all"): Word[] {
  return cat === "all" ? words : words.filter((w) => w.category === cat);
}

function buildQueue(words: Word[]): Word[] {
  const now = Date.now();
  const due = words.filter((w) => w.due <= now);
  return [...due].sort(() => Math.random() - 0.5);
}

function getNextDueDate(words: Word[]): number | null {
  const now = Date.now();
  const futureDues = words.map((w) => w.due).filter((d) => d > now);
  return futureDues.length > 0 ? Math.min(...futureDues) : null;
}

function formatNextSession(ts: number | null): string {
  if (!ts) return "—";
  const d = new Date(ts);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Сьогодні";
  if (d.toDateString() === tomorrow.toDateString()) return "Завтра";
  return d.toLocaleDateString("uk-UA", { day: "2-digit", month: "long" });
}

const RATINGS: { label: string; quality: Quality; color: string }[] = [
  { label: "Не знаю", quality: 0, color: "border-red-800 text-red-400 hover:bg-red-900/30" },
  { label: "Важко", quality: 1, color: "border-orange-800 text-orange-400 hover:bg-orange-900/30" },
  { label: "Добре", quality: 2, color: "border-blue-800 text-blue-400 hover:bg-blue-900/30" },
  { label: "Легко", quality: 3, color: "border-green-800 text-green-400 hover:bg-green-900/30" },
];

export default function FlashcardsPage() {
  const { words, rate } = useWords();

  const [selectedCategory, setSelectedCategory] = useState<WordCategory | "all">(getSavedCategory);
  const [queue, setQueue] = useState<Word[]>(() =>
    buildQueue(filterByCategory(words, getSavedCategory()))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [learnedThisSession, setLearnedThisSession] = useState(0);
  const initialLearnedCount = useRef(
    words.filter((w) => w.status === "learned").length
  );

  const isDone = queue.length === 0 || currentIndex >= queue.length;
  const current = queue[currentIndex];

  function handleCategoryChange(cat: WordCategory | "all") {
    localStorage.setItem(CATEGORY_KEY, cat);
    setSelectedCategory(cat);
    setQueue(buildQueue(filterByCategory(words, cat)));
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(0);
    setLearnedThisSession(0);
  }

  function handleRate(quality: Quality) {
    if (!current) return;
    rate(current.id, quality);
    setReviewed((r) => r + 1);

    const updatedWord = words.find((w) => w.id === current.id);
    if (updatedWord) {
      const wasNotLearned = updatedWord.status !== "learned";
      const nowLearned =
        quality >= 2 &&
        (updatedWord.repetitions + 1 >= 4 || updatedWord.interval >= 21);
      if (wasNotLearned && nowLearned) {
        setLearnedThisSession((c) => c + 1);
      }
    }

    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => i + 1), 60);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isDone) return;

      switch (e.key) {
        case "1": handleRate(0); break;
        case "2": handleRate(1); break;
        case "3": handleRate(2); break;
        case "4": handleRate(3); break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone, current]);

  function handleRestart() {
    setQueue(buildQueue(filterByCategory(words, selectedCategory)));
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(0);
    initialLearnedCount.current = words.filter((w) => w.status === "learned").length;
    setLearnedThisSession(0);
  }

  if (isDone) {
    const nextDue = getNextDueDate(words);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8">
        <div className="text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-semibold text-gray-100 mb-2">
            На сьогодні все
          </h1>
          <p className="text-gray-500 text-sm">Наступна сесія: {formatNextSession(nextDue)}</p>
        </div>

        <div className="flex gap-6">
          <div className="text-center border border-gray-800 rounded-lg px-8 py-5 bg-gray-900">
            <p className="text-3xl font-bold text-gray-100">{reviewed}</p>
            <p className="text-xs text-gray-500 mt-1">переглянуто</p>
          </div>
          <div className="text-center border border-green-900 rounded-lg px-8 py-5 bg-gray-900">
            <p className="text-3xl font-bold text-green-400">
              {learnedThisSession}
            </p>
            <p className="text-xs text-gray-500 mt-1">вивчено сьогодні</p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="px-6 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Почати знову
        </button>
      </div>
    );
  }

  const progress = Math.round((currentIndex / queue.length) * 100);

  // Group meanings by pos for back face
  const meaningsByPos = current.meanings.reduce<Record<string, typeof current.meanings>>(
    (acc, m) => {
      const key = m.pos ?? "";
      acc[key] = [...(acc[key] ?? []), m];
      return acc;
    },
    {}
  );
  const posGroups = Object.entries(meaningsByPos);

  return (
    <div className="flex flex-col items-center py-10 px-8 min-h-screen">
      {/* Category filter */}
      <div className="w-full max-w-lg mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORY_LABELS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleCategoryChange(value)}
            className={[
              "shrink-0 px-3 py-1.5 text-xs rounded-full border transition-colors",
              selectedCategory === value
                ? "border-gray-400 text-gray-100 bg-gray-700"
                : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-gray-600 mb-1.5">
          <span>Прогрес</span>
          <span>
            {currentIndex} / {queue.length}
          </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-300 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg card-perspective">
        <div
          className={`card-inner w-full ${isFlipped ? "flipped" : ""}`}
          style={{ minHeight: 440 }}
        >
          {/* Front face */}
          <div
            className="card-face absolute inset-0 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col cursor-pointer select-none"
            onClick={() => setIsFlipped(true)}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-10 pt-7">
              <CategoryTag category={current.category} />
              <span className="text-xs text-gray-600">{current.partOfSpeech}</span>
            </div>

            {/* Center */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-12">
              <h2 className="text-4xl font-bold text-gray-100">{current.word}</h2>
              <p className="text-lg text-gray-500 font-mono">{current.phonetic}</p>
            </div>

            {/* Hint */}
            <p className="text-center text-xs text-gray-700 mb-3">
              Натисніть для перегляду значень
            </p>

            {/* Front rating buttons */}
            <div
              className="grid grid-cols-2 gap-3 px-7 pb-7"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleRate(0)}
                className="py-3 text-sm font-medium border border-red-800 text-red-400 rounded-xl hover:bg-red-900/30 transition-colors"
              >
                Не знаю
              </button>
              <button
                onClick={() => handleRate(3)}
                className="py-3 text-sm font-medium border border-green-800 text-green-400 rounded-xl hover:bg-green-900/30 transition-colors"
              >
                Знаю
              </button>
            </div>
          </div>

          {/* Back face */}
          <div
            className="card-face card-back absolute inset-0 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden cursor-pointer select-none"
            onClick={() => setIsFlipped(false)}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-10 pt-7 pb-4 shrink-0">
              <CategoryTag category={current.category} />
              <span className="ml-auto text-base font-bold text-gray-100">
                {current.word}
              </span>
            </div>

            {/* Meanings grouped by pos — scrollable */}
            <div
              className="flex-1 overflow-y-auto px-10 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {posGroups.map(([pos, meanings]) => (
                <div key={pos}>
                  {pos && (
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {pos}
                    </p>
                  )}
                  <div className="flex flex-col gap-4">
                    {meanings.map((m, i) => (
                      <div key={i} className="border-l-2 border-gray-700 pl-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FreqBadge freq={m.freq} label={m.freqLabel} />
                        </div>
                        <p className="text-sm font-semibold text-gray-100 mb-0.5">
                          {m.definition}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">{m.translation}</p>
                        <p className="text-xs text-gray-600 italic">{m.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Rating buttons */}
            <div
              className="grid grid-cols-4 gap-2 px-7 pb-7 pt-4 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {RATINGS.map(({ label, quality, color }) => (
                <button
                  key={quality}
                  onClick={() => handleRate(quality)}
                  className={`py-2 text-xs font-medium border rounded-lg transition-colors ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-6 text-xs text-gray-700">
        1–4 оцінка
      </p>
    </div>
  );
}
