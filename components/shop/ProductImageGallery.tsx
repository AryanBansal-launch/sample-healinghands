"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
};

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export default function ProductImageGallery({ images, alt }: Props) {
  const list = images.length > 0 ? images : ["/products/spray.jpeg"];
  const n = list.length;
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, n - 1);
  const main = list[safeIndex];
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setActive(((i % n) + n) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    setActive((i) => ((i - 1 + n) % n));
  }, [n]);

  const goNext = useCallback(() => {
    setActive((i) => ((i + 1) % n));
  }, [n]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || n < 2) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;
    if (diff > 48) goPrev();
    else if (diff < -48) goNext();
    touchStartX.current = null;
  };

  return (
    <div
      className="space-y-4"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} — product images`}
    >
      <div
        className="relative aspect-square w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={main}
          alt={n > 1 ? `${alt} — image ${safeIndex + 1} of ${n}` : alt}
          fill
          className="object-contain sm:object-cover select-none"
          sizes="(max-width: 1024px) 100vw, 480px"
          priority
          unoptimized={isRemote(main)}
        />

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-800 shadow-md transition hover:bg-primary-50 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:left-3 md:h-11 md:w-11"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-800 shadow-md transition hover:bg-primary-50 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:right-3 md:h-11 md:w-11"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
            <div
              className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 px-4"
              role="tablist"
              aria-label="Choose slide"
            >
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  aria-label={`Image ${i + 1} of ${n}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600/30",
                    i === safeIndex
                      ? "w-6 bg-primary-600"
                      : "w-2 bg-white/80 hover:bg-white"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 transition-all",
                i === safeIndex
                  ? "border-primary-600 ring-2 ring-primary-200 scale-[1.02]"
                  : "border-transparent opacity-80 hover:opacity-100 hover:border-gray-300"
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={i === safeIndex ? "true" : undefined}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={isRemote(src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
