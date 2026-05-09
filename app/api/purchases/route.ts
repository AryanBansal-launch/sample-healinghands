import dbConnect from "@/lib/mongodb";
import {
  LEGACY_VARIANT_ID,
  getEffectiveVariants,
  syncRootFromVariants,
} from "@/lib/productVariants";
import Product from "@/models/Product";
import PurchaseRequest from "@/models/PurchaseRequest";
import { purchaseRequestSchema } from "@/lib/validators";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type VariantLine = {
  label: string;
  price: number;
  stockLeft: number;
  _id?: mongoose.Types.ObjectId;
};

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

    let unitPrice = 0;
    let variantLabelOut: string | undefined;
    let variantObjectId: mongoose.Types.ObjectId | undefined;

    const hasStoredVariants = Array.isArray(product.variants) && product.variants.length > 0;

    if (hasStoredVariants) {
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
      if (sub.stockLeft < qty) {
        return NextResponse.json({ error: "Not enough stock for this variant" }, { status: 400 });
      }
      unitPrice = sub.price;
      variantLabelOut = sub.label;
      variantObjectId = sub._id as mongoose.Types.ObjectId;
      sub.stockLeft -= qty;

      const root = syncRootFromVariants(
        product.variants!.map((v: VariantLine) => ({
          price: v.price,
          stockLeft: v.stockLeft,
        }))
      );
      product.price = root.price;
      product.stockLeft = root.stockLeft;
      product.inStock = root.inStock;
    } else {
      const eff = getEffectiveVariants(product.toObject() as Record<string, unknown>);
      const line = eff[0];
      if (!line.inStock || line.stockLeft < qty) {
        return NextResponse.json({ error: "This product is out of stock" }, { status: 400 });
      }
      unitPrice = line.price;
      variantLabelOut = line.label === "Standard" ? undefined : line.label;
      product.stockLeft = Math.max(0, (product.stockLeft ?? 0) - qty);
      product.inStock = product.stockLeft > 0;
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

    await product.save();

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
