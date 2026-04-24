"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminProductSchema } from "@/lib/validators";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      benefits: [] as string[],
      usageInstructions: [] as string[],
      safetyNotes: "",
      price: 0,
      currency: "INR",
      images: [] as string[],
      inStock: true,
      isActive: true,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const images = watch("images");

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        benefits: data.benefits?.length ? data.benefits : [],
        usageInstructions: data.usageInstructions?.length ? data.usageInstructions : [],
        safetyNotes: data.safetyNotes ?? "",
        images: data.images?.length ? data.images : ["/spray.jpeg"],
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct._id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchProducts();
        closeModal();
      } else {
        const errBody = await res.json().catch(() => ({}));
        alert(errBody.error || `Save failed (${res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const onFormError = (errs: typeof errors) => {
    const first = Object.values(errs)[0];
    const msg = first && typeof first === "object" && "message" in first ? String(first.message) : null;
    if (msg) alert(msg);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
        usageInstructions: Array.isArray(product.usageInstructions)
          ? product.usageInstructions
          : [],
        safetyNotes: product.safetyNotes ?? "",
        price: typeof product.price === "number" ? product.price : Number(product.price) || 0,
        currency: product.currency || "INR",
        images: product.images?.length ? product.images : ["/spray.jpeg"],
        inStock: product.inStock !== false,
        isActive: product.isActive !== false,
      });
    } else {
      setEditingProduct(null);
      reset({
        name: "",
        slug: "",
        description: "",
        benefits: [],
        usageInstructions: [],
        safetyNotes: "",
        price: 0,
        currency: "INR",
        images: ["/spray.jpeg"], // Default placeholder
        inStock: true,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Products</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 group relative">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => openModal(product)}
                className="p-2 bg-white/90 rounded-full shadow-md text-blue-600 hover:text-blue-800"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 bg-white/90 rounded-full shadow-md text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={product.images[0] || "/spray.jpeg"}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized={String(product.images?.[0] || "").startsWith("http")}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
              <p className="text-primary-600 font-bold">₹{product.price}</p>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                product.isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              )}>
                {product.isActive ? "Active" : "Hidden"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-serif font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onFormError)} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Product Name</label>
                  <input
                    {...register("name")}
                    placeholder="e.g. Healing Spray"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    onChange={(e) => setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-"))}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Slug</label>
                  <input
                    {...register("slug")}
                    placeholder="product-slug"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Price (INR)</label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="flex items-center space-x-8 pt-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("inStock", {
                        setValueAs: (v: unknown) => v === true || v === "on",
                      })}
                      className="w-4 h-4 rounded text-primary-600"
                    />
                    <span className="text-sm font-semibold">In Stock</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isActive", {
                        setValueAs: (v: unknown) => v === true || v === "on",
                      })}
                      className="w-4 h-4 rounded text-primary-600"
                    />
                    <span className="text-sm font-semibold">Active</span>
                  </label>
                </div>
              </div>

              <AdminImageUpload
                label="Product image"
                folder="healinghands/products"
                value={(images && images[0]) || "/spray.jpeg"}
                onChange={(url) =>
                  setValue("images", [url], { shouldValidate: true, shouldDirty: true })
                }
                aspectClass="aspect-square w-full max-w-xs"
              />
              {errors.images && (
                <p className="text-xs text-red-600">{errors.images.message as string}</p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Safety Notes</label>
                <input
                  {...register("safetyNotes")}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                />
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
                  <span>{editingProduct ? "Update Product" : "Add Product"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
