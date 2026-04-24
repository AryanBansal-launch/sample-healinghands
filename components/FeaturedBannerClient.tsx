"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import FeaturedBannerBody from "@/components/FeaturedBannerBody";

const STORAGE_KEY = "hh_featured_banner_dismissed_digest";

type Props = {
  content: string;
  digest: string;
};

export default function FeaturedBannerClient({ content, digest }: Props) {
  const [open, setOpen] = useState(true);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, digest);
    } catch {
      // ignore
    }
  }, [digest]);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === digest) {
        setOpen(false);
      }
    } catch {
      // ignore
    }
  }, [digest]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  return (
    <AnimatePresence mode="sync">
      {open && (
        <motion.div
          key={digest}
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            aria-label="Close announcement"
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="featured-banner-title"
            className="relative z-10 flex max-h-[min(85vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary-200/90 bg-gradient-to-br from-lavender-100 via-white to-gold-50 shadow-2xl shadow-primary-900/20 ring-2 ring-gold-200/70"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-lavender-400/25 blur-2xl" />

            <button
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md ring-1 ring-gray-200/90 transition hover:bg-white hover:text-gray-900 hover:ring-primary-300/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Dismiss announcement"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="relative overflow-y-auto overscroll-contain px-5 pb-6 pt-5 pr-14 sm:px-8 sm:pb-8 sm:pt-6 sm:pr-16">
              <div
                id="featured-banner-title"
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-primary-50/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-800 shadow-sm"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-gold-500" aria-hidden />
                Announcement
              </div>
              <FeaturedBannerBody content={content} />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
