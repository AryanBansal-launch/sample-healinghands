/**
 * IANA zone for “what counts as today” and for hiding past times on the current day.
 * Set `BOOKING_CALENDAR_TIMEZONE` or `NEXT_PUBLIC_BOOKING_CALENDAR_TIMEZONE` to match the clinic.
 */
export const BOOKING_CALENDAR_TIMEZONE =
  process.env.NEXT_PUBLIC_BOOKING_CALENDAR_TIMEZONE ??
  process.env.BOOKING_CALENDAR_TIMEZONE ??
  "Asia/Kolkata";

/** Calendar YYYY-MM-DD in the clinic timezone. */
export function todayYyyyMmDdInBookingTZ(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_CALENDAR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Current clock (minutes since midnight) in the booking timezone. */
export function nowMinutesInBookingTZ(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_CALENDAR_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? NaN);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? NaN);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

export function isPastBookingCalendarDay(dateKey: string, now = new Date()): boolean {
  return dateKey < todayYyyyMmDdInBookingTZ(now);
}

export function isTodayBookingCalendarDay(dateKey: string, now = new Date()): boolean {
  return dateKey === todayYyyyMmDdInBookingTZ(now);
}

/** Parse `YYYY-MM-DD` to UTC midnight range for Mongo `preferredDate` queries. */
export function utcDayRangeFromYyyyMmDd(dateParam: string): { start: Date; end: Date } | null {
  const s = dateParam.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return {
    start: new Date(Date.UTC(y, m - 1, d)),
    end: new Date(Date.UTC(y, m - 1, d + 1)),
  };
}

export function preferredDateToYyyyMmDd(v: unknown): string | null {
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  return null;
}
