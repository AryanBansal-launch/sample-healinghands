import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
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
    await dbConnect();
    const product = new Product({
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
      images: Array.isArray(body.images) ? body.images : [],
      inStock: body.inStock !== false,
      isActive: body.isActive !== false,
    });
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
