import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
    await dbConnect();
    const purchase = await PurchaseRequest.findByIdAndUpdate(params.id, body, { new: true });
    if (!purchase) {
      return NextResponse.json({ error: "Purchase request not found" }, { status: 404 });
    }
    return NextResponse.json(purchase);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
