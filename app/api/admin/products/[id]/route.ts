import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { normalizeProductImageUrl } from "@/lib/normalizeProductImages";
import Product from "@/models/Product";
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
    await dbConnect();
    const stockLeft = Math.max(
      0,
      Math.floor(
        typeof body.stockLeft === "number" ? body.stockLeft : Number(body.stockLeft) || 0
      )
    );
    const updates = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      usageInstructions: Array.isArray(body.usageInstructions)
        ? body.usageInstructions
        : [],
      safetyNotes: body.safetyNotes ?? "",
      price: typeof body.price === "number" ? body.price : Number(body.price) || 0,
      currency: body.currency || "INR",
      images: Array.isArray(body.images)
        ? body.images.map((u: string) => normalizeProductImageUrl(String(u)))
        : [],
      stockLeft,
      inStock: stockLeft > 0,
      isActive: Boolean(body.isActive),
    };
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
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
