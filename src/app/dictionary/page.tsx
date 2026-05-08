"use client";

import { useState, useMemo } from "react";
import type { Word, WordStatus, WordCategory } from "@/lib/types";
import { useWords } from "@/hooks/useWords";
import CategoryTag from "@/components/CategoryTag";
import FreqBadge from "@/components/FreqBadge";
import StatusDot from "@/components/StatusDot";

const STATUS_TABS: { value: "all" | WordStatus; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "new", label: "Нові" },
  { value: "learning", label: "Вивчаються" },
  { value: "learned", label: "Вивчені" },
];

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

const STATUS_LABELS: Record<WordStatus, string> = {
  new: "новий",
  learning: "вивчається",
  learned: "вивчений",
};

function formatDate(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PrimaryTranslation({ word }: { word: Word }) {
  const primary = word.meanings.find((m) => m.freq === "primary");
  return (
    <span className="text-gray-400 text-sm">
      {primary ? primary.translation : word.meanings[0]?.translation ?? "—"}
    </span>
  );
}

function ExpandedWord({ word }: { word: Word }) {
  return (
    <div className="px-5 py-5 border-t border-gray-800 bg-gray-800/50">
      <div className="flex flex-col gap-4 max-w-3xl">
        <div className="flex flex-col gap-3">
          {word.meanings.map((m, i) => (
            <div key={i} className="border-l-2 border-gray-700 pl-4">
              <div className="flex items-center gap-2 mb-1">
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

        <div className="flex gap-6 pt-3 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-600">Інтервал</p>
            <p className="text-sm font-medium text-gray-300">
              {word.interval} {word.interval === 1 ? "день" : "днів"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">EF</p>
            <p className="text-sm font-medium text-gray-300">
              {word.ef.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Повторень</p>
            <p className="text-sm font-medium text-gray-300">
              {word.repetitions}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Наступне повторення</p>
            <p className="text-sm font-medium text-gray-300">
              {formatDate(word.due)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Останнє повторення</p>
            <p className="text-sm font-medium text-gray-300">
              {formatDate(word.lastReview)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DictionaryPage() {
  const { words } = useWords();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WordStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | WordCategory>(
    "all"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return words.filter((w) => {
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (categoryFilter !== "all" && w.category !== categoryFilter)
        return false;
      if (
        search.trim() &&
        !w.word.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [words, statusFilter, categoryFilter, search]);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <h1 className="text-xl font-semibold text-gray-100 mb-6">Словник</h1>

      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Пошук слова..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-gray-500 bg-gray-800 w-52"
        />

        <div className="flex border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={[
                "px-3 py-2 text-sm font-medium transition-colors",
                statusFilter === value
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:bg-gray-700 hover:text-gray-100",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as "all" | WordCategory)
          }
          className="border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-gray-500 bg-gray-800"
        >
          <option value="all">Всі категорії</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>

        <span className="text-xs text-gray-600 ml-auto">
          {filtered.length} слів
        </span>
      </div>

      <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-600">
            Нічого не знайдено
          </div>
        ) : (
          filtered.map((word, idx) => (
            <div key={word.id}>
              {idx > 0 && <div className="h-px bg-gray-800 mx-5" />}

              <button
                onClick={() =>
                  setExpandedId(expandedId === word.id ? null : word.id)
                }
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-800 transition-colors text-left"
              >
                <StatusDot status={word.status} />
                <span className="w-44 font-medium text-gray-100 text-sm shrink-0">
                  {word.word}
                </span>
                <PrimaryTranslation word={word} />
                <div className="ml-auto flex items-center gap-4">
                  <CategoryTag category={word.category} />
                  <span className="text-xs text-gray-600 w-32 text-right shrink-0">
                    {formatDate(word.due)}
                  </span>
                  <span
                    className={`text-gray-600 text-xs transition-transform duration-200 ${expandedId === word.id ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </div>
              </button>

              {expandedId === word.id && <ExpandedWord word={word} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
