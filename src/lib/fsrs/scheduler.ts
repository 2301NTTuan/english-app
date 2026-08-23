import { fsrs, Rating as FsrsRating, State as FsrsState, type CardInput, type Grade } from "ts-fsrs";
import type { Rating, ReviewState } from "@/types/domain";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const stateToFsrs: Record<ReviewState["state"], FsrsState> = { new: FsrsState.New, learning: FsrsState.Learning, review: FsrsState.Review, relearning: FsrsState.Relearning };
const stateFromFsrs: Record<FsrsState, ReviewState["state"]> = { [FsrsState.New]: "new", [FsrsState.Learning]: "learning", [FsrsState.Review]: "review", [FsrsState.Relearning]: "relearning" };
const ratingToFsrs: Record<Rating, Grade> = { again: FsrsRating.Again, hard: FsrsRating.Hard, good: FsrsRating.Good, easy: FsrsRating.Easy };

/** Stable application adapter around the maintained ts-fsrs implementation (FSRS v6). */
export interface ReviewScheduler { schedule(current: ReviewState, rating: Rating, reviewedAt?: Date, desiredRetention?: number): ReviewState }

export function scheduleReview(current: ReviewState, rating: Rating, reviewedAt = new Date(), desiredRetention = 0.9): ReviewState {
  const failed = rating === "again";
  const isNew = current.state === "new" && current.reviewCount === 0;
  const card: CardInput = {
    due: current.nextReview,
    stability: isNew ? 0 : clamp(current.stability, 0.1, 36_500),
    difficulty: isNew ? 0 : clamp(current.difficulty, 1, 10),
    elapsed_days: current.elapsedDays,
    scheduled_days: current.scheduledDays,
    learning_steps: 0,
    reps: current.reviewCount,
    lapses: current.lapses,
    state: stateToFsrs[current.state],
    last_review: current.lastReview,
  };
  const result = fsrs({ request_retention: clamp(desiredRetention, 0.8, 0.97), maximum_interval: 36_500, enable_fuzz: false }).next(card, reviewedAt, ratingToFsrs[rating]).card;
  return {
    ...current, difficulty: result.difficulty, stability: result.stability, state: stateFromFsrs[result.state], lastReview: result.last_review?.toISOString() ?? reviewedAt.toISOString(),
    nextReview: result.due.toISOString(), scheduledDays: result.scheduled_days, elapsedDays: result.elapsed_days,
    reviewCount: result.reps,
    correctCount: current.correctCount + (failed ? 0 : 1), incorrectCount: current.incorrectCount + (failed ? 1 : 0), lapses: current.lapses + (failed ? 1 : 0),
  };
}

export const fsrsScheduler: ReviewScheduler = { schedule: scheduleReview };
