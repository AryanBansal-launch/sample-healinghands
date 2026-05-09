import { authOptions } from "@/lib/auth";
import { uploadImage, uploadVideo } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_* env vars." },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "healinghands";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mime = (file.type || "").toLowerCase();
    const isVideo = mime.startsWith("video/");
    if (isVideo && !VIDEO_TYPES.has(mime)) {
      return NextResponse.json(
        { error: "Unsupported video type. Use MP4, WebM, or QuickTime (MOV)." },
        { status: 400 }
      );
    }
    if (!isVideo && !IMAGE_TYPES.has(mime)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPEG, PNG, WebP for images, or MP4 / WebM / MOV for video." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${mime || "application/octet-stream"};base64,${base64}`;

    const result = isVideo ? await uploadVideo(dataURI, folder) : await uploadImage(dataURI, folder);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
