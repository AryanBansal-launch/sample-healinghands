import dbConnect from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const content = await PageContent.find({ pageSlug: params.slug });
    const contentMap = content.reduce((acc: any, curr) => {
      acc[curr.sectionKey] = curr.content;
      return acc;
    }, {});
    return NextResponse.json(contentMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page content" }, { status: 500 });
  }
}
