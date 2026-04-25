import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { testimonialSchema } from "@/lib/validators";
import Testimonial from "@/models/Testimonial";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const list = await Testimonial.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid data";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const d = parsed.data;
    await dbConnect();
    const doc = await Testimonial.create({
      clientName: d.clientName,
      quote: d.quote,
      tagline: d.tagline,
      rating: d.rating ?? 5,
      isActive: d.isActive !== false,
      order: typeof d.order === "number" ? d.order : Number(d.order) || 0,
      source: d.source || "admin",
      submitterEmail: d.submitterEmail?.trim() || "",
    });
    return NextResponse.json(doc, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
