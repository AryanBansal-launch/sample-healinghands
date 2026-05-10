"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

const BOT_ID = process.env.NEXT_PUBLIC_CHATBASE_BOT_ID ?? "";
const SAFE_BOT_ID = /^[a-zA-Z0-9_-]+$/;
const DISMISSED_KEY = "hh_chatbase_hint_dismissed";

/**
 * Small note so visitors know the floating chat is AI; human contact stays on Contact / WhatsApp.
 * Dismissal is remembered in localStorage.
 */
export default function ChatbaseHint() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const onDismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  if (!BOT_ID || !SAFE_BOT_ID.test(BOT_ID) || pathname?.startsWith("/admin")) {
    return null;
  }

  if (!hydrated || dismissed) {
    return null;
  }

  return (
    <div
      role="note"
      className="fixed bottom-4 left-4 z-[34] max-w-[min(100vw-2rem,20rem)] rounded-xl border border-gray-200/90 bg-white/95 py-2 pl-3 pr-2 shadow-md backdrop-blur-sm sm:bottom-6 sm:left-6"
    >
      <div className="flex gap-1">
        <p className="min-w-0 flex-1 text-[11px] leading-snug text-gray-600 sm:text-xs">
          <span className="font-semibold text-gray-800">Tip:</span> The chat widget is an AI assistant. For a direct
          reply from us, use{" "}
          <Link href="/contact" className="font-semibold text-primary-700 underline">
            Contact
          </Link>{" "}
          or WhatsApp from the site header/footer.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          aria-label="Dismiss tip"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
