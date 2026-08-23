import type { MistakeRecord } from "@/types/domain";

/** Recurrence dominates priority; recent mistakes break ties. */
export function prioritizeMistakes(mistakes: MistakeRecord[]): MistakeRecord[] {
  return mistakes.filter((item) => !item.resolved).sort((a, b) => b.repeatedCount - a.repeatedCount || new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
