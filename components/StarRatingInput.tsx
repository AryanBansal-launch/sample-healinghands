"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  /** Shown as `aria-labelledby` when provided */
  labelId?: string;
  className?: string;
};

/**
 * Simple 1–5 star picker for forms (click a star to set rating).
 */
export default function StarRatingInput({
  value,
  onChange,
  disabled,
  labelId,
  className,
}: StarRatingInputProps) {
  const safe = Math.min(5, Math.max(1, Number(value) || 1));

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1", className)}
      role="group"
      aria-labelledby={labelId}
      aria-label={labelId ? undefined : "Overall rating"}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= safe;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={cn(
              "rounded-lg p-1.5 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              active ? "text-gold-500" : "text-gray-300 hover:text-gold-400/80"
            )}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            <Star
              className={cn(
                "h-8 w-8 sm:h-9 sm:w-9",
                active ? "fill-current" : "fill-transparent stroke-[1.5]"
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-600" aria-live="polite">
        {safe} of 5
      </span>
    </div>
  );
}
