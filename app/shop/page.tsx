"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, X, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseRequestSchema } from "@/lib/validators";
import { ShopPageSkeleton } from "@/components/ui/skeleton";
import { buildPurchaseMessage, buildWhatsAppURL } from "@/lib/whatsapp";

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function ShopPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const handledOpenSlug = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(purchaseRequestSchema),
  });

  const openPurchaseModal = useCallback(
    (product: any, qty = 1) => {
      if (product?.inStock === false) return;
      setSelectedProduct(product);
      setQuantity(qty);
      setIsModalOpen(true);
      reset({
        product: product._id,
        productName: product.name,
        quantity: qty,
        totalAmount: product.price * qty,
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
    if (!slug) {
      handledOpenSlug.current = null;
      return;
    }
    if (handledOpenSlug.current === slug) return;
    const p = products.find((x: any) => x.slug === slug);
    if (p) {
      handledOpenSlug.current = slug;
      router.replace("/shop", { scroll: false });
      if (p.inStock !== false) openPurchaseModal(p, 1);
    }
  }, [loading, products, searchParams, openPurchaseModal, router]);

  useEffect(() => {
    if (!selectedProduct) return;
    reset({
      product: selectedProduct._id,
      productName: selectedProduct.name,
      quantity,
      totalAmount: selectedProduct.price * quantity,
    });
  }, [quantity, selectedProduct, reset]);

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
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
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
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto">
                <div className="bg-primary-50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{selectedProduct?.name}</p>
                    <p className="text-sm text-gray-600">Unit Price: ₹{selectedProduct?.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold"
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
                      ₹{selectedProduct?.price * quantity}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 shadow-lg"
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
