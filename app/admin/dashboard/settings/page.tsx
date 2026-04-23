"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
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

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Site Settings</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
        {settings.map((s) => (
          <div key={s.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">{s.key}</label>
            <div className="flex space-x-4">
              <input
                defaultValue={s.value}
                onBlur={(e) => handleUpdate(s.key, e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
