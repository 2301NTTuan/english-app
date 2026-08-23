import type { MasteryDimensions } from "@/types/domain";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function calculateOverallMastery(input: Omit<MasteryDimensions, "overall">): number {
  return clamp(input.recognition * 0.25 + input.recall * 0.3 + input.context * 0.3 + input.spelling * 0.15);
}

export function updateMastery(current: MasteryDimensions, dimension: keyof Omit<MasteryDimensions, "overall">, correct: boolean): MasteryDimensions {
  const change = correct
    ? Math.max(3, (100 - current[dimension]) * 0.14)
    : -Math.max(8, current[dimension] * 0.16);
  const next = { ...current, [dimension]: clamp(current[dimension] + change) };
  return { ...next, overall: calculateOverallMastery(next) };
}

export function weakestDimension(mastery: MasteryDimensions): keyof Omit<MasteryDimensions, "overall"> {
  const entries = Object.entries(mastery).filter(([key]) => key !== "overall") as [keyof Omit<MasteryDimensions, "overall">, number][];
  return entries.sort((a, b) => a[1] - b[1])[0][0];
}
