import type { WordStatus } from "@/lib/types";

const COLORS: Record<WordStatus, string> = {
  new: "bg-gray-400",
  learning: "bg-amber-500",
  learned: "bg-green-500",
};

interface Props {
  status: WordStatus;
}

export default function StatusDot({ status }: Props) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${COLORS[status]}`}
    />
  );
}
