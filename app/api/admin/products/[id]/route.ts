import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { normalizeProductImageUrl } from "@/lib/normalizeProductImages";
import { sanitizeVariantsFromAdminBody, syncRootFromVariants } from "@/lib/productVariants";
import Product from "@/models/Product";
import { adminProductSchema } from "@/lib/validators";
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
    const parsed = adminProductSchema.parse(body);
    const sanitized = sanitizeVariantsFromAdminBody({
      ...parsed,
      variants: parsed.variants.map((v) => ({
        label: v.label,
        price: v.price,
        stockLeft: v.stockLeft,
        _id: v._id,
      })),
    } as Record<string, unknown>);
    const root = syncRootFromVariants(sanitized);
    const variantDocs = sanitized.map((v) =>
      v._id
        ? { _id: v._id, label: v.label, price: v.price, stockLeft: v.stockLeft }
        : { label: v.label, price: v.price, stockLeft: v.stockLeft }
    );

    await dbConnect();
    const images = Array.isArray(parsed.images)
      ? parsed.images.map((u: string) => normalizeProductImageUrl(String(u)))
      : [];

    const updates = {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      benefits: parsed.benefits ?? [],
      usageInstructions: parsed.usageInstructions ?? [],
      safetyNotes: parsed.safetyNotes ?? "",
      currency: parsed.currency || "INR",
      images,
      variants: variantDocs,
      price: root.price,
      stockLeft: root.stockLeft,
      inStock: root.inStock,
      isActive: Boolean(parsed.isActive),
    };

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
