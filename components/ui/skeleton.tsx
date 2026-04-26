import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200/80 dark:bg-gray-700/40",
        className
      )}
      {...props}
    />
  );
}

/** Admin dashboard home: stat cards + two recent lists */
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 max-w-full sm:w-72" />
        <Skeleton className="h-5 w-52 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6"
          >
            <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6"
          >
            <Skeleton className="h-7 w-44" />
            {Array.from({ length: 4 }, (_, rowIdx) => (
              <Skeleton key={`${i}-${rowIdx}`} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bookings / purchases style table */
export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56 max-w-full" />
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="flex gap-4 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-6">
              {Array.from({ length: 5 }, (_, col) => (
                <Skeleton key={`head-${col}`} className="h-4 flex-1" />
              ))}
            </div>
            {Array.from({ length: rows }, (_, r) => (
              <div
                key={`row-${r}`}
                className="flex gap-4 border-b border-gray-50 px-4 py-4 last:border-0 sm:px-6"
              >
                {Array.from({ length: 5 }, (_, c) => (
                  <Skeleton key={`cell-${r}-${c}`} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Services, products, certifications admin grids */
export function AdminGridCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-56 max-w-full sm:w-64" />
        <Skeleton className="h-10 w-full rounded-xl sm:w-36" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-6 w-[85%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Site settings — stacked fields */
export function AdminSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Admin testimonials list */
export function AdminTestimonialsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-full rounded-xl sm:w-48" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-2xl" />
      ))}
    </div>
  );
}

/** Public: shop grid */
export function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-64 max-w-full md:h-16 md:w-96" />
          <Skeleton className="mx-auto h-6 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-6 w-[88%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Public: services list */
export function ServicesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Skeleton className="mx-auto h-14 w-72 max-w-full md:h-16 md:w-[28rem]" />
          <Skeleton className="mx-auto h-20 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-6 flex items-center gap-4">
                <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
                <Skeleton className="h-8 flex-1" />
              </div>
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-[92%]" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Public: certifications grid */
export function CertificationsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Skeleton className="mx-auto h-14 w-80 max-w-full md:h-16 md:w-[32rem]" />
          <Skeleton className="mx-auto h-6 w-full max-w-3xl" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Public: testimonials */
export function TestimonialsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <Skeleton className="mx-auto h-14 w-72 max-w-full md:h-20 md:w-[26rem]" />
          <Skeleton className="mx-auto h-6 w-full max-w-3xl" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Service detail hero + body */
export function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-72 w-full md:h-96">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Skeleton className="mb-6 h-10 w-full max-w-md" />
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
        <Skeleton className="h-12 w-48 rounded-full" />
      </div>
    </div>
  );
}

/** Login / small suspense fallbacks */
export function LoginShellSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
