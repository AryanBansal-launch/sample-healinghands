"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";

type Props = {
  badgeLabel: string;
  headline: string;
  productImageSrc: string;
  ctaHref: string;
  ctaLabel: string;
  onDismiss: () => void;
};

function isRemoteSrc(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export default function FeaturedBannerStrip({
  badgeLabel,
  headline,
  productImageSrc,
  ctaHref,
  ctaLabel,
  onDismiss,
}: Props) {
  const external = ctaHref.startsWith("http://") || ctaHref.startsWith("https://");

  return (
    <div
      role="region"
      aria-label="Featured announcement"
      className="relative z-[35] border-b border-primary-200/80 bg-gradient-to-r from-primary-50/95 via-white to-gold-50/90 shadow-md shadow-primary-900/5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-sm ring-1 ring-primary-100">
            <Image
              src={productImageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
              unoptimized={isRemoteSrc(productImageSrc)}
            />
          </div>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-primary-800">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden />
              {badgeLabel}
            </p>
            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">{headline}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-center">
          {external ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700"
            >
              {ctaLabel}
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700"
            >
              {ctaLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
            aria-label="Dismiss featured banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
