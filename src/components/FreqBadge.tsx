import type { MeaningFreq } from "@/lib/types";

const COLORS: Record<MeaningFreq, string> = {
  primary: "bg-blue-900/60 text-blue-300",
  secondary: "bg-amber-900/60 text-amber-300",
  rare: "bg-gray-800 text-gray-400",
};

interface Props {
  freq: MeaningFreq;
  label: string;
}

export default function FreqBadge({ freq, label }: Props) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${COLORS[freq]}`}
    >
      {label}
    </span>
  );
}
