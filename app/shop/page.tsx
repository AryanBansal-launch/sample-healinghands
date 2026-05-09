"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, X, ChevronRight, Layers } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseRequestSchema } from "@/lib/validators";
import type { z } from "zod";

type PurchaseFormValues = z.infer<typeof purchaseRequestSchema>;
import { ShopPageSkeleton } from "@/components/ui/skeleton";
import { buildPurchaseMessage, buildWhatsAppURL } from "@/lib/whatsapp";

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function pickVariantId(product: Record<string, unknown>, preferred?: string | null) {
  const variants = (product.variants ?? []) as { id: string; inStock?: boolean }[];
  if (variants.length === 0) return "";
  if (preferred && variants.some((v) => v.id === preferred)) return preferred;
  const inStock = variants.find((v) => v.inStock)?.id;
  return inStock ?? variants[0]?.id ?? "";
}

function ShopPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const handledOpenSlug = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      product: "",
      productName: "",
      quantity: 1,
      totalAmount: 0,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: {
        country: "India",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
  });

  const openPurchaseModal = useCallback(
    (product: any, qty = 1, preferredVariantId?: string | null) => {
      if (product?.inStock === false) return;
      const vid = pickVariantId(product, preferredVariantId ?? undefined);
      const variants = product.variants ?? [];
      const sel = variants.find((v: any) => v.id === vid);
      if (sel && sel.inStock === false) return;
      const unit = sel?.price ?? product.price ?? 0;

      setSelectedProduct(product);
      setSelectedVariantId(vid);
      setQuantity(qty);
      setIsModalOpen(true);
      reset({
        product: product._id,
        productName: product.name,
        quantity: qty,
        variantId: vid || undefined,
        variantLabel: sel?.label,
        totalAmount: unit * qty,
        shippingAddress: { country: "India" },
      });
    },
    [reset]
  );

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (loading || !products.length) return;
    const slug = searchParams.get("open");
    const variantParam = searchParams.get("variant");
    if (!slug) {
      handledOpenSlug.current = null;
      return;
    }
    if (handledOpenSlug.current === slug) return;
    const p = products.find((x: any) => x.slug === slug);
    if (p) {
      handledOpenSlug.current = slug;
      router.replace("/shop", { scroll: false });
      if (p.inStock !== false) openPurchaseModal(p, 1, variantParam);
    }
  }, [loading, products, searchParams, openPurchaseModal, router]);

  useEffect(() => {
    if (!selectedProduct) return;
    const variants = selectedProduct.variants ?? [];
    const sel = variants.find((v: any) => v.id === selectedVariantId);
    const unit = sel?.price ?? selectedProduct.price ?? 0;
    const maxQ =
      typeof sel?.stockLeft === "number" && Number.isFinite(sel.stockLeft)
        ? Math.max(0, Math.floor(sel.stockLeft))
        : undefined;
    let q = quantity;
    if (maxQ !== undefined) {
      q = Math.min(q, maxQ);
    }
    if (q < 1 && maxQ !== undefined && maxQ > 0) q = 1;
    if (q !== quantity) setQuantity(q);

    setValue("variantId", selectedVariantId || undefined);
    setValue("variantLabel", sel?.label);
    setValue("productName", selectedProduct.name);
    setValue("quantity", q);
    setValue("totalAmount", unit * q);
  }, [quantity, selectedProduct, selectedVariantId, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const address = `${data.shippingAddress.addressLine1}, ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}`;
        const message = buildPurchaseMessage({
          productName: data.productName,
          quantity: data.quantity,
          totalAmount: data.totalAmount,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          shippingAddress: address,
        });
        const whatsappUrl = buildWhatsAppURL(message);
        window.open(whatsappUrl, "_blank");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <ShopPageSkeleton />;
  }

  const modalVariant =
    selectedProduct?.variants?.find((v: any) => v.id === selectedVariantId) ?? null;
  const modalUnit = modalVariant ? modalVariant.price : selectedProduct?.price ?? 0;
  const modalMax =
    modalVariant && typeof modalVariant.stockLeft === "number"
      ? Math.max(0, Math.floor(modalVariant.stockLeft))
      : undefined;
  const modalShowVariants =
    Array.isArray(selectedProduct?.variants) && selectedProduct.variants.length > 1;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">Healing Shop</h1>
          <p className="text-xl text-gray-600">Bring the healing energy home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const img = product.images?.[0] || "/products/spray.jpeg";
            const variantList = Array.isArray(product.variants) ? product.variants : [];
            const variantCount = variantList.length;
            const hasMultipleVariants = variantCount > 1;
            const variantLabels = variantList
              .slice(0, 4)
              .map((v: { label?: string }) => String(v?.label ?? "").trim())
              .filter(Boolean);

            return (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link href={`/shop/${product.slug}`} className="relative aspect-square block group">
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={isRemoteImage(img)}
                  />
                  {hasMultipleVariants && (
                    <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900/85 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md backdrop-blur-sm">
                        <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {variantCount} sizes
                      </span>
                    </div>
                  )}
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{product.description}</p>
                  {hasMultipleVariants && variantLabels.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {variantLabels.map((label: string, i: number) => (
                        <span
                          key={`${label}-${i}`}
                          className="rounded-lg border border-primary-100 bg-primary-50/90 px-2.5 py-1 text-xs font-semibold text-primary-900"
                        >
                          {label}
                        </span>
                      ))}
                      {variantCount > variantLabels.length && (
                        <span className="self-center text-xs font-medium text-gray-500">
                          +{variantCount - variantLabels.length} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">
                        {product.priceRange?.showFrom
                          ? `From ₹${product.priceRange.min}`
                          : `₹${product.price}`}
                      </span>
                      {hasMultipleVariants && product.priceRange?.max != null && (
                        <p className="mt-1 text-sm text-gray-500">
                          Up to ₹{product.priceRange.max} · pick a size on the product page
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="flex-1 inline-flex justify-center items-center gap-2 rounded-2xl border-2 border-primary-200 bg-white px-4 py-3 font-semibold text-primary-800 hover:bg-primary-50 transition-colors"
                    >
                      View details
                      <ChevronRight className="w-4 h-4" aria-hidden />
                    </Link>
                    <button
                      type="button"
                      disabled={product.inStock === false}
                      title={product.inStock === false ? "This product is out of stock" : undefined}
                      onClick={() => openPurchaseModal(product, 1)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:hover:bg-gray-200 bg-primary-600 text-white hover:bg-primary-700"
                    >
                      <ShoppingCart className="w-5 h-5 shrink-0" aria-hidden />
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                <h2 className="text-2xl font-serif font-bold">Complete Your Purchase</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-full"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto">
                <input type="hidden" {...register("product")} />
                <input type="hidden" {...register("productName")} />
                <input type="hidden" {...register("variantId")} />
                <input type="hidden" {...register("variantLabel")} />
                <input type="hidden" {...register("quantity", { valueAsNumber: true })} />
                <input type="hidden" {...register("totalAmount", { valueAsNumber: true })} />

                <div className="bg-primary-50 p-4 rounded-2xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{selectedProduct?.name}</p>
                    <p className="text-sm text-gray-600">Unit Price: ₹{modalUnit}</p>
                    {modalShowVariants && (
                      <fieldset className="block w-full max-w-md pt-2">
                        <legend className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Choose size
                        </legend>
                        <div
                          className="mt-2 flex flex-col gap-2"
                          role="radiogroup"
                          aria-label="Product size"
                        >
                          {selectedProduct.variants.map((v: any) => {
                            const inputId = `checkout-variant-${v.id}`;
                            return (
                              <label
                                key={v.id}
                                htmlFor={inputId}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-sm transition-colors ${
                                  selectedVariantId === v.id
                                    ? "border-primary-600 ring-1 ring-primary-600/20"
                                    : "border-gray-200 hover:border-primary-300"
                                } ${v.inStock === false ? "cursor-not-allowed opacity-50" : ""}`}
                              >
                                <input
                                  id={inputId}
                                  type="radio"
                                  name="checkout-product-variant"
                                  value={v.id}
                                  checked={selectedVariantId === v.id}
                                  disabled={v.inStock === false}
                                  onChange={() => setSelectedVariantId(v.id)}
                                  className="h-4 w-4 shrink-0 border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {v.image ? (
                                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <Image
                                      src={v.image}
                                      alt=""
                                      fill
                                      className="object-cover"
                                      sizes="44px"
                                      unoptimized={isRemoteImage(v.image)}
                                    />
                                  </span>
                                ) : null}
                                <span className="flex min-w-0 flex-1 justify-between gap-2">
                                  <span className="font-medium text-gray-900">{v.label}</span>
                                  <span className="shrink-0 font-semibold text-primary-800">
                                    ₹{v.price}
                                    {v.inStock === false && (
                                      <span className="ml-1.5 text-xs font-normal text-gray-500">
                                        Unavailable
                                      </span>
                                    )}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold w-8 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          modalMax !== undefined ? Math.min(modalMax, quantity + 1) : quantity + 1
                        )
                      }
                      disabled={modalMax !== undefined && quantity >= modalMax}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    {...register("customerName")}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                  <input
                    {...register("customerEmail")}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                  <input
                    {...register("customerPhone")}
                    placeholder="Mobile Number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>

                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">Shipping Address</p>
                  <input
                    {...register("shippingAddress.addressLine1")}
                    placeholder="Address Line 1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      {...register("shippingAddress.city")}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                    <input
                      {...register("shippingAddress.state")}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                    <input
                      {...register("shippingAddress.pincode")}
                      placeholder="Pincode"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-gray-600">
                    Total Amount:{" "}
                    <span className="text-2xl font-bold text-gray-900 ml-2">
                      ₹{modalUnit * quantity}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={
                      !modalVariant?.inStock ||
                      quantity < 1 ||
                      (modalMax !== undefined && modalMax === 0)
                    }
                    className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
                  >
                    Proceed to Purchase
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

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageInner />
    </Suspense>
  );
}
