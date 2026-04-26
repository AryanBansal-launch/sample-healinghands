"use client";

import { AdminSettingsSkeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useRef, useState } from "react";

const SETTING_LABELS: Record<string, string> = {
  phone: "Phone",
  email: "Email",
  whatsapp: "WhatsApp",
  tagline: "Tagline",
  featuredBannerEnabled: 'Featured banner — show on site ("true" or "false")',
  featuredBannerContent: "Featured banner — full message (line breaks preserved)",
  bookingTimeSlots:
    "Book a session — allowed time slots (one per line, e.g. 9:00 AM). Only these appear on the public booking form.",
};

function sortSettings<T extends { key: string }>(list: T[]): T[] {
  const rank = (k: string) => {
    if (k.startsWith("featuredBanner")) return 0;
    if (k === "bookingTimeSlots") return 1;
    return 2;
  };
  return [...list].sort((a, b) => {
    const ra = rank(a.key);
    const rb = rank(b.key);
    if (ra !== rb) return ra - rb;
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
        {rows.map((s) => (
          <div key={s.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor={`setting-${s.key}`}>
              {labelFor(s.key)}
            </label>
            {s.key === "featuredBannerContent" || s.key === "bookingTimeSlots" ? (
              <textarea
                id={`setting-${s.key}`}
                value={values[s.key] ?? ""}
                onChange={(e) => setField(s.key, e.target.value)}
                rows={s.key === "bookingTimeSlots" ? 12 : 18}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 font-sans text-sm leading-relaxed"
              />
            ) : (
              <input
                id={`setting-${s.key}`}
                value={values[s.key] ?? ""}
                onChange={(e) => setField(s.key, e.target.value)}
                className="w-full flex-1 rounded-xl border border-gray-200 px-4 py-2"
              />
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
