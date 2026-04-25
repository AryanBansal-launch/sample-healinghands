import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import PurchaseRequest from "@/models/PurchaseRequest";
import { purchaseRequestSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = purchaseRequestSchema.parse(body);

    await dbConnect();
    const productDoc = await Product.findById(validatedData.product)
      .select("inStock isActive stockLeft")
      .lean();
    if (!productDoc || productDoc.isActive === false) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }
    const sl = (productDoc as { stockLeft?: number }).stockLeft;
    const hasStock =
      typeof sl === "number" && Number.isFinite(sl) ? sl > 0 : productDoc.inStock !== false;
    if (!hasStock) {
      return NextResponse.json({ error: "This product is out of stock" }, { status: 400 });
    }

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
