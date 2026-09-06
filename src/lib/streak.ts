function toDateKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function shiftDays(dateKey: string, delta: number) {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function countStreakEndingAt(dateKey: string, days: Set<string>) {
  let streak = 0;
  let cursor = dateKey;
  while (days.has(cursor)) {
    streak++;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

/**
 * Streak = number of consecutive calendar days (UTC) with at least one
 * completed lesson, counting a completion happening right now (today).
 */
export function computeStreakAfterCompletionToday(
  previousCompletionDates: string[],
): number {
  const days = new Set(previousCompletionDates.map(toDateKey));
  const todayKey = new Date().toISOString().slice(0, 10);
  days.add(todayKey);
  return countStreakEndingAt(todayKey, days);
}

/**
 * Current streak for display: still counts as alive if the last lesson was
 * completed today OR yesterday (the user still has today to keep it going).
 */
export function computeCurrentStreak(completionDates: string[]): number {
  const days = new Set(completionDates.map(toDateKey));
  const todayKey = new Date().toISOString().slice(0, 10);

  if (days.has(todayKey)) return countStreakEndingAt(todayKey, days);

  const yesterdayKey = shiftDays(todayKey, -1);
  if (days.has(yesterdayKey)) return countStreakEndingAt(yesterdayKey, days);

  return 0;
}
