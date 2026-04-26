"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2, Star } from "lucide-react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { z } from "zod";

type TestimonialForm = z.infer<typeof testimonialSchema>;

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      clientName: "",
      quote: "",
      tagline: "",
      rating: 5,
      isActive: true,
      order: 0,
      source: "admin",
      submitterEmail: "",
    },
  });

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const pending = items.filter(
    (t) => (t.source || "admin") === "customer" && t.isActive === false
  );

  const onSubmit = async (data: TestimonialForm) => {
    setSubmitting(true);
    try {
      const url = editing
        ? `/api/admin/testimonials/${editing._id}`
        : "/api/admin/testimonials";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: data.source || "admin",
          submitterEmail: data.submitterEmail?.trim() || "",
        }),
      });
      if (res.ok) {
        await fetchAll();
        closeModal();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || `Save failed (${res.status})`);
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const onFormError = (errs: FieldErrors<TestimonialForm>) => {
    const first = Object.values(errs)[0];
    const msg =
      first && typeof first === "object" && "message" in first
        ? String((first as { message?: string }).message)
        : null;
    if (msg) alert(msg);
  };

  const approve = async (t: any) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: t.clientName,
          quote: t.quote,
          tagline: t.tagline,
          rating: t.rating ?? 5,
          isActive: true,
          order: typeof t.order === "number" ? t.order : Number(t.order) || 0,
          source: t.source || "customer",
          submitterEmail: t.submitterEmail || "",
        }),
      });
      if (res.ok) fetchAll();
      else alert("Approve failed");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial permanently?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const openModal = (t: any | null = null) => {
    if (t) {
      setEditing(t);
      reset({
        clientName: t.clientName ?? "",
        quote: t.quote ?? "",
        tagline: t.tagline ?? "",
        rating: typeof t.rating === "number" ? t.rating : 5,
        isActive: t.isActive !== false,
        order: typeof t.order === "number" ? t.order : Number(t.order) || 0,
        source: (t.source as "admin" | "customer") || "admin",
        submitterEmail: t.submitterEmail || "",
      });
    } else {
      setEditing(null);
      reset({
        clientName: "",
        quote: "",
        tagline: "",
        rating: 5,
        isActive: true,
        order: items.length + 1,
        source: "admin",
        submitterEmail: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    reset();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Testimonials</h1>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700 sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add testimonial
        </button>
      </div>

      {pending.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-amber-900">
            Pending customer submissions ({pending.length})
          </h2>
          <p className="mb-4 text-sm text-amber-800">
            Approve to show on the public testimonials page, edit first if you want to adjust
            wording, or delete spam.
          </p>
          <ul className="space-y-4">
            {pending.map((t) => (
              <li
                key={t._id}
                className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-gray-900">{t.clientName}</p>
                {t.submitterEmail ? (
                  <p className="text-xs text-gray-500">{t.submitterEmail}</p>
                ) : null}
                <p className="mt-2 line-clamp-3 text-sm italic text-gray-600">&quot;{t.quote}&quot;</p>
                <p className="mt-1 text-xs font-medium text-primary-600">{t.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => approve(t)}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & publish
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal(t)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Edit then publish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t._id)}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <div
            key={t._id}
            className="group relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => openModal(t)}
                className="rounded-full bg-white/90 p-2 text-blue-600 shadow-md hover:text-blue-800"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t._id)}
                className="rounded-full bg-white/90 p-2 text-red-600 shadow-md hover:text-red-800"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  t.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                )}
              >
                {t.isActive ? "Published" : "Hidden"}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {(t.source || "admin") === "customer" ? "From customer" : "Admin"}
              </span>
            </div>
            <div className="mb-3 flex gap-0.5">
              {[...Array(t.rating || 5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-500" />
              ))}
            </div>
            <p className="line-clamp-4 text-sm italic leading-relaxed text-gray-600">
              &quot;{t.quote}&quot;
            </p>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="font-bold text-gray-900">{t.clientName}</p>
              <p className="text-sm font-medium text-primary-600">{t.tagline}</p>
              <p className="mt-1 text-xs text-gray-400">Order #{t.order ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6">
                <h2 className="font-serif text-2xl font-bold">
                  {editing ? "Edit testimonial" : "Add testimonial"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full p-2 hover:bg-gray-200"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit, onFormError)}
                className="space-y-5 overflow-y-auto p-8"
              >
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Client name (as shown on site)</label>
                  <input
                    {...register("clientName")}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.clientName && (
                    <p className="text-xs text-red-500">{errors.clientName.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Short tagline</label>
                  <input
                    {...register("tagline")}
                    placeholder="e.g. Emotional relief and peace"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.tagline && (
                    <p className="text-xs text-red-500">{errors.tagline.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Full quote / experience</label>
                  <textarea
                    {...register("quote")}
                    rows={6}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.quote && <p className="text-xs text-red-500">{errors.quote.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Rating (1–5)</label>
                    <select
                      {...register("rating", { valueAsNumber: true })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} stars
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Sort order</label>
                    <input
                      type="number"
                      {...register("order", { valueAsNumber: true })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Submitter email (optional)</label>
                  <input
                    {...register("submitterEmail")}
                    type="email"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Source</label>
                  <select
                    {...register("source")}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isActive", {
                      setValueAs: (v: unknown) => v === true || v === "on",
                    })}
                    className="h-4 w-4 rounded text-primary-600"
                  />
                  <span className="text-sm font-semibold">Published on website</span>
                </label>
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-gray-200 px-6 py-2 font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2 font-bold text-white shadow-lg hover:bg-primary-700 disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editing ? "Save" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
