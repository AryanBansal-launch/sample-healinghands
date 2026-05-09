/** Site settings keys + defaults for the single “founder on healing practices” video (teaser on Home, full on About). */

export const FOUNDER_PRACTICE_VIDEO_DEFAULTS: Record<string, string> = {
  founderPracticeVideoUrl: "",
  /** Set when uploading via admin; used to delete the Cloudinary asset on remove. Not exposed on public API. */
  founderPracticeVideoPublicId: "",
  /** YouTube: iframe `end` (seconds from start). Direct MP4/WebM: pause after this many seconds on the home teaser. */
  founderPracticeVideoTeaserSeconds: "45",
};

/**
 * Extract YouTube video id from watch, embed, or youtu.be URLs.
 * Returns null if not clearly a YouTube link.
 */
export function parseYouTubeVideoId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  try {
    const base = input.startsWith("http") ? input : `https://${input}`;
    const url = new URL(base);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/")) {
        const id = url.pathname.slice("/embed/".length).split("/")[0];
        return id && /^[\w-]{11}$/.test(id) ? id : null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.slice("/shorts/".length).split("/")[0];
        return id && /^[\w-]{11}$/.test(id) ? id : null;
      }
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
    }
  } catch {
    return null;
  }
  return null;
}

export function clampTeaserSeconds(n: number): number {
  if (!Number.isFinite(n)) return 45;
  return Math.min(600, Math.max(5, Math.floor(n)));
}
