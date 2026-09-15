// Streaks are day-based and the product is French-only, so days are counted
// in Europe/Paris local time rather than UTC — otherwise a lesson finished
// late evening in France could get counted on the wrong calendar day.
const TIMEZONE = "Europe/Paris";
const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE });

function toDateKey(iso: string) {
  return dateKeyFormatter.format(new Date(iso));
}

function todayKey() {
  return dateKeyFormatter.format(new Date());
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
 * Streak = number of consecutive calendar days (Europe/Paris) with at least
 * one completed lesson, counting a completion happening right now (today).
 */
export function computeStreakAfterCompletionToday(
  previousCompletionDates: string[],
): number {
  const days = new Set(previousCompletionDates.map(toDateKey));
  const today = todayKey();
  days.add(today);
  return countStreakEndingAt(today, days);
}

/**
 * Current streak for display: still counts as alive if the last lesson was
 * completed today OR yesterday (the user still has today to keep it going).
 */
export function computeCurrentStreak(completionDates: string[]): number {
  const days = new Set(completionDates.map(toDateKey));
  const today = todayKey();

  if (days.has(today)) return countStreakEndingAt(today, days);

  const yesterday = shiftDays(today, -1);
  if (days.has(yesterday)) return countStreakEndingAt(yesterday, days);

  return 0;
}
