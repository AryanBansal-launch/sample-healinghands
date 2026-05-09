import { authOptions } from "@/lib/auth";
import { destroyMedia } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/** Allow Cloudinary public_id paths: letters, digits, underscore, hyphen, slash (no traversal). */
function isValidPublicId(id: string): boolean {
  if (id.length < 1 || id.length > 512) return false;
  if (id.includes("..") || id.startsWith("/")) return false;
  return /^[a-zA-Z0-9_\-\/]+$/.test(id);
}

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const publicId =
    typeof body === "object" &&
    body !== null &&
    "publicId" in body &&
    typeof (body as { publicId: unknown }).publicId === "string"
      ? (body as { publicId: string }).publicId.trim()
      : "";

  const resourceTypeRaw =
    typeof body === "object" &&
    body !== null &&
    "resourceType" in body &&
    typeof (body as { resourceType: unknown }).resourceType === "string"
      ? (body as { resourceType: string }).resourceType.trim().toLowerCase()
      : "video";

  const resourceType = resourceTypeRaw === "image" ? "image" : "video";

  if (!publicId) {
    return NextResponse.json({ error: "publicId is required" }, { status: 400 });
  }
  if (!isValidPublicId(publicId)) {
    return NextResponse.json({ error: "Invalid publicId" }, { status: 400 });
  }

  try {
    const result = await destroyMedia(publicId, resourceType);
    const outcome = result?.result ?? "unknown";
    if (outcome !== "ok" && outcome !== "not found") {
      return NextResponse.json(
        { error: `Cloudinary destroy returned: ${outcome}` },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, result: outcome });
  } catch (err) {
    console.error("Cloudinary destroy error:", err);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
