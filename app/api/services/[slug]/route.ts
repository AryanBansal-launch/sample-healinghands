import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, must-revalidate" } as const;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await dbConnect();
    const service = await Service.findOne({ slug, isActive: true });
    
    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404, headers: NO_STORE }
      );
    }
    
    return NextResponse.json(service, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}
