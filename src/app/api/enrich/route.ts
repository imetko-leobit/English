import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { WordCategory, MeaningFreq } from "@/lib/types";

const VALID_CATEGORIES: WordCategory[] = [
  "general",
  "business",
  "academic",
  "phrasal verbs",
  "idioms",
  "slang",
  "tech",
];

const VALID_FREQ: MeaningFreq[] = ["primary", "secondary", "rare"];

const FREQ_LABELS: Record<MeaningFreq, "основне" | "розмовне" | "рідко"> = {
  primary: "основне",
  secondary: "розмовне",
  rare: "рідко",
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured in .env.local" },
      { status: 500 }
    );
  }

  let words: string[];
  try {
    const body = await req.json();
    words = body.words;
    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "No words provided" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are helping build an English vocabulary database for a language learning app used by Ukrainian-speaking IT professionals.

Analyze these English words and phrases extracted from a work call transcript. Return a JSON array where each item has this exact structure:
{
  "word": "the word or phrase as given",
  "phonetic": "IPA pronunciation (e.g. /hɛdz ʌp/)",
  "partOfSpeech": "part of speech in Ukrainian (e.g. дієслово, іменник, прислівник, фразове дієслово, вигук, прикметник)",
  "category": "one of: general, business, academic, phrasal verbs, idioms, slang, tech",
  "meanings": [
    {
      "freq": "primary",
      "freqLabel": "основне",
      "definition": "concise English definition",
      "translation": "Ukrainian translation",
      "example": "realistic example sentence in a work/call context"
    }
  ]
}

Rules:
- Include 1-3 meanings per word, most common usage first
- freq values: "primary" (main meaning), "secondary" (additional meaning), "rare" (uncommon meaning)
- freqLabel: "основне" for primary, "розмовне" for secondary, "рідко" for rare
- category: use "phrasal verbs" for phrasal verbs, "idioms" for idiomatic expressions, "business" for business/meeting terms, "tech" for IT/software terms, "general" for common everyday words
- example sentences must be realistic work call / business contexts
- partOfSpeech must be in Ukrainian
- Return ONLY the raw JSON array with no markdown fences, no explanation

Words to enrich:
${words.map((w, i) => `${i + 1}. ${w}`).join("\n")}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse JSON from Claude response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as unknown[];

    const enriched = parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null
      )
      .map((item) => {
        const category = VALID_CATEGORIES.includes(item.category as WordCategory)
          ? (item.category as WordCategory)
          : "general";

        const meanings = Array.isArray(item.meanings)
          ? item.meanings
              .filter(
                (m): m is Record<string, unknown> =>
                  typeof m === "object" && m !== null
              )
              .map((m) => {
                const freq = VALID_FREQ.includes(m.freq as MeaningFreq)
                  ? (m.freq as MeaningFreq)
                  : "primary";
                return {
                  freq,
                  freqLabel: FREQ_LABELS[freq],
                  definition: String(m.definition ?? ""),
                  translation: String(m.translation ?? ""),
                  example: String(m.example ?? ""),
                };
              })
          : [];

        return {
          word: String(item.word ?? ""),
          phonetic: String(item.phonetic ?? ""),
          partOfSpeech: String(item.partOfSpeech ?? ""),
          category,
          meanings,
        };
      })
      .filter((w) => w.word && w.meanings.length > 0);

    return NextResponse.json({ words: enriched });
  } catch (err) {
    console.error("Enrich API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
