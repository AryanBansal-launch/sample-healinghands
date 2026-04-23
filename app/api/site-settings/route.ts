import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettings.find({});
    const settingsMap = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
