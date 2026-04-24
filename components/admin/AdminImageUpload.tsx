"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

type Props = {
  label: string;
  /** Cloudinary folder path, e.g. healinghands/certifications */
  folder: string;
  value: string;
  onChange: (url: string) => void;
  aspectClass?: string;
};

export default function AdminImageUpload({
  label,
  folder,
  value,
  onChange,
  aspectClass = "aspect-video w-full max-w-md",
}: Props) {
  const [uploading, setUploading] = useState(false);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const isRemote = value?.startsWith("http");

  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div
          className={`relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 ${aspectClass}`}
        >
          {value ? (
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={isRemote}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
              No image selected
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-800 rounded-xl cursor-pointer border border-primary-200 hover:bg-primary-100 transition-colors">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Upload className="w-4 h-4 shrink-0" />
            )}
            <span className="text-sm font-semibold">
              {uploading ? "Uploading…" : "Upload image (Cloudinary)"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-gray-500">
            JPEG, PNG, or WebP. Configure Cloudinary env vars on the server.
          </p>
          {value && (
            <p className="text-xs text-gray-600 break-all line-clamp-2" title={value}>
              {value}
            </p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
