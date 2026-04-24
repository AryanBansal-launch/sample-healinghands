import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Certification from "@/models/Certification";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const certifications = await Certification.find({}).sort({ order: 1 });
    return NextResponse.json(certifications);
  } catch (error) {
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
    await dbConnect();
    const certification = new Certification({
      title: body.title,
      description: body.description,
      certificateImage: body.certificateImage,
      order: typeof body.order === "number" ? body.order : Number(body.order) || 0,
      isActive: body.isActive !== false,
    });
    await certification.save();
    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
