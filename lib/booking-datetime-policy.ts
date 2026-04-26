import {
  isPastBookingCalendarDay,
  isTodayBookingCalendarDay,
  nowMinutesInBookingTZ,
  preferredDateToYyyyMmDd,
} from "@/lib/booking-date";
import { parseBookingSlotToMinutesSinceMidnight } from "@/lib/booking-time-slots";

export type BookingTimingErrorCode = "BAD_DATE" | "PAST_TIME";

export type BookingTimingError = {
  code: BookingTimingErrorCode;
  message: string;
};

/** Client + server: reject past calendar days and same-day times that are already over. */
export function validateBookingCalendarAndTime(
  preferredDate: unknown,
  preferredTime: string
): BookingTimingError | null {
  const key = preferredDateToYyyyMmDd(preferredDate);
  if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) {
    return { code: "BAD_DATE", message: "Choose a valid date." };
  }
  if (isPastBookingCalendarDay(key)) {
    return { code: "BAD_DATE", message: "Please choose today or a future date." };
  }
  const timeTrimmed = String(preferredTime ?? "").trim();
  if (!timeTrimmed) return null;
  if (isTodayBookingCalendarDay(key)) {
    const sm = parseBookingSlotToMinutesSinceMidnight(timeTrimmed);
    if (sm !== null && sm <= nowMinutesInBookingTZ()) {
      return {
        code: "PAST_TIME",
        message: "That time has already passed today. Pick a later slot.",
      };
    }
  }
  return null;
}

/** After master list + taken-slot filter: hide past times when the selected day is “today”. */
export function filterSlotsForSelectableCalendarDay(dateKey: string, slots: string[]): string[] {
  if (isPastBookingCalendarDay(dateKey)) return [];
  if (!isTodayBookingCalendarDay(dateKey)) return slots;
  const nowM = nowMinutesInBookingTZ();
  return slots.filter((slot) => {
    const sm = parseBookingSlotToMinutesSinceMidnight(slot);
    if (sm === null) return true;
    return sm > nowM;
  });
}
