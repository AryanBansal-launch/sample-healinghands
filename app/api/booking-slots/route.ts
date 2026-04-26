import { filterSlotsForSelectableCalendarDay } from "@/lib/booking-datetime-policy";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import {
  BOOKING_SLOTS_SETTING_DEFAULTS,
  parseBookingTimeSlotsRaw,
} from "@/lib/booking-time-slots";
import { utcDayRangeFromYyyyMmDd } from "@/lib/booking-date";
import SiteSettings from "@/models/SiteSettings";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOCKING_STATUSES = ["pending", "approved"] as const;

/** Public: master slots from Site Settings; optional `?date=YYYY-MM-DD` removes taken times for that day. */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const row = await SiteSettings.findOne({ key: "bookingTimeSlots" }).lean();
    const raw =
      (row?.value as string | undefined) ?? BOOKING_SLOTS_SETTING_DEFAULTS.bookingTimeSlots;
    let slots = parseBookingTimeSlotsRaw(raw);

    const dateParam = req.nextUrl.searchParams.get("date")?.trim() ?? "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      slots = filterSlotsForSelectableCalendarDay(dateParam, slots);
    }
    const range = dateParam ? utcDayRangeFromYyyyMmDd(dateParam) : null;
    if (range) {
      const taken = await Booking.find({
        preferredDate: { $gte: range.start, $lt: range.end },
        status: { $in: [...BLOCKING_STATUSES] },
      })
        .select("preferredTime")
        .lean();
      const takenSet = new Set(
        taken.map((b) => String((b as { preferredTime?: string }).preferredTime ?? "").trim())
      );
      slots = slots.filter((s) => !takenSet.has(s.trim()));
    }

    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "Failed to load time slots" }, { status: 500 });
  }
}
