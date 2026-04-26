"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/lib/validators";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function BookSessionPage() {
  const [services, setServices] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
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
      setValue("preferredTime", "");
      return () => {
        cancelled = true;
      };
    }
    const loadSlots = async () => {
      setValue("preferredTime", "");
      setSlotsLoading(true);
      try {
        const url = `/api/booking-slots?date=${encodeURIComponent(String(preferredDate).slice(0, 10))}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) {
          setTimeSlots(Array.isArray(data.slots) ? data.slots : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setTimeSlots([]);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };
    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [preferredDate, dateReady, setValue]);

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
          <p className="text-gray-600">Fill in the details below and we&apos;ll get back to you shortly.</p>
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {!dateReady
                      ? "Select a date first…"
                      : slotsLoading
                        ? "Loading times…"
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
                {errors.preferredTime && (
                  <p className="mt-1 text-xs text-red-500">{errors.preferredTime.message as string}</p>
                )}
                {!slotsLoading && timeSlots.length === 0 && (
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
                {!slotsLoading && timeSlots.length > 0 && preferredDate && String(preferredDate).trim() && (
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
