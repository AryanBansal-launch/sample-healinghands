import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Certification from "@/models/Certification";
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
    await dbConnect();
    const certification = await Certification.findByIdAndUpdate(id, body, { new: true });
    if (!certification) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }
    return NextResponse.json(certification);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    await dbConnect();
    const certification = await Certification.findByIdAndDelete(id);
    if (!certification) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Certification deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
