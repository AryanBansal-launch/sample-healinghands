import { FOUNDER_PRACTICE_VIDEO_DEFAULTS } from "@/lib/founder-practice-video";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettings.find({});
    const fromDb = settings.reduce<Record<string, string>>((acc, curr) => {
      if (curr.key && typeof curr.value === "string") {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {});
    const merged = {
      ...FOUNDER_PRACTICE_VIDEO_DEFAULTS,
      ...fromDb,
    };
    const { founderPracticeVideoPublicId: _omit, ...publicSafe } = merged;
    void _omit;
    return NextResponse.json(publicSafe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
