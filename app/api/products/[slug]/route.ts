import dbConnect from "@/lib/mongodb";
import { normalizeProductImages } from "@/lib/normalizeProductImages";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await dbConnect();
    const product = await Product.findOne({ slug, isActive: true }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const p = product as Record<string, unknown>;
    return NextResponse.json({
      ...p,
      images: normalizeProductImages(p.images as string[] | undefined),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
