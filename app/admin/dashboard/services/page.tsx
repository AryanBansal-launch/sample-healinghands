"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      features: [] as string[],
      icon: "Sparkles",
      image: "",
      isProgram: false,
      programDetails: {
        sessions: 0,
        price: 0,
        currency: "INR",
        highlights: [] as string[],
      },
      order: 0,
      isActive: true,
    },
  });

  const isProgram = watch("isProgram");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const submissionData = {
        ...data,
        features: data.features || [],
        programDetails: data.isProgram 
          ? {
              sessions: Number(data.programDetails?.sessions || 0),
              price: Number(data.programDetails?.price || 0),
              currency: data.programDetails?.currency || "INR",
              highlights: data.programDetails?.highlights || []
            } 
          : undefined
      };

      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      console.log("Submitting Data:", submissionData);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        fetchServices();
        closeModal();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || 'Failed to save service'}`);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const onFormError = (errs: any) => {
    console.log("Form Validation Errors:", errs);
    // You could also set a state here to show a global error message
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };


  const openModal = (service: any = null) => {
    if (service) {
      setEditingService(service);
      reset(service);
    } else {
      setEditingService(null);
      reset({
        title: "",
        slug: "",
        shortDescription: "",
        fullDescription: "",
        features: ["New Feature"],
        icon: "Sparkles",
        image: "",
        isProgram: false,
        programDetails: {
          sessions: 0,
          price: 0,
          currency: "INR",
          highlights: [],
        },
        order: services.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset();
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900 sm:text-3xl">Manage Services</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex w-full shrink-0 items-center justify-center space-x-2 rounded-xl bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 group relative">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => openModal(service)}
                className="p-2 bg-white/90 rounded-full shadow-md text-blue-600 hover:text-blue-800"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="p-2 bg-white/90 rounded-full shadow-md text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary-50 p-3 rounded-2xl">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">{service.shortDescription}</p>
            <div className="flex items-center space-x-2 pt-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                service.isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              )}>
                {service.isActive ? "Active" : "Hidden"}
              </span>
              {service.isProgram && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700">
                  Program
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-1 bg-gray-50 rounded-lg text-gray-400">
                Order: {service.order}
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
              <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <h2 className="text-2xl font-serif font-bold">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit, onFormError)} className="p-8 space-y-6 overflow-y-auto">
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    Please correct the errors before saving.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Service Title</label>
                    <input
                      {...register("title")}
                      placeholder="e.g. Reiki Healing"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={(e) => setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-"))}
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Slug</label>
                    <input
                      {...register("slug")}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Short Description</label>
                  <input
                    {...register("shortDescription")}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.shortDescription && <p className="text-xs text-red-500">{errors.shortDescription.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Description</label>
                  <textarea
                    {...register("fullDescription")}
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.fullDescription && <p className="text-xs text-red-500">{errors.fullDescription.message as string}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Icon</label>
                    <select
                      {...register("icon")}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Sparkles">Sparkles</option>
                      <option value="Shield">Shield</option>
                      <option value="Gem">Gem</option>
                      <option value="Activity">Activity</option>
                      <option value="Heart">Heart</option>
                      <option value="Users">Users</option>
                      <option value="Baby">Baby</option>
                      <option value="Home">Home</option>
                      <option value="Coins">Coins</option>
                      <option value="Wind">Wind</option>
                      <option value="Briefcase">Briefcase</option>
                      <option value="Scale">Scale</option>
                      <option value="Lightbulb">Lightbulb</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Display Order</label>
                    <input
                      type="number"
                      {...register("order", { valueAsNumber: true })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm font-semibold">Active</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" {...register("isProgram")} className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm font-semibold">Is Structured Program?</span>
                  </label>
                </div>

                {isProgram && (
                  <div className="p-4 bg-gold-50/50 rounded-2xl border border-gold-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gold-700 uppercase">Sessions</label>
                        <input
                          type="number"
                          {...register("programDetails.sessions", { valueAsNumber: true })}
                          className="w-full px-4 py-2 rounded-xl border border-gold-200 focus:ring-2 focus:ring-gold-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gold-700 uppercase">Price (INR)</label>
                        <input
                          type="number"
                          {...register("programDetails.price", { valueAsNumber: true })}
                          className="w-full px-4 py-2 rounded-xl border border-gold-200 focus:ring-2 focus:ring-gold-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                    <span>{editingService ? "Update Service" : "Add Service"}</span>
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
