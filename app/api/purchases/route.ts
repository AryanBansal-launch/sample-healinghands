import dbConnect from "@/lib/mongodb";
import { LEGACY_VARIANT_ID, getEffectiveVariants } from "@/lib/productVariants";
import { validatePurchaseStock } from "@/lib/purchaseInventory";
import Product from "@/models/Product";
import PurchaseRequest from "@/models/PurchaseRequest";
import { purchaseRequestSchema } from "@/lib/validators";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = purchaseRequestSchema.parse(body);

    await dbConnect();
    const product = await Product.findById(validatedData.product);
    if (!product || product.isActive === false) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const qty = validatedData.quantity;
    const requestedVid = validatedData.variantId;

    const stockCheck = validatePurchaseStock(product, qty, requestedVid ?? null);
    if (!stockCheck.ok) {
      return NextResponse.json({ error: stockCheck.error }, { status: 400 });
    }

    const hasStoredVariants = Array.isArray(product.variants) && product.variants.length > 0;
    let unitPrice = 0;
    let variantLabelOut: string | undefined;
    let variantObjectId: mongoose.Types.ObjectId | undefined;

    if (hasStoredVariants) {
      type VariantLine = { label: string; price: number; stockLeft: number; _id?: mongoose.Types.ObjectId };
      let sub: VariantLine | null = null;
      if (
        requestedVid &&
        requestedVid !== LEGACY_VARIANT_ID &&
        mongoose.Types.ObjectId.isValid(requestedVid)
      ) {
        const found = product.variants?.id(requestedVid);
        if (found) sub = found as VariantLine;
      }
      if (!sub && product.variants!.length === 1) {
        sub = product.variants![0] as VariantLine;
      }
      if (!sub) {
        return NextResponse.json({ error: "Select a valid variant" }, { status: 400 });
      }
      unitPrice = sub.price;
      variantLabelOut = sub.label;
      variantObjectId = sub._id as mongoose.Types.ObjectId;
    } else {
      const eff = getEffectiveVariants(product.toObject() as Record<string, unknown>);
      const line = eff[0];
      unitPrice = line.price;
      variantLabelOut = line.label === "Standard" ? undefined : line.label;
    }

    const expectedTotal = unitPrice * qty;
    if (Math.abs(expectedTotal - validatedData.totalAmount) > 0.01) {
      return NextResponse.json(
        { error: "Order total does not match price × quantity" },
        { status: 400 }
      );
    }

    const displayName =
      variantLabelOut && variantLabelOut !== "Standard"
        ? `${product.name} — ${variantLabelOut}`
        : product.name;

    const purchase = new PurchaseRequest({
      product: validatedData.product,
      productName: displayName,
      quantity: qty,
      customerName: validatedData.customerName,
      customerEmail: validatedData.customerEmail,
      customerPhone: validatedData.customerPhone,
      shippingAddress: validatedData.shippingAddress,
      totalAmount: expectedTotal,
      variantId: variantObjectId,
      variantLabel: variantLabelOut,
      whatsappRedirected: true,
      stockDeducted: false,
    });
    await purchase.save();

    return NextResponse.json({ message: "Purchase request submitted successfully" }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
