import { createHash } from "crypto";

/** Stable id for localStorage so a new banner message shows again after dismiss. */
export function featuredBannerDigest(content: string): string {
  return createHash("sha256").update(content).digest("base64url").slice(0, 24);
}
