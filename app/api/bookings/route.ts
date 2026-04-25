import { preferredDateToYyyyMmDd, utcDayRangeFromYyyyMmDd } from "@/lib/booking-date";
import {
  BOOKING_SLOTS_SETTING_DEFAULTS,
  isAllowedBookingTime,
  parseBookingTimeSlotsRaw,
} from "@/lib/booking-time-slots";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import SiteSettings from "@/models/SiteSettings";
import { bookingSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

const BLOCKING_STATUSES = ["pending", "approved"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = bookingSchema.parse(body);

    await dbConnect();
    const slotRow = await SiteSettings.findOne({ key: "bookingTimeSlots" }).lean();
    const raw =
      (slotRow?.value as string | undefined) ?? BOOKING_SLOTS_SETTING_DEFAULTS.bookingTimeSlots;
    const allowedSlots = parseBookingTimeSlotsRaw(raw);
    const timeTrimmed = String(validatedData.preferredTime).trim();
    if (!isAllowedBookingTime(timeTrimmed, allowedSlots)) {
      return NextResponse.json(
        { error: "Selected time is not an available slot. Please choose a listed time." },
        { status: 400 }
      );
    }

    const dateKey = preferredDateToYyyyMmDd(validatedData.preferredDate);
    const range = dateKey ? utcDayRangeFromYyyyMmDd(dateKey) : null;
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
      if (takenSet.has(timeTrimmed)) {
        return NextResponse.json(
          {
            error:
              "That time is no longer available on this date. Please pick another slot or date.",
          },
          { status: 409 }
        );
      }
    }

    const booking = new Booking({
      ...validatedData,
      preferredTime: timeTrimmed,
    });
    await booking.save();

    return NextResponse.json({ message: "Booking request submitted successfully" }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
