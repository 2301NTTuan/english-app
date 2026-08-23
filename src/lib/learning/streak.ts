import type { Activity } from "@/types/domain";

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const previousDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);

export function calculateStreak(activities: Activity[], now = new Date()): number {
  const activeDays = new Set(activities.map((activity) => dayKey(new Date(activity.date))));
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!activeDays.has(dayKey(cursor))) cursor = previousDay(cursor);
  let streak = 0;
  while (activeDays.has(dayKey(cursor))) { streak += 1; cursor = previousDay(cursor); }
  return streak;
}
