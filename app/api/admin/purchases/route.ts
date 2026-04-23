import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    await dbConnect();
    const query = status && status !== "all" ? { status } : {};
    const purchases = await PurchaseRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
