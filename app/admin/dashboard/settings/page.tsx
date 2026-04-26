"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [settings, setSettings] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(Array.isArray(data) ? sortSettings(data) : []);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  const labelFor = useMemo(
    () => (key: string) =>
      SETTING_LABELS[key] ??
      key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    []
  );

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold sm:text-3xl">Site Settings</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
        {settings.map((s) => (
          <div key={s.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{labelFor(s.key)}</label>
            {s.key === "featuredBannerContent" || s.key === "bookingTimeSlots" ? (
              <textarea
                defaultValue={s.value}
                onBlur={(e) => handleUpdate(s.key, e.target.value)}
                rows={s.key === "bookingTimeSlots" ? 12 : 18}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-sans text-sm leading-relaxed"
              />
            ) : (
              <input
                defaultValue={s.value}
                onBlur={(e) => handleUpdate(s.key, e.target.value)}
                className="flex-1 w-full px-4 py-2 rounded-xl border border-gray-200"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
