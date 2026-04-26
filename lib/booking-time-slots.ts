/** Default slots when Site Settings `bookingTimeSlots` is missing or empty. */
export const DEFAULT_BOOKING_TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
] as const;

export const DEFAULT_BOOKING_TIME_SLOTS_TEXT = DEFAULT_BOOKING_TIME_SLOTS.join("\n");

/** Stored in SiteSettings: one time label per line (e.g. `9:00 AM`). */
export function parseBookingTimeSlotsRaw(raw: string | undefined | null): string[] {
  if (raw == null || !String(raw).trim()) {
    return [...DEFAULT_BOOKING_TIME_SLOTS];
  }
  const lines = String(raw)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : [...DEFAULT_BOOKING_TIME_SLOTS];
}

export function isAllowedBookingTime(
  preferredTime: string,
  allowedSlots: string[]
): boolean {
  const t = preferredTime.trim();
  return allowedSlots.some((s) => s.trim() === t);
}

/** Parses labels like `9:00 AM` / `12:30 PM` (site settings format). */
export function parseBookingSlotToMinutesSinceMidnight(label: string): number | null {
  const s = label.trim();
  const m = /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i.exec(s);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3].toUpperCase();
  if (!Number.isFinite(h) || !Number.isFinite(min) || h < 1 || h > 12 || min < 0 || min > 59) {
    return null;
  }
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

export const BOOKING_SLOTS_SETTING_DEFAULTS: Record<string, string> = {
  bookingTimeSlots: DEFAULT_BOOKING_TIME_SLOTS_TEXT,
};
