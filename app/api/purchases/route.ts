import dbConnect from "@/lib/mongodb";
import PurchaseRequest from "@/models/PurchaseRequest";
import { purchaseRequestSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = purchaseRequestSchema.parse(body);

    await dbConnect();
    const purchase = new PurchaseRequest(validatedData);
    await purchase.save();

    return NextResponse.json({ message: "Purchase request submitted successfully" }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
