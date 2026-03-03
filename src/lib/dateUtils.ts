/** Returns today's date as YYYY-MM-DD in local time */
export function getTodayDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

/** Returns yesterday's date as YYYY-MM-DD in local time */
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString("en-CA");
}

/** Returns the absolute number of days between two YYYY-MM-DD strings */
export function daysBetween(dateA: string, dateB: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round(Math.abs(b - a) / msPerDay);
}

/** Returns the day-of-week as 0=Sun … 6=Sat */
export function getDayOfWeek(): number {
  return new Date().getDay();
}

export const isFriday = () => getDayOfWeek() === 5;
export const isSaturday = () => getDayOfWeek() === 6;
export const isSunday = () => getDayOfWeek() === 0;

/** Returns the current hour (0–23) in local time */
export function getCurrentHour(): number {
  return new Date().getHours();
}

/** Formats a YYYY-MM-DD date string to a readable label like "Mar 3" */
export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Returns the last N calendar dates as YYYY-MM-DD strings (newest last) */
export function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("en-CA"));
  }
  return dates;
}
