import type { WordCategory } from "@/lib/types";

const LABELS: Record<WordCategory, string> = {
  general: "загальне",
  business: "бізнес",
  academic: "академічне",
  "phrasal verbs": "фразові дієслова",
  idioms: "ідіоми",
  slang: "сленг",
  tech: "тех",
};

const COLORS: Record<WordCategory, string> = {
  general: "bg-sky-900/60 text-sky-300",
  business: "bg-violet-900/60 text-violet-300",
  academic: "bg-teal-900/60 text-teal-300",
  "phrasal verbs": "bg-orange-900/60 text-orange-300",
  idioms: "bg-pink-900/60 text-pink-300",
  slang: "bg-lime-900/60 text-lime-300",
  tech: "bg-cyan-900/60 text-cyan-300",
};

interface Props {
  category: WordCategory;
}

export default function CategoryTag({ category }: Props) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${COLORS[category]}`}
    >
      {LABELS[category]}
    </span>
  );
}
