import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { applyDecrementToProduct, applyIncrementToProduct } from "@/lib/purchaseInventory";
import Product from "@/models/Product";
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
    const body = (await req.json()) as Record<string, unknown>;
    await dbConnect();

    const purchase = await PurchaseRequest.findById(params.id);
    if (!purchase) {
      return NextResponse.json({ error: "Purchase request not found" }, { status: 404 });
    }

    const patch: Record<string, unknown> = {};
    if ("status" in body && body.status !== undefined) {
      patch.status = body.status;
    }
    if ("adminNotes" in body && body.adminNotes !== undefined) {
      patch.adminNotes = body.adminNotes;
    }

    const prevStatus = purchase.status;
    const nextStatus =
      typeof patch.status === "string" ? (patch.status as string) : prevStatus;

    if (nextStatus === "confirmed" && prevStatus === "pending" && !purchase.stockDeducted) {
      const product = await Product.findById(purchase.product);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 400 });
      }
      const variantIdStr = purchase.variantId ? String(purchase.variantId) : null;
      const dec = applyDecrementToProduct(product, purchase.quantity, variantIdStr);
      if (!dec.ok) {
        return NextResponse.json(
          { error: dec.error || "Cannot confirm: inventory check failed" },
          { status: 400 }
        );
      }
      await product.save();
      patch.stockDeducted = true;
    }

    if (nextStatus === "cancelled" && purchase.stockDeducted) {
      const product = await Product.findById(purchase.product);
      if (product) {
        applyIncrementToProduct(product, purchase.quantity, purchase.variantId ?? null);
        await product.save();
      }
      patch.stockDeducted = false;
    }

    const updated = await PurchaseRequest.findByIdAndUpdate(params.id, patch, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
