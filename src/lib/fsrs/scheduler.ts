import type { Rating, ReviewState } from "@/types/domain";

const DAY = 86_400_000;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** FSRS-inspired scheduling kept behind a stable adapter so a full FSRS implementation can replace it later. */
export function scheduleReview(current: ReviewState, rating: Rating, reviewedAt = new Date(), desiredRetention = 0.9): ReviewState {
  const failed = rating === "again";
  const elapsedDays = current.lastReview ? Math.max(0, (reviewedAt.getTime() - new Date(current.lastReview).getTime()) / DAY) : 0;
  const retrievability = Math.pow(1 + elapsedDays / Math.max(0.9, 9 * current.stability), -1);
  const difficultyDelta: Record<Rating, number> = { again: 0.9, hard: 0.3, good: -0.15, easy: -0.45 };
  const difficulty = clamp(current.difficulty + difficultyDelta[rating], 1, 10);
  const growth: Record<Rating, number> = { again: 0.35, hard: 1.15, good: 1.75, easy: 2.45 };
  const recallBonus = failed ? 1 : 1 + (1 - retrievability) * (11 - difficulty) / 5;
  const stability = clamp(current.stability * growth[rating] * recallBonus, 0.1, 36_500);
  const retention = clamp(desiredRetention, 0.8, 0.97);
  const targetInterval = 9 * stability * (1 / retention - 1);
  const ratingFloor: Record<Rating, number> = { again: 10 / 1_440, hard: 1, good: 2, easy: 4 };
  const intervalDays = failed ? ratingFloor.again : Math.max(ratingFloor[rating], Math.round(targetInterval));
  return {
    ...current, difficulty, stability, state: failed ? "relearning" : "review", lastReview: reviewedAt.toISOString(),
    nextReview: new Date(reviewedAt.getTime() + intervalDays * DAY).toISOString(), reviewCount: current.reviewCount + 1,
    correctCount: current.correctCount + (failed ? 0 : 1), incorrectCount: current.incorrectCount + (failed ? 1 : 0), lapses: current.lapses + (failed ? 1 : 0),
  };
}
