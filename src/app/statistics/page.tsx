"use client";

import { useState, useEffect, useMemo } from "react";
import type { Word, WordCategory, ReviewLogEntry } from "@/lib/types";
import { loadReviewLog, mergeWithStorage } from "@/lib/storage";
import { WORDS } from "@/data/words";

const CATEGORIES: WordCategory[] = [
  "general",
  "business",
  "academic",
  "tech",
  "phrasal verbs",
  "idioms",
  "slang",
];

const CATEGORY_LABELS: Record<WordCategory, string> = {
  general: "Загальне",
  business: "Бізнес",
  academic: "Академічне",
  tech: "Технології",
  "phrasal verbs": "Фразові дієслова",
  idioms: "Ідіоми",
  slang: "Сленг",
};

const DAY_NAMES = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function getDateString(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return DAY_NAMES[d.getDay()];
}

function computeStreak(
  log: { date: string; count: number }[],
  today: string
): number {
  const set = new Set(log.filter((e) => e.count > 0).map((e) => e.date));
  let streak = 0;
  let current = today;
  while (set.has(current)) {
    streak++;
    const d = new Date(current + "T12:00:00");
    d.setDate(d.getDate() - 1);
    current = d.toISOString().slice(0, 10);
  }
  return streak;
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="border border-gray-800 rounded-xl p-5 bg-gray-900">
      <p className={`text-3xl font-bold ${accent ?? "text-gray-100"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function StatisticsPage() {
  const [words, setWords] = useState<Word[]>(() => mergeWithStorage(WORDS));
  const [reviewLog, setReviewLog] = useState<ReviewLogEntry[]>(() => loadReviewLog());

  useEffect(() => {
    setWords(mergeWithStorage(WORDS));
    setReviewLog(loadReviewLog());
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const totalNew = words.filter((w) => w.status === "new").length;
  const totalLearning = words.filter((w) => w.status === "learning").length;
  const totalLearned = words.filter((w) => w.status === "learned").length;

  const todayReviewed =
    reviewLog.find((e) => e.date === today)?.count ?? 0;
  const now = Date.now();
  const remaining = words.filter(
    (w) => w.status === "new" || w.due <= now
  ).length;

  const streak = computeStreak(reviewLog, today);

  const categoryStats = useMemo(
    () =>
      CATEGORIES.map((cat) => {
        const total = words.filter((w) => w.category === cat).length;
        const learned = words.filter(
          (w) => w.category === cat && w.status === "learned"
        ).length;
        return { cat, total, learned };
      }),
    [words]
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dateStr = getDateString(6 - i);
      const entry = reviewLog.find((e) => e.date === dateStr);
      return { dateStr, count: entry?.count ?? 0, label: getDayName(dateStr) };
    });
  }, [reviewLog]);

  const maxCount = Math.max(...weekDays.map((d) => d.count), 1);

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-xl font-semibold text-gray-100 mb-6">Статистика</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Всього слів" value={words.length} />
        <MetricCard label="Нові" value={totalNew} accent="text-gray-500" />
        <MetricCard
          label="Вивчаються"
          value={totalLearning}
          accent="text-amber-400"
        />
        <MetricCard
          label="Вивчені"
          value={totalLearned}
          accent="text-green-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-800 rounded-xl p-5 bg-gray-900">
          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
            Сьогодні
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {todayReviewed}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">переглянуто</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div>
              <p className="text-2xl font-bold text-gray-100">{remaining}</p>
              <p className="text-xs text-gray-600 mt-0.5">залишилось</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-800 rounded-xl p-5 bg-gray-900">
          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
            Серія
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-100">{streak}</p>
            <p className="text-xs text-gray-600">
              {streak === 1 ? "день поспіль" : "днів поспіль"}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-800 rounded-xl p-5 bg-gray-900 mb-8">
        <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
          По категоріях
        </p>
        <div className="flex flex-col gap-3">
          {categoryStats.map(({ cat, total, learned }) => {
            const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{CATEGORY_LABELS[cat]}</span>
                  <span className="text-gray-600 text-xs">
                    {learned} / {total}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-gray-800 rounded-xl p-5 bg-gray-900">
        <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
          Активність за тиждень
        </p>
        <div className="flex items-end gap-3 h-28">
          {weekDays.map(({ dateStr, count, label }) => {
            const heightPct = Math.round((count / maxCount) * 100);
            const isToday = dateStr === today;
            return (
              <div
                key={dateStr}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <span className="text-xs text-gray-600">{count > 0 ? count : ""}</span>
                <div className="w-full flex items-end" style={{ height: 64 }}>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${isToday ? "bg-gray-100" : "bg-gray-700"}`}
                    style={{
                      height: count > 0 ? `${heightPct}%` : "4px",
                    }}
                  />
                </div>
                <span
                  className={`text-xs ${isToday ? "text-gray-100 font-semibold" : "text-gray-600"}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
