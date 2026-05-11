"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Word, WordCategory, Meaning } from "@/lib/types";
import CategoryTag from "@/components/CategoryTag";
import FreqBadge from "@/components/FreqBadge";
import { addCustomWords } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

type WordToken = {
  type: "word";
  text: string;
  wordIndex: number;
  lower: string;
};
type NonWordToken = { type: "nonword"; text: string };
type Token = WordToken | NonWordToken;

type SelectedPhrase = { phrase: string; indices: number[] };

type EnrichedWordData = {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  category: WordCategory;
  meanings: Meaning[];
};

// ─── Phrase detection lists ───────────────────────────────────────────────────

const PHRASAL_VERBS = new Set([
  "back up", "break down", "break through", "bring in", "bring on",
  "bring up", "call back", "call off", "carry on", "catch up",
  "check in", "check out", "come up", "cut off", "drill down",
  "end up", "fall behind", "figure out", "fill in", "find out",
  "follow up", "get back", "give up", "go ahead", "go over",
  "hand over", "hang on", "head up", "hold on", "keep up",
  "kick off", "lay out", "level up", "log in", "log out",
  "look into", "look up", "move forward", "move on", "opt out",
  "pick up", "point out", "pull off", "push back", "reach out",
  "roll out", "run through", "set up", "show up", "sign in",
  "sign off", "sign up", "sort out", "speak up", "stand out",
  "step up", "sum up", "take on", "take over", "talk through",
  "tie in", "turn around", "work out", "wrap up", "write up",
  "zoom in", "zoom out",
]);

const THREE_WORD_PHRASES = new Set([
  "catch up on", "come up with", "follow up on", "get in touch",
  "keep in mind", "keep track of", "keep up with", "look forward to",
  "on top of", "take care of", "touch base with", "up to date",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const wordRegex = /[a-zA-Z]+(?:[''-][a-zA-Z]+)*/g;
  let lastIndex = 0;
  let wordIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = wordRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "nonword", text: text.slice(lastIndex, match.index) });
    }
    tokens.push({
      type: "word",
      text: match[0],
      lower: match[0].toLowerCase(),
      wordIndex: wordIndex++,
    });
    lastIndex = wordRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "nonword", text: text.slice(lastIndex) });
  }

  return tokens;
}

function detectPhrase(
  wordIndex: number,
  wt: WordToken[]
): SelectedPhrase {
  const i = wordIndex;
  const w = wt;

  // Check 3-word phrases — all windows that include position i
  const windows3: [number, number, number][] = [];
  if (i >= 2) windows3.push([i - 2, i - 1, i]);
  if (i >= 1 && i + 1 < w.length) windows3.push([i - 1, i, i + 1]);
  if (i + 2 < w.length) windows3.push([i, i + 1, i + 2]);

  for (const [a, b, c] of windows3) {
    const phrase = `${w[a].lower} ${w[b].lower} ${w[c].lower}`;
    if (THREE_WORD_PHRASES.has(phrase)) {
      return {
        phrase: `${w[a].text} ${w[b].text} ${w[c].text}`,
        indices: [a, b, c],
      };
    }
  }

  // Check 2-word phrases
  if (i + 1 < w.length) {
    const phrase = `${w[i].lower} ${w[i + 1].lower}`;
    if (PHRASAL_VERBS.has(phrase)) {
      return { phrase: `${w[i].text} ${w[i + 1].text}`, indices: [i, i + 1] };
    }
  }
  if (i >= 1) {
    const phrase = `${w[i - 1].lower} ${w[i].lower}`;
    if (PHRASAL_VERBS.has(phrase)) {
      return { phrase: `${w[i - 1].text} ${w[i].text}`, indices: [i - 1, i] };
    }
  }

  return { phrase: w[i].text, indices: [i] };
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Текст", "Вибір слів", "Аналіз", "Перегляд"];
  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((label, idx) => {
        const n = idx + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={[
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  done
                    ? "bg-green-900 text-green-300"
                    : active
                      ? "bg-gray-100 text-gray-900"
                      : "bg-gray-800 text-gray-600",
                ].join(" ")}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-sm ${active ? "text-gray-100 font-medium" : "text-gray-600"}`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-px w-8 ${n < current ? "bg-gray-600" : "bg-gray-800"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function ImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1
  const [transcript, setTranscript] = useState("");

  // Step 2
  const [tokens, setTokens] = useState<Token[]>([]);
  const [wordTokens, setWordTokens] = useState<WordToken[]>([]);
  const [selectedPhrases, setSelectedPhrases] = useState<SelectedPhrase[]>([]);

  // Step 3 error (if enrichment fails we go back to step 2)
  const [enrichError, setEnrichError] = useState<string | null>(null);

  // Step 4
  const [enrichedWords, setEnrichedWords] = useState<EnrichedWordData[]>([]);

  const highlightedIndices = useMemo(
    () => new Set(selectedPhrases.flatMap((p) => p.indices)),
    [selectedPhrases]
  );

  // ── Handlers ──

  function handleAnalyze() {
    if (!transcript.trim()) return;
    const parsed = tokenize(transcript);
    const words = parsed.filter((t): t is WordToken => t.type === "word");
    setTokens(parsed);
    setWordTokens(words);
    setSelectedPhrases([]);
    setEnrichError(null);
    setStep(2);
  }

  function handleWordClick(wordIndex: number) {
    const existingIdx = selectedPhrases.findIndex((p) =>
      p.indices.includes(wordIndex)
    );
    if (existingIdx !== -1) {
      setSelectedPhrases((prev) => prev.filter((_, i) => i !== existingIdx));
      return;
    }
    const detected = detectPhrase(wordIndex, wordTokens);
    setSelectedPhrases((prev) => [...prev, detected]);
  }

  function handleRemovePhrase(idx: number) {
    setSelectedPhrases((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleEnrich() {
    if (selectedPhrases.length === 0) return;
    setEnrichError(null);
    setStep(3);

    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: selectedPhrases.map((p) => p.phrase) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      setEnrichedWords((data as { words: EnrichedWordData[] }).words);
      setStep(4);
    } catch (err) {
      setEnrichError(err instanceof Error ? err.message : "Невідома помилка");
      setStep(2);
    }
  }

  function handleRemoveWord(index: number) {
    setEnrichedWords((prev) => prev.filter((_, i) => i !== index));
  }

  function handleConfirmSave() {
    if (enrichedWords.length === 0) return;
    const now = Date.now();
    const base36 = now.toString(36);
    const wordsToSave: Word[] = enrichedWords.map((w) => ({
      ...w,
      id: `import-${w.word.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${base36}`,
      status: "new" as const,
      interval: 0,
      ef: 2.5,
      due: now,
      repetitions: 0,
      lastReview: null,
    }));
    addCustomWords(wordsToSave);
    router.push("/dictionary");
  }

  // ── Render ──

  return (
    <div className="px-8 py-8 max-w-6xl">
      <h1 className="text-xl font-semibold text-gray-100 mb-6">
        Імпорт зі дзвінка
      </h1>

      <StepIndicator current={step} />

      {/* ── Step 1: Transcript input ── */}
      {step === 1 && (
        <div className="max-w-2xl">
          <p className="text-sm text-gray-500 mb-4">
            Вставте транскрипт дзвінка. Потім ви зможете вибрати слова та фрази для додавання до словника.
          </p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your call transcript here…"
            rows={14}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-gray-500 resize-none font-mono leading-relaxed"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!transcript.trim()}
              className="px-5 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Аналізувати →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Word selection ── */}
      {step === 2 && (
        <div className="flex gap-6 items-start">
          {/* Transcript */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 mb-3">
              Натисніть на слово або фразу щоб вибрати. Фразові дієслова визначаються автоматично.
            </p>
            {enrichError && (
              <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-400">
                Помилка: {enrichError}
              </div>
            )}
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-5 leading-8 text-sm text-gray-300 select-none">
              {tokens.map((token, i) => {
                if (token.type === "nonword") {
                  return <span key={i}>{token.text}</span>;
                }
                const highlighted = highlightedIndices.has(token.wordIndex);
                return (
                  <span
                    key={i}
                    onClick={() => handleWordClick(token.wordIndex)}
                    className={[
                      "cursor-pointer rounded-sm transition-colors",
                      highlighted
                        ? "bg-blue-500/25 text-blue-200 ring-1 ring-blue-500/40 ring-inset"
                        : "hover:bg-gray-700/70 hover:text-gray-100",
                    ].join(" ")}
                  >
                    {token.text}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Selected phrases sidebar */}
          <div className="w-64 shrink-0 sticky top-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-300">
                  Вибрані
                </span>
                {selectedPhrases.length > 0 && (
                  <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    {selectedPhrases.length}
                  </span>
                )}
              </div>

              <div className="min-h-32 max-h-96 overflow-y-auto">
                {selectedPhrases.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-8 px-4">
                    Натисніть на слово в тексті
                  </p>
                ) : (
                  <ul className="py-1">
                    {selectedPhrases.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-800 group"
                      >
                        <span className="text-sm text-gray-200 font-medium truncate">
                          {p.phrase}
                        </span>
                        <button
                          onClick={() => handleRemovePhrase(i)}
                          className="text-gray-700 hover:text-red-400 transition-colors ml-2 shrink-0 text-xs"
                          aria-label="Видалити"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-800 flex flex-col gap-2">
                <button
                  onClick={handleEnrich}
                  disabled={selectedPhrases.length === 0}
                  className="w-full py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Додати до словника
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  ← Змінити текст
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Loading ── */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-gray-300 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">
            Збагачення слів за допомогою Claude…
          </p>
          <p className="text-xs text-gray-700">
            Обробляємо {selectedPhrases.length}{" "}
            {selectedPhrases.length === 1 ? "слово" : "слів"}
          </p>
        </div>
      )}

      {/* ── Step 4: Review before saving ── */}
      {step === 4 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Перевірте слова перед збереженням. Видаліть ті, що не потрібні.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                ← Назад
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={enrichedWords.length === 0}
                className="px-5 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Зберегти {enrichedWords.length}{" "}
                {enrichedWords.length === 1 ? "слово" : "слів"} →
              </button>
            </div>
          </div>

          {enrichedWords.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-600">
              Всі слова видалені. Поверніться назад щоб обрати нові.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {enrichedWords.map((word, i) => (
                <WordCard
                  key={i}
                  word={word}
                  onRemove={() => handleRemoveWord(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Word review card ─────────────────────────────────────────────────────────

function WordCard({
  word,
  onRemove,
}: {
  word: EnrichedWordData;
  onRemove: () => void;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-100">{word.word}</h3>
          <p className="text-sm text-gray-500 font-mono mt-0.5">
            {word.phonetic}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <CategoryTag category={word.category} />
            <span className="text-xs text-gray-600">{word.partOfSpeech}</span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 text-gray-700 hover:text-red-400 transition-colors text-sm leading-none mt-0.5"
          aria-label="Видалити"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {word.meanings.map((m, j) => (
          <div key={j} className="border-l-2 border-gray-700 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <FreqBadge freq={m.freq} label={m.freqLabel} />
            </div>
            <p className="text-sm font-medium text-gray-100">{m.definition}</p>
            <p className="text-sm text-gray-400">{m.translation}</p>
            <p className="text-xs text-gray-600 italic mt-0.5">{m.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
