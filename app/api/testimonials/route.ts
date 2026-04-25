import dbConnect from "@/lib/mongodb";
import { testimonialPublicSubmitSchema } from "@/lib/validators";
import Testimonial from "@/models/Testimonial";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = testimonialPublicSubmitSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid submission";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { clientName, quote, tagline, rating, email } = parsed.data;
    await dbConnect();
    const maxOrder = await Testimonial.findOne()
      .sort({ order: -1 })
      .select("order")
      .lean();
    const nextOrder = typeof maxOrder?.order === "number" ? maxOrder.order + 1 : 0;
    await Testimonial.create({
      clientName,
      quote,
      tagline,
      rating: rating ?? 5,
      isActive: false,
      order: nextOrder,
      source: "customer",
      submitterEmail: email?.trim() || "",
    });
    return NextResponse.json(
      {
        message:
          "Thank you for sharing your experience. It will be reviewed and may appear on this page after approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("testimonial submit:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
