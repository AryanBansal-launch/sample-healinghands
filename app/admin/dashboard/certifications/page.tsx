"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      description: "",
      certificateImage: "/logo.jpeg",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await fetch("/api/admin/certifications");
      const data = await res.json();
      setCerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const url = editingCert
        ? `/api/admin/certifications/${editingCert._id}`
        : "/api/admin/certifications";
      const method = editingCert ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchCerts();
        closeModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
      if (res.ok) fetchCerts();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (cert: any = null) => {
    if (cert) {
      setEditingCert(cert);
      reset(cert);
    } else {
      setEditingCert(null);
      reset({
        title: "",
        description: "",
        certificateImage: "/logo.jpeg",
        order: certs.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCert(null);
    reset();
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Certifications</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <div key={cert._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 group relative">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => openModal(cert)}
                className="p-2 bg-white/90 rounded-full shadow-md text-blue-600 hover:text-blue-800"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cert._id)}
                className="p-2 bg-white/90 rounded-full shadow-md text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <Image 
                src={cert.certificateImage || "/logo.jpeg"} 
                alt={cert.title} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{cert.title}</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-lg text-gray-500">#{cert.order}</span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">{cert.description}</p>
            <div className="flex items-center space-x-2 pt-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                cert.isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              )}>
                {cert.isActive ? "Active" : "Hidden"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-serif font-bold">
                  {editingCert ? "Edit Certification" : "Add New Certification"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Certification Title</label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Master Pranic Healer"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Brief details about the certification..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message as string}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Order Number</label>
                    <input
                      type="number"
                      {...register("order", { valueAsNumber: true })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-8 pt-8">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded text-primary-600" />
                      <span className="text-sm font-semibold">Active</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Certificate Image (Placeholder for now)</label>
                  <input
                    {...register("certificateImage")}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 italic">Manual image uploads will be enabled soon via Cloudinary.</p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg flex items-center space-x-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{editingCert ? "Update" : "Add Certification"}</span>
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
