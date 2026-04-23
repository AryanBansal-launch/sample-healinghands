import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { bookingSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = bookingSchema.parse(body);

    await dbConnect();
    const booking = new Booking(validatedData);
    await booking.save();

    return NextResponse.json({ message: "Booking request submitted successfully" }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
