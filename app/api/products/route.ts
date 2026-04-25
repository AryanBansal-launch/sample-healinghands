import dbConnect from "@/lib/mongodb";
import { normalizeProductImages } from "@/lib/normalizeProductImages";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true }).lean();
    const normalized = products.map((p: any) => ({
      ...p,
      images: normalizeProductImages(p.images),
    }));
    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
