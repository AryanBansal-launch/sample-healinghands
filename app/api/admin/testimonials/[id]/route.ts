import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { testimonialSchema } from "@/lib/validators";
import Testimonial from "@/models/Testimonial";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid data";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const d = parsed.data;
    await dbConnect();
    const doc = await Testimonial.findByIdAndUpdate(
      id,
      {
        clientName: d.clientName,
        quote: d.quote,
        tagline: d.tagline,
        rating: d.rating ?? 5,
        isActive: Boolean(d.isActive),
        order: typeof d.order === "number" ? d.order : Number(d.order) || 0,
        source: d.source || "admin",
        submitterEmail: d.submitterEmail?.trim() ?? "",
      },
      { new: true, runValidators: true }
    );
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    await dbConnect();
    const doc = await Testimonial.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
