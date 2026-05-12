"use client";

import { useState } from "react";
import type { TopicId, ExerciseData, GrammarProgress } from "@/lib/grammarTypes";
import { GRAMMAR_TOPICS } from "@/lib/grammarTypes";
import { loadGrammarProgress, saveGrammarProgress } from "@/lib/grammarStorage";
import { applyGrammarRating } from "@/lib/grammarSm2";
import { getSessionExercise } from "@/data/grammar";
import TopicPanel from "./components/TopicPanel";
import RuleCardView from "./components/RuleCardView";
import MultipleChoiceView from "./components/MultipleChoiceView";
import FillBlankView from "./components/FillBlankView";
import TransformationView from "./components/TransformationView";
import LevelCompleteView from "./components/LevelCompleteView";

type Phase = "idle" | "exercising" | "complete";

export default function GrammarPage() {
  const [progress, setProgress] = useState<GrammarProgress>(() => loadGrammarProgress());
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [completedQuality, setCompletedQuality] = useState(0);

  function selectLevel(topicId: TopicId, level: number) {
    setActiveTopic(topicId);
    setActiveLevel(level);
    setExercise(getSessionExercise(topicId, level));
    setPhase("exercising");
  }

  function handleComplete(quality: number) {
    if (activeTopic === null || activeLevel === null) return;

    const updatedLevel = applyGrammarRating(progress[activeTopic][activeLevel], quality);

    const nextLevelKey = activeLevel + 1;
    const shouldUnlockNext =
      nextLevelKey < 4 && !progress[activeTopic][nextLevelKey].unlocked;

    const newProgress: GrammarProgress = {
      ...progress,
      [activeTopic]: {
        ...progress[activeTopic],
        [activeLevel]: updatedLevel,
        ...(shouldUnlockNext
          ? { [nextLevelKey]: { ...progress[activeTopic][nextLevelKey], unlocked: true } }
          : {}),
      },
    };

    saveGrammarProgress(newProgress);
    setProgress(newProgress);
    setCompletedQuality(quality);
    setPhase("complete");
  }

  function goToNextLevel() {
    if (activeTopic === null || activeLevel === null || activeLevel >= 3) return;
    selectLevel(activeTopic, activeLevel + 1);
  }

  function goBackToTopics() {
    setPhase("idle");
    setActiveTopic(null);
    setActiveLevel(null);
    setExercise(null);
  }

  const topicMastered =
    activeTopic !== null && [0, 1, 2, 3].every((i) => progress[activeTopic][i].completed);

  const activeTopicTitle =
    activeTopic !== null
      ? (GRAMMAR_TOPICS.find((t) => t.id === activeTopic)?.title ?? "")
      : "";

  return (
    <div className="flex h-full">
      <TopicPanel
        progress={progress}
        activeTopic={activeTopic}
        activeLevel={activeLevel}
        onSelectLevel={selectLevel}
      />

      <div className="flex-1 overflow-y-auto px-8 py-8">
        {phase === "idle" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-4xl mb-4">📖</div>
            <h1 className="text-xl font-semibold text-gray-100 mb-2">Граматика</h1>
            <p className="text-sm text-gray-500 max-w-xs">
              Виберіть тему і рівень зліва, щоб розпочати. Кожна тема має 4 рівні з вправами.
            </p>
          </div>
        )}

        {phase === "exercising" && exercise !== null && (
          <>
            {exercise.type === "rule" && (
              <RuleCardView exercise={exercise} onComplete={handleComplete} />
            )}
            {exercise.type === "multiple-choice" && (
              <MultipleChoiceView exercise={exercise} onComplete={handleComplete} />
            )}
            {exercise.type === "fill-blank" && (
              <FillBlankView exercise={exercise} onComplete={handleComplete} />
            )}
            {exercise.type === "transformation" && (
              <TransformationView exercise={exercise} onComplete={handleComplete} />
            )}
          </>
        )}

        {phase === "complete" && activeTopic !== null && activeLevel !== null && (
          <LevelCompleteView
            topicTitle={activeTopicTitle}
            levelIndex={activeLevel}
            quality={completedQuality}
            nextReview={progress[activeTopic][activeLevel].nextReview}
            hasNextLevel={activeLevel < 3}
            topicMastered={topicMastered}
            onNextLevel={goToNextLevel}
            onBackToTopics={goBackToTopics}
          />
        )}
      </div>
    </div>
  );
}
