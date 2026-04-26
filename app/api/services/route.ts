import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

/** Always read fresh from DB (avoid CDN / default route caching). */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, must-revalidate" } as const;

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(services, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
