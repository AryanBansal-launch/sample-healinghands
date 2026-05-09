"use client";

import AdminVideoUpload from "@/components/admin/AdminVideoUpload";
import BookingTimeSlotsEditor from "@/components/admin/BookingTimeSlotsEditor";
import { AdminSettingsSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

const SETTING_LABELS: Record<string, string> = {
  phone: "Phone",
  email: "Email",
  whatsapp: "WhatsApp",
  tagline: "Tagline",
  featuredBannerEnabled: "Featured banner — show on site",
  featuredBannerContent: "Featured banner — full message (line breaks preserved)",
  founderPracticeVideoUrl:
    "Founder video — upload to Cloudinary below, or paste a YouTube / direct video URL. Same clip is used on Home (teaser) and About (full).",
  founderPracticeVideoTeaserSeconds:
    "Home teaser length (seconds). YouTube: iframe end time. Direct video: pauses after this many seconds.",
  founderPracticeVideoPublicId:
    "Internal — Cloudinary public ID for the uploaded founder video (auto-filled on upload; used to delete from Cloudinary).",
  bookingTimeSlots: "Book a session — allowed time slots",
};

function sortSettings<T extends { key: string }>(list: T[]): T[] {
  const rank = (k: string) => {
    if (k.startsWith("featuredBanner")) return 0;
    if (k.startsWith("founderPractice")) return 1;
    if (k === "bookingTimeSlots") return 2;
    return 3;
  };
  const founderKeyOrder = (k: string) => {
    if (k === "founderPracticeVideoUrl") return 0;
    if (k === "founderPracticeVideoPublicId") return 1;
    if (k === "founderPracticeVideoTeaserSeconds") return 2;
    return 3;
  };

  return [...list].sort((a, b) => {
    const ra = rank(a.key);
    const rb = rank(b.key);
    if (ra !== rb) return ra - rb;
    if (a.key.startsWith("founderPractice") && b.key.startsWith("founderPractice")) {
      return founderKeyOrder(a.key) - founderKeyOrder(b.key);
    }
    return a.key.localeCompare(b.key);
  });
}

export default function AdminSettingsPage() {
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<"ok" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const baseline = useRef<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((res) => res.json())
      .then((data) => {
        const sorted = Array.isArray(data) ? sortSettings(data) : [];
        setRows(sorted);
        const v = Object.fromEntries(sorted.map((r) => [r.key, r.value ?? ""]));
        setValues(v);
        baseline.current = { ...v };
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dirty = useMemo(
    () => rows.some((r) => (values[r.key] ?? "") !== (baseline.current[r.key] ?? "")),
    [rows, values]
  );

  const setField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setBanner(null);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    setError(null);
    try {
      for (const r of rows) {
        const next = values[r.key] ?? "";
        const prev = baseline.current[r.key] ?? "";
        if (next === prev) continue;
        const res = await fetch("/api/admin/site-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: r.key, value: next }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg =
            typeof body.error === "string"
              ? body.error
              : "Could not save one or more settings.";
          throw new Error(msg);
        }
      }
      baseline.current = { ...values };
      setBanner("ok");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const labelFor = useMemo(
    () => (key: string) =>
      SETTING_LABELS[key] ??
      key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    []
  );

  if (loading) return <AdminSettingsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold sm:text-3xl">Site Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit fields below, then use <span className="font-medium text-gray-800">Save changes</span> to write
            them to the database. Nothing is saved until you click save.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !dirty}
          className="shrink-0 rounded-2xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {banner === "ok" && (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          All changes saved.
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
        {rows
          .filter((s) => s.key !== "founderPracticeVideoPublicId")
          .map((s) => (
          <div key={s.key} className="space-y-2">
            {s.key === "featuredBannerEnabled" ? (
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  {labelFor(s.key)}
                </legend>
                {(() => {
                  const bannerOff =
                    String(values[s.key] ?? "true").trim().toLowerCase() === "false";
                  const opts = [
                    {
                      stored: "true" as const,
                      title: "Show",
                      hint: "Banner appears on the homepage when content is set.",
                      checked: !bannerOff,
                    },
                    {
                      stored: "false" as const,
                      title: "Hide",
                      hint: "Banner is not shown anywhere.",
                      checked: bannerOff,
                    },
                  ];
                  return (
                    <div
                      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                      role="radiogroup"
                      aria-label={labelFor(s.key)}
                    >
                      {opts.map((opt) => {
                        const inputId = `setting-${s.key}-${opt.stored}`;
                        return (
                          <label
                            key={opt.stored}
                            htmlFor={inputId}
                            className={cn(
                              "flex max-w-md cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-3 transition-colors sm:min-w-[200px]",
                              opt.checked
                                ? "border-primary-600 bg-primary-50/80 ring-1 ring-primary-600/25"
                                : "border-gray-200 bg-white hover:border-primary-200"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <input
                                id={inputId}
                                type="radio"
                                name="featuredBannerEnabled"
                                value={opt.stored}
                                checked={opt.checked}
                                onChange={() => setField(s.key, opt.stored)}
                                className="h-4 w-4 shrink-0 border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm font-semibold text-gray-900">{opt.title}</span>
                            </span>
                            <span className="pl-7 text-xs text-gray-600">{opt.hint}</span>
                          </label>
                        );
                      })}
                    </div>
                  );
                })()}
              </fieldset>
            ) : s.key === "bookingTimeSlots" ? (
              <div className="space-y-2">
                <p id={`setting-${s.key}-legend`} className="block text-sm font-medium text-gray-700">
                  {labelFor(s.key)}
                </p>
                <BookingTimeSlotsEditor
                  value={values[s.key] ?? ""}
                  onChange={(next) => setField(s.key, next)}
                  legendId={`setting-${s.key}-legend`}
                />
              </div>
            ) : (
              <>
                {s.key !== "founderPracticeVideoUrl" && (
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`setting-${s.key}`}>
                    {labelFor(s.key)}
                  </label>
                )}
                {s.key === "featuredBannerContent" ? (
                  <textarea
                    id={`setting-${s.key}`}
                    value={values[s.key] ?? ""}
                    onChange={(e) => setField(s.key, e.target.value)}
                    rows={18}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 font-sans text-sm leading-relaxed"
                  />
                ) : s.key === "founderPracticeVideoUrl" ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700">{labelFor(s.key)}</p>
                    <AdminVideoUpload
                      label="Upload file (stored on Cloudinary)"
                      folder="healinghands/founder-practice"
                      value={values[s.key] ?? ""}
                      publicId={values.founderPracticeVideoPublicId ?? ""}
                      onChange={(url) => setField(s.key, url)}
                      onPublicIdChange={(pid) => setField("founderPracticeVideoPublicId", pid)}
                    />
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-gray-600">
                        Or paste a URL (YouTube or direct link — replaces uploaded URL)
                      </span>
                      <textarea
                        id={`setting-${s.key}`}
                        value={values[s.key] ?? ""}
                        onChange={(e) => {
                          setField(s.key, e.target.value);
                          setField("founderPracticeVideoPublicId", "");
                        }}
                        rows={3}
                        placeholder="https://www.youtube.com/watch?v=… or paste Cloudinary URL after upload"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    id={`setting-${s.key}`}
                    value={values[s.key] ?? ""}
                    onChange={(e) => setField(s.key, e.target.value)}
                    className="w-full flex-1 rounded-xl border border-gray-200 px-4 py-2"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !dirty}
          className="rounded-2xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
