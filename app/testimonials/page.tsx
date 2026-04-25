"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { testimonialPublicSubmitSchema } from "@/lib/validators";
import type { z } from "zod";

type ShareForm = z.infer<typeof testimonialPublicSubmitSchema>;

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitOk, setSubmitOk] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareForm>({
    resolver: zodResolver(testimonialPublicSubmitSchema),
    defaultValues: {
      clientName: "",
      quote: "",
      tagline: "",
      rating: 5,
      email: "",
    },
  });

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const onShareSubmit = async (data: ShareForm) => {
    setSubmitErr(null);
    setSubmitOk(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: data.clientName,
          quote: data.quote,
          tagline: data.tagline,
          rating: data.rating ?? 5,
          email: data.email?.trim() || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitErr(typeof body.error === "string" ? body.error : "Something went wrong.");
        return;
      }
      setSubmitOk(true);
      reset({ clientName: "", quote: "", tagline: "", rating: 5, email: "" });
    } catch {
      setSubmitErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-600">Loading testimonials...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 font-serif text-5xl font-bold text-gray-900 md:text-6xl">
            Client Experiences
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Real stories of transformation, healing, and positive change from our community
          </p>
        </motion.div>

        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
            >
              <div>
                <Quote className="mb-6 h-10 w-10 text-primary-100" />
                <div className="mb-6 flex items-center">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-gold-500" />
                  ))}
                </div>
                <p className="mb-8 text-lg italic leading-relaxed text-gray-700">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <p className="text-lg font-bold text-gray-900">{testimonial.clientName}</p>
                <p className="font-medium text-primary-600">{testimonial.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mx-auto mb-20 max-w-2xl"
        >
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-10">
            <h2 className="mb-2 font-serif text-2xl font-bold text-gray-900 md:text-3xl">
              Share your experience
            </h2>
            <p className="mb-8 text-gray-600">
              Tell us how your session or journey felt. Submissions are reviewed before they may
              appear on this page.
            </p>
            {submitOk && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <p className="text-sm font-medium">
                  Thank you. Your message was received and will be reviewed. We appreciate you taking
                  the time to share.
                </p>
              </div>
            )}
            {submitErr && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                {submitErr}
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit(onShareSubmit)}>
              <div>
                <label htmlFor="t-name" className="mb-1 block text-sm font-semibold text-gray-800">
                  Your name
                </label>
                <input
                  id="t-name"
                  {...register("clientName")}
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                  placeholder="Name as you’d like it shown"
                />
                {errors.clientName && (
                  <p className="mt-1 text-xs text-red-600">{errors.clientName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="t-email" className="mb-1 block text-sm font-semibold text-gray-800">
                  Email (optional)
                </label>
                <input
                  id="t-email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                  placeholder="Only if you’re happy for us to reply privately"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="t-tagline" className="mb-1 block text-sm font-semibold text-gray-800">
                  Short headline
                </label>
                <input
                  id="t-tagline"
                  {...register("tagline")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                  placeholder="e.g. A sense of calm I hadn’t felt in months"
                />
                {errors.tagline && (
                  <p className="mt-1 text-xs text-red-600">{errors.tagline.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="t-quote" className="mb-1 block text-sm font-semibold text-gray-800">
                  Your experience
                </label>
                <textarea
                  id="t-quote"
                  {...register("quote")}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                  placeholder="What brought you in, what shifted for you, or anything you’d like others to know…"
                />
                {errors.quote && (
                  <p className="mt-1 text-xs text-red-600">{errors.quote.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="t-rating" className="mb-1 block text-sm font-semibold text-gray-800">
                  Overall rating
                </label>
                <select
                  id="t-rating"
                  {...register("rating", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "star" : "stars"}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-60 sm:w-auto sm:px-10"
              >
                {submitting ? (
                  "Sending…"
                ) : (
                  <>
                    <Send className="h-5 w-5" aria-hidden />
                    Submit feedback
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
            <h2 className="mb-4 font-serif text-3xl font-bold text-gray-900">
              Ready to Begin Your Healing Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Experience the transformative power of energy healing. Every step you take is a step
              toward your true nature.
            </p>
            <Link
              href="/book-session"
              className="inline-flex items-center rounded-2xl bg-primary-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-primary-700"
            >
              Book Your Session <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
