import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import {
  buildBookingApprovalMessage,
  buildCustomerWhatsAppURL,
} from "@/lib/whatsapp";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BOOKING_STATUSES = ["pending", "approved", "rejected", "completed"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    await dbConnect();
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const prevStatus = booking.status;

    if ("status" in body && body.status !== undefined) {
      if (typeof body.status !== "string" || !BOOKING_STATUSES.includes(body.status as (typeof BOOKING_STATUSES)[number])) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      booking.status = body.status;
    }
    if ("adminNotes" in body && body.adminNotes !== undefined) {
      booking.adminNotes = typeof body.adminNotes === "string" ? body.adminNotes : String(body.adminNotes ?? "");
    }
    if ("whatsappSent" in body && body.whatsappSent !== undefined) {
      booking.whatsappSent = Boolean(body.whatsappSent);
    }

    await booking.save();

    const transitionedToApproved =
      prevStatus !== "approved" && booking.status === "approved";

    const customerWhatsAppUrl = transitionedToApproved
      ? buildCustomerWhatsAppURL(
          booking.phone,
          buildBookingApprovalMessage({
            fullName: booking.fullName,
            service: booking.service,
            preferredDate: format(new Date(booking.preferredDate), "PPP"),
            preferredTime: booking.preferredTime,
          })
        )
      : undefined;

    return NextResponse.json({
      booking: booking.toObject(),
      ...(customerWhatsAppUrl ? { customerWhatsAppUrl } : {}),
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
