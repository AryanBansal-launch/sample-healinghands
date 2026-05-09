"use client";

import { useState } from "react";
import { Film, Loader2, Trash2, Upload } from "lucide-react";
import { parseYouTubeVideoId } from "@/lib/founder-practice-video";

type Props = {
  label: string;
  /** Cloudinary folder, e.g. healinghands/founder-practice */
  folder: string;
  value: string;
  /** Cloudinary public_id when this URL came from our upload (used to delete remote asset). */
  publicId?: string;
  onChange: (url: string) => void;
  onPublicIdChange?: (publicId: string) => void;
};

export default function AdminVideoUpload({
  label,
  folder,
  value,
  publicId = "",
  onChange,
  onPublicIdChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      onChange(data.url);
      onPublicIdChange?.(typeof data.publicId === "string" ? data.publicId : "");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const trimmed = (value ?? "").trim();
  const pid = publicId.trim();
  const isYouTube = trimmed ? parseYouTubeVideoId(trimmed) !== null : false;
  const isDirectVideo =
    trimmed &&
    !isYouTube &&
    (/\.(mp4|webm|mov)(\?|#|$)/i.test(trimmed) || /\/video\/upload\//i.test(trimmed));

  const handleClear = async () => {
    if (!trimmed) return;
    const willDeleteCloudinary = Boolean(pid);
    const msg = willDeleteCloudinary
      ? "Remove this video from the site and delete the uploaded file from Cloudinary? You still need to click Save changes afterward."
      : "Remove this video URL from site settings? (YouTube / pasted links are not deleted from Cloudinary.) Click Save changes to apply.";
    if (!window.confirm(msg)) return;

    setError("");
    setRemoving(true);
    try {
      if (pid) {
        const res = await fetch("/api/admin/cloudinary/destroy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: pid, resourceType: "video" }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Cloudinary delete failed");
        }
      }
      onChange("");
      onPublicIdChange?.("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Remove failed";
      setError(message);
    } finally {
      setRemoving(false);
    }
  };

  const busy = uploading || removing;

  return (
    <div className="space-y-3">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gray-950">
          {trimmed && isDirectVideo ? (
            <video
              key={trimmed}
              src={trimmed}
              className="h-full w-full object-contain"
              controls
              playsInline
              preload="metadata"
            />
          ) : trimmed && isYouTube ? (
            <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 p-4 text-center text-sm text-gray-400">
              <Film className="h-10 w-10 opacity-60" aria-hidden />
              <p>YouTube URL — embed preview appears on the public site.</p>
            </div>
          ) : trimmed ? (
            <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 p-4 text-center text-sm text-gray-400">
              <Film className="h-10 w-10 opacity-60" aria-hidden />
              <p>Direct video URL not detected — check link or use upload.</p>
            </div>
          ) : (
            <div className="flex h-full min-h-[180px] items-center justify-center text-gray-500 text-sm px-4 text-center">
              No video file uploaded yet
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-primary-800 transition-colors hover:bg-primary-100">
              {uploading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 shrink-0" />
              )}
              <span className="text-sm font-semibold">
                {uploading ? "Uploading to Cloudinary…" : "Upload video (Cloudinary)"}
              </span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                className="hidden"
                onChange={handleFile}
                disabled={busy}
              />
            </label>
            {trimmed ? (
              <button
                type="button"
                onClick={() => void handleClear()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 disabled:opacity-50"
              >
                {removing ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                )}
                {removing ? "Deleting…" : "Remove from site"}
              </button>
            ) : null}
          </div>
          <p className="text-xs text-gray-500">
            MP4, WebM, or MOV. Large files may take a minute. Requires <code className="rounded bg-gray-100 px-1">CLOUDINARY_*</code>{" "}
            env vars. After upload or remove, click <span className="font-medium text-gray-700">Save changes</span> below.
            {pid
              ? " Remove deletes the Cloudinary asset (by stored public ID), then clears the URL."
              : " Remove clears the URL only (no Cloudinary delete for YouTube or pasted links without an upload ID)."}
          </p>
          {value && (
            <p className="break-all text-xs text-gray-600 line-clamp-3" title={value}>
              {value}
            </p>
          )}
          {pid ? (
            <p className="text-[11px] text-gray-500">
              Cloudinary public ID: <span className="font-mono text-gray-700">{pid}</span>
            </p>
          ) : null}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
