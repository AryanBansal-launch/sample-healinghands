"use client";

import { AdminGridCardsSkeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminProductSchema } from "@/lib/validators";
import type { z } from "zod";

type AdminProductFormValues = z.infer<typeof adminProductSchema>;
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<AdminProductFormValues>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      benefits: [] as string[],
      usageInstructions: [] as string[],
      safetyNotes: "",
      currency: "INR",
      images: [] as string[],
      variants: [{ label: "Standard", price: 0, stockLeft: 10, image: "" }],
      isActive: true,
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
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

  const images = watch("images") as string[] | undefined;
  const imageSlots =
    images && images.length > 0 ? images : ["/products/spray.jpeg"];

  const setImages = (next: string[]) => {
    setValue("images", next, { shouldValidate: true, shouldDirty: true });
  };

  const addImageSlot = () => {
    const base = images && images.length > 0 ? [...images] : ["/products/spray.jpeg"];
    setImages([...base, "/products/spray.jpeg"]);
  };

  const removeImageAt = (index: number) => {
    const base = images && images.length > 0 ? [...images] : ["/products/spray.jpeg"];
    if (base.length <= 1) return;
    setImages(base.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const base = images && images.length > 0 ? [...images] : ["/products/spray.jpeg"];
    const j = index + direction;
    if (j < 0 || j >= base.length) return;
    const copy = [...base];
    [copy[index], copy[j]] = [copy[j], copy[index]];
    setImages(copy);
  };

  const onSubmit = async (data: any) => {
    setFormMessage(null);
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        benefits: data.benefits?.length ? data.benefits : [],
        usageInstructions: data.usageInstructions?.length ? data.usageInstructions : [],
        safetyNotes: data.safetyNotes ?? "",
        images: data.images?.length ? data.images : ["/products/spray.jpeg"],
        variants: data.variants?.length ? data.variants : [{ label: "Standard", price: 0, stockLeft: 0 }],
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
        setFormMessage({
          type: "error",
          text: String(errBody.error || `Save failed (${res.status})`),
        });
      }
    } catch (err) {
      console.error(err);
      setFormMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setSubmitting(false);
    }
  };

  const onFormError = (errs: typeof errors) => {
    const first = Object.values(errs)[0];
    const msg = first && typeof first === "object" && "message" in first ? String(first.message) : null;
    if (msg) setFormMessage({ type: "error", text: msg });
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
      const variantRows =
        Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants.map((v: Record<string, unknown>) => ({
              label: String(v.label ?? ""),
              price: typeof v.price === "number" ? v.price : Number(v.price) || 0,
              stockLeft:
                typeof v.stockLeft === "number"
                  ? v.stockLeft
                  : Math.floor(Number(v.stockLeft) || 0),
              image: typeof v.image === "string" ? v.image : "",
              _id: v._id ? String(v._id) : undefined,
            }))
          : [
              {
                label: "Standard",
                price: typeof product.price === "number" ? product.price : Number(product.price) || 0,
                stockLeft:
                  typeof product.stockLeft === "number"
                    ? product.stockLeft
                    : product.inStock !== false
                      ? 10
                      : 0,
              },
            ];
      reset({
        name: product.name ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
        usageInstructions: Array.isArray(product.usageInstructions)
          ? product.usageInstructions
          : [],
        safetyNotes: product.safetyNotes ?? "",
        currency: product.currency || "INR",
        images: product.images?.length ? product.images : ["/products/spray.jpeg"],
        variants: variantRows,
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
        currency: "INR",
        images: ["/products/spray.jpeg"],
        variants: [{ label: "Standard", price: 0, stockLeft: 10, image: "" }],
        isActive: true,
      });
    }
    setFormMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormMessage(null);
    reset();
  };

  if (loading) return <AdminGridCardsSkeleton count={6} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900 sm:text-3xl">Manage Products</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex w-full shrink-0 items-center justify-center space-x-2 rounded-xl bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 sm:w-auto"
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
                src={product.images[0] || "/products/spray.jpeg"}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized={String(product.images?.[0] || "").startsWith("http")}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
              <p className="text-primary-600 font-bold">
                {Array.isArray(product.variants) && product.variants.length > 1
                  ? `From ₹${Math.min(
                      ...product.variants.map((v: { price?: number }) =>
                        typeof v.price === "number" ? v.price : Number(v.price) || 0
                      )
                    )}`
                  : `₹${product.price}`}
              </p>
              <p className="text-sm text-gray-600">
                Stock:{" "}
                <span className="font-semibold text-gray-800">
                  {typeof product.stockLeft === "number" ? product.stockLeft : "—"}
                </span>
                {product.inStock ? (
                  <span className="text-green-600"> · In stock</span>
                ) : (
                  <span className="text-red-600"> · Out of stock</span>
                )}
              </p>
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
            <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <h2 className="text-2xl font-serif font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onFormError)} className="p-8 space-y-6 overflow-y-auto">
              {formMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {formMessage.text}
                </div>
              )}
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

              <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-900">Variants</label>
                    <p className="text-xs text-gray-500">
                      Add sizes or volumes — each row has its own price and stock (e.g. 50 ml, 100 ml).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendVariant({ label: "", price: 0, stockLeft: 0, image: "" })}
                    className="inline-flex items-center gap-1 rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add variant
                  </button>
                </div>
                {variantFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-3 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <input type="hidden" {...register(`variants.${index}._id` as const)} />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                      <div className="shrink-0 space-y-1">
                        <label className="text-xs font-semibold text-gray-600">Variant image</label>
                        <p className="text-[10px] text-gray-500 max-w-[200px] leading-snug">
                          Optional. Shown first in the shop gallery when this size is selected.
                        </p>
                        <AdminImageUpload
                          label=""
                          folder="healinghands/products"
                          value={
                            (watch(`variants.${index}.image` as const) as string | undefined) || ""
                          }
                          onChange={(url) =>
                            setValue(`variants.${index}.image` as const, url, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          aspectClass="aspect-square w-full max-w-[120px]"
                        />
                      </div>
                      <input type="hidden" {...register(`variants.${index}.image`)} />
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_minmax(0,120px)_minmax(0,120px)_auto]">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Label</label>
                      <input
                        {...register(`variants.${index}.label`)}
                        placeholder="e.g. 50 ml"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.variants?.[index]?.label && (
                        <p className="text-xs text-red-500">
                          {(errors.variants[index] as { label?: { message?: string } })?.label
                            ?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        {...register(`variants.${index}.price`, { valueAsNumber: true })}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Stock</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        {...register(`variants.${index}.stockLeft`, { valueAsNumber: true })}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        disabled={variantFields.length <= 1}
                        onClick={() => removeVariant(index)}
                        className="rounded-xl border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                    </div>
                  </div>
                ))}
                {errors.variants && typeof errors.variants.message === "string" && (
                  <p className="text-xs text-red-500">{errors.variants.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-8 pt-2">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isActive", {
                      setValueAs: (v: unknown) => v === true || v === "on",
                    })}
                    className="h-4 w-4 rounded text-primary-600"
                  />
                  <span className="text-sm font-semibold">Active (visible on shop)</span>
                </label>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Product images</label>
                  <p className="mt-1 text-xs text-gray-500">
                    First image is the main thumbnail on the shop. All images appear in the product
                    page carousel. Upload or replace each slot; use arrows to change order.
                  </p>
                </div>
                {imageSlots.map((url, index) => (
                  <div
                    key={`product-img-${index}`}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:flex-row sm:items-start"
                  >
                    <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-center">
                      <span className="w-6 text-center text-xs font-bold text-gray-400">{index + 1}</span>
                      <div className="flex flex-row gap-1 sm:flex-col">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveImage(index, -1)}
                          className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move image up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index >= imageSlots.length - 1}
                          onClick={() => moveImage(index, 1)}
                          className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move image down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <AdminImageUpload
                        label={index === 0 ? "Primary image" : `Image ${index + 1}`}
                        folder="healinghands/products"
                        value={url}
                        onChange={(newUrl) => {
                          const base =
                            images && images.length > 0 ? [...images] : ["/products/spray.jpeg"];
                          base[index] = newUrl;
                          setImages(base);
                        }}
                        aspectClass="aspect-square w-full max-w-[220px]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={imageSlots.length <= 1}
                      onClick={() => removeImageAt(index)}
                      className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageSlot}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50 sm:w-auto sm:px-6"
                >
                  <Plus className="h-4 w-4" />
                  Add another image
                </button>
                {errors.images && (
                  <p className="text-xs text-red-600">
                    {typeof errors.images === "object" && errors.images !== null && "message" in errors.images
                      ? String((errors.images as { message: string }).message)
                      : "Check product images."}
                  </p>
                )}
              </div>

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
