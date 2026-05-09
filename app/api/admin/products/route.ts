import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import {
  normalizeProductImageUrl,
  normalizeProductImages,
} from "@/lib/normalizeProductImages";
import { sanitizeVariantsFromAdminBody, syncRootFromVariants } from "@/lib/productVariants";
import Product from "@/models/Product";
import { adminProductSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    const normalized = products.map((p: Record<string, unknown>) => ({
      ...p,
      images: normalizeProductImages(p.images as string[] | undefined),
    }));
    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    const product = new Product({
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
      isActive: parsed.isActive !== false,
    });
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
