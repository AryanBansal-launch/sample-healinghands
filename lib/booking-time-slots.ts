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

/** Split stored site-settings value into lines (no fallback to defaults — empty means empty). */
export function splitBookingTimeSlotLines(raw: string | undefined | null): string[] {
  if (raw == null || !String(raw).trim()) return [];
  return String(raw)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Join lines for SiteSettings `bookingTimeSlots` storage. */
export function joinBookingTimeSlotLines(lines: string[]): string {
  return lines.map((l) => l.trim()).filter(Boolean).join("\n");
}

/** Inverse of `parseBookingSlotToMinutesSinceMidnight` for admin time pickers. */
export function minutesSinceMidnightToSlotLabel(total: number): string {
  const t = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h24 = Math.floor(t / 60);
  const min = t % 60;
  const isPm = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const ap = isPm ? "PM" : "AM";
  return `${h12}:${String(min).padStart(2, "0")} ${ap}`;
}

/** `HH:mm` for `<input type="time" />` from a stored slot label. */
export function slotLabelToTimeInputValue(label: string): string {
  const mins = parseBookingSlotToMinutesSinceMidnight(label);
  if (mins === null) return "";
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** From `<input type="time" />` value (`HH:mm`, 24h) to stored label like `9:00 AM`. */
export function timeInputValueToSlotLabel(iso: string): string | null {
  const parts = iso.trim().split(":");
  if (parts.length < 2) return null;
  let h = Number(parts[0]);
  const min = Number(parts[1]);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
  const h24 = ((Math.floor(h) % 24) + 24) % 24;
  const m = Math.min(59, Math.max(0, Math.floor(min)));
  return minutesSinceMidnightToSlotLabel(h24 * 60 + m);
}

export const BOOKING_SLOTS_SETTING_DEFAULTS: Record<string, string> = {
  bookingTimeSlots: DEFAULT_BOOKING_TIME_SLOTS_TEXT,
};
