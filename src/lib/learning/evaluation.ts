import type { Rating } from "@/types/domain";

const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[“”‘’]/g, "'").replace(/[.!?]+$/g, "").replace(/\s+/g, " ");

/** Shared answer evaluator for choice-based and future typed-answer exercises. */
export function evaluateAnswer(userAnswer: string, correctAnswer: string): boolean {
  return normalize(userAnswer) === normalize(correctAnswer);
}

/** An incorrect response is always a scheduling failure, regardless of self-rating. */
export function ratingForAnswer(correct: boolean, rating: Rating): Rating {
  return correct ? rating : "again";
}
