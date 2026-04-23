import dbConnect from "@/lib/mongodb";
import Certification from "@/models/Certification";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const certifications = await Certification.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(certifications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}
