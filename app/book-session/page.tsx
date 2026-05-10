"use client";

import { todayYyyyMmDdInBookingTZ } from "@/lib/booking-date";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/lib/validators";
import { motion } from "framer-motion";
import { CheckCircle, RefreshCw } from "lucide-react";

export default function BookSessionPage() {
  const minBookingDate = useMemo(() => todayYyyyMmDdInBookingTZ(), []);
  const [services, setServices] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsLoadError, setSlotsLoadError] = useState<string | null>(null);
  const [slotsRetryTick, setSlotsRetryTick] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const preferredDate = watch("preferredDate");
  const preferredTime = watch("preferredTime");
  const dateReady =
    Boolean(preferredDate) && /^\d{4}-\d{2}-\d{2}/.test(String(preferredDate).trim());

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!dateReady) {
      setTimeSlots([]);
      setSlotsLoading(false);
      setSlotsLoadError(null);
      setValue("preferredTime", "");
      return () => {
        cancelled = true;
      };
    }
    const loadSlots = async () => {
      setSlotsLoadError(null);
      setValue("preferredTime", "");
      setSlotsLoading(true);
      try {
        const url = `/api/booking-slots?date=${encodeURIComponent(String(preferredDate).slice(0, 10))}`;
        const res = await fetch(url);
        const data = await res.json().catch(() => ({}));
        if (!cancelled) {
          if (!res.ok) {
            setTimeSlots([]);
            const msg =
              typeof (data as { error?: string }).error === "string"
                ? (data as { error: string }).error
                : `Could not load times (${res.status}).`;
            setSlotsLoadError(msg);
            return;
          }
          setTimeSlots(Array.isArray(data.slots) ? data.slots : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setTimeSlots([]);
          setSlotsLoadError(
            "Could not load available times. Check your connection and tap Retry below."
          );
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };
    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [preferredDate, dateReady, setValue, slotsRetryTick]);

  useEffect(() => {
    if (!preferredTime || !timeSlots.length) return;
    const ok = timeSlots.some((t) => t.trim() === String(preferredTime).trim());
    if (!ok) setValue("preferredTime", "");
  }, [timeSlots, preferredTime, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted(true);
        return;
      }
      const msg =
        typeof body.error === "string"
          ? body.error
          : Array.isArray(body.error)
            ? body.error.map((e: { message?: string }) => e.message).filter(Boolean).join(". ")
            : "Could not submit your request. Please try again.";
      setSubmitError(msg || "Submission failed.");
    } catch (err) {
      console.error(err);
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Your booking request has been submitted. You will receive a WhatsApp confirmation once approved.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-colors"
          >
            Book Another Session
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Book a Session</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Fill in the details below. We typically respond within one business day on WhatsApp. Sessions
            include complementary wellness guidance where helpful—your booking is a conversation, not just a
            calendar slot.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  {...register("fullName")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  {...register("phone")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="9355733831"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <select
                  {...register("service")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s._id} value={s.title}>{s.title}</option>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  min={minBookingDate}
                  {...register("preferredDate")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {errors.preferredDate && <p className="mt-1 text-xs text-red-500">{errors.preferredDate.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <select
                  {...register("preferredTime")}
                  disabled={slotsLoading || !dateReady || timeSlots.length === 0}
                  aria-busy={slotsLoading && dateReady ? true : undefined}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {!dateReady
                      ? "Select a date first…"
                      : slotsLoading
                        ? "Loading times…"
                        : slotsLoadError
                          ? "Could not load times — retry below"
                          : timeSlots.length === 0
                            ? "No slots — contact us"
                            : "Select time"}
                  </option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {dateReady && slotsLoading && (
                  <div
                    className="mt-3 space-y-2"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <p className="text-xs font-medium text-primary-800">Loading available times for this date…</p>
                    <div className="flex flex-wrap gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="h-9 w-[4.5rem] animate-pulse rounded-lg bg-gray-200/90"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.preferredTime && (
                  <p className="mt-1 text-xs text-red-500">{errors.preferredTime.message as string}</p>
                )}
                {slotsLoadError && dateReady && (
                  <div
                    className="mt-3 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"
                    role="alert"
                  >
                    <span>{slotsLoadError}</span>
                    <button
                      type="button"
                      onClick={() => setSlotsRetryTick((n) => n + 1)}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-900 shadow-sm hover:bg-red-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                      Retry
                    </button>
                  </div>
                )}
                {!slotsLoading && !slotsLoadError && timeSlots.length === 0 && (
                  <p className="mt-1 text-xs text-amber-700">
                    {preferredDate && String(preferredDate).trim()
                      ? "No open slots left on this date (or none configured). Try another date, or use "
                      : "No time slots are configured yet. Please use "}
                    <a href="/contact" className="font-semibold underline">
                      Contact
                    </a>
                    {preferredDate && String(preferredDate).trim() ? " to request a time." : " to arrange a session."}
                  </p>
                )}
                {!slotsLoading && !slotsLoadError && timeSlots.length > 0 && preferredDate && String(preferredDate).trim() && (
                  <p className="mt-1 text-xs text-gray-500">
                    Only times still available for this date are listed. A pending or confirmed booking
                    removes that slot for the day (rejecting a request frees it again).
                  </p>
                )}
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Concerns</label>
              <textarea
                {...register("concerns")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Briefly describe what you'd like support with..."
              />
              {errors.concerns && <p className="mt-1 text-xs text-red-500">{errors.concerns.message as string}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-200 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
