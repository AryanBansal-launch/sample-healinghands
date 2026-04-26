import { authOptions } from "@/lib/auth";
import { BOOKING_SLOTS_SETTING_DEFAULTS } from "@/lib/booking-time-slots";
import { FEATURED_BANNER_SETTING_DEFAULTS } from "@/lib/featured-banner-defaults";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const settings = await SiteSettings.find({}).lean();
    const fromDb: Record<string, string> = {};
    for (const row of settings) {
      if (row.key && typeof row.value === "string") {
        fromDb[row.key] = row.value;
      }
    }
    const keys = new Set([
      ...Object.keys(fromDb),
      ...Object.keys(FEATURED_BANNER_SETTING_DEFAULTS),
      ...Object.keys(BOOKING_SLOTS_SETTING_DEFAULTS),
    ]);
    const merged = Array.from(keys).sort().map((key) => ({
      key,
      value:
        fromDb[key] ??
        FEATURED_BANNER_SETTING_DEFAULTS[key] ??
        BOOKING_SLOTS_SETTING_DEFAULTS[key] ??
        "",
    }));
    return NextResponse.json(merged);
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
    const key = typeof body.key === "string" ? body.key.trim() : "";
    if (!key) {
      return NextResponse.json({ error: "Setting key is required." }, { status: 400 });
    }
    const value = typeof body.value === "string" ? body.value : String(body.value ?? "");

    await dbConnect();

    const setting = await SiteSettings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
