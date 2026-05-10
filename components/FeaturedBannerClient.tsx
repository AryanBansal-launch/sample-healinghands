"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, X } from "lucide-react";
import FeaturedBannerBody from "@/components/FeaturedBannerBody";
import FeaturedBannerStrip from "@/components/FeaturedBannerStrip";

const STORAGE_KEY = "hh_featured_banner_dismissed_digest";

function sessionModalShownKey(digest: string) {
  return `hh_featured_full_modal_shown_${digest}`;
}

type Props = {
  content: string;
  digest: string;
  badgeLabel: string;
  headline: string;
  productImageSrc: string;
  ctaHref: string;
  ctaLabel: string;
};

function isRemoteSrc(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type ResolvedMode = "pending" | "hidden" | "modal" | "strip";

export default function FeaturedBannerClient({
  content,
  digest,
  badgeLabel,
  headline,
  productImageSrc,
  ctaHref,
  ctaLabel,
}: Props) {
  const [mode, setMode] = useState<ResolvedMode>("pending");
  const [modalOpen, setModalOpen] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    setModalOpen(false);
    setMode("hidden");
    try {
      localStorage.setItem(STORAGE_KEY, digest);
    } catch {
      // ignore
    }
  }, [digest]);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === digest) {
        setMode("hidden");
        return;
      }
      if (sessionStorage.getItem(sessionModalShownKey(digest)) === "1") {
        setMode("strip");
        return;
      }
      setMode("modal");
    } catch {
      setMode("modal");
    }
  }, [digest]);

  /** After first full-screen modal this tab session, later navigations use the compact strip. */
  useEffect(() => {
    if (mode !== "modal" || !modalOpen) return;
    try {
      sessionStorage.setItem(sessionModalShownKey(digest), "1");
    } catch {
      // ignore
    }
  }, [mode, modalOpen, digest]);

  useEffect(() => {
    if (mode !== "modal" || !modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mode, modalOpen]);

  useEffect(() => {
    if (mode !== "modal" || !modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, modalOpen, dismiss]);

  useEffect(() => {
    if (mode !== "modal" || !modalOpen) return;
    const id = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [mode, modalOpen, digest]);

  const showCta = Boolean(ctaHref && ctaLabel);
  const ctaExternal = ctaHref.startsWith("http://") || ctaHref.startsWith("https://");

  if (mode === "pending" || mode === "hidden") {
    return null;
  }

  if (mode === "strip") {
    return (
      <FeaturedBannerStrip
        badgeLabel={badgeLabel}
        headline={headline}
        productImageSrc={productImageSrc}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        onDismiss={dismiss}
      />
    );
  }

  return (
    <AnimatePresence mode="sync">
      {modalOpen && (
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
            className="absolute inset-0 bg-gray-900/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="featured-banner-title"
            className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-[min(96vw,52rem)] flex-col overflow-hidden rounded-[1.5rem] border border-primary-200/90 bg-gradient-to-br from-white via-primary-50/40 to-gold-50/90 shadow-2xl shadow-primary-900/25 ring-2 ring-gold-300/50 lg:max-w-[56rem]"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-lavender-400/30 blur-3xl" />

            <button
              ref={closeBtnRef}
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md ring-1 ring-gray-200/90 transition hover:bg-white hover:text-gray-900 hover:ring-primary-300/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Dismiss announcement"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="relative overflow-y-auto overscroll-contain px-6 pb-8 pt-6 pr-14 sm:px-10 sm:pb-10 sm:pt-8 sm:pr-20">
              <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center lg:gap-8">
                <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-3xl border-2 border-white bg-white shadow-xl shadow-primary-900/15 ring-2 ring-primary-100 sm:mx-0 sm:h-44 sm:w-44 lg:h-52 lg:w-52">
                  <Image
                    src={productImageSrc}
                    alt="Healing Bliss Aromatherapy Mist — Aura Cleansing Spray"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 160px, 208px"
                    unoptimized={isRemoteSrc(productImageSrc)}
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary-300/70 bg-gradient-to-r from-primary-100/95 to-gold-100/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-900 shadow-sm">
                    <Sparkles className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                    {badgeLabel}
                  </div>
                  <p
                    id="featured-banner-title"
                    className="mt-2 text-sm leading-snug text-gray-600 sm:text-[15px]"
                  >
                    Aromatherapy aura mist · repel negativity, protect your field—corners, doorways &
                    everyday spaces.
                  </p>
                </div>
              </div>

              <FeaturedBannerBody content={content} />

              {showCta && (
                <div className="mt-10 flex flex-col gap-4 border-t border-primary-100/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-center text-sm font-medium text-gray-600 sm:text-left">
                    Multiple sizes · In stock · Ready when you are
                  </p>
                  {ctaExternal ? (
                    <a
                      href={ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-600/35 ring-2 ring-primary-500/30 transition hover:from-primary-700 hover:to-primary-800 hover:shadow-xl"
                    >
                      <ShoppingBag className="h-5 w-5 shrink-0 opacity-95" aria-hidden />
                      {ctaLabel}
                      <ArrowRight className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href={ctaHref}
                      onClick={dismiss}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-600/35 ring-2 ring-primary-500/30 transition hover:from-primary-700 hover:to-primary-800 hover:shadow-xl"
                    >
                      <ShoppingBag className="h-5 w-5 shrink-0 opacity-95" aria-hidden />
                      {ctaLabel}
                      <ArrowRight className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
