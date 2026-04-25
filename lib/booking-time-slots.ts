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

export const BOOKING_SLOTS_SETTING_DEFAULTS: Record<string, string> = {
  bookingTimeSlots: DEFAULT_BOOKING_TIME_SLOTS_TEXT,
};
