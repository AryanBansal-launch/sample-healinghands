"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, MessageCircle, CheckCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseRequestSchema } from "@/lib/validators";
import { buildPurchaseMessage, buildWhatsAppURL } from "@/lib/whatsapp";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(purchaseRequestSchema),
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const openPurchaseModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    reset({
      product: product._id,
      productName: product.name,
      quantity: quantity,
      totalAmount: product.price * quantity,
    });
  };

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

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading shop...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">Healing Shop</h1>
          <p className="text-xl text-gray-600">Bring the healing energy home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-6 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  <button
                    onClick={() => openPurchaseModal(product)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
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
                    > - </button>
                    <span className="font-bold">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold"
                    > + </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input {...register("customerName")} placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                  <input {...register("customerEmail")} placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                  <input {...register("customerPhone")} placeholder="Mobile Number" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>

                <div className="space-y-4">
                  <p className="font-semibold text-gray-700">Shipping Address</p>
                  <input {...register("shippingAddress.addressLine1")} placeholder="Address Line 1" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <input {...register("shippingAddress.city")} placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    <input {...register("shippingAddress.state")} placeholder="State" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    <input {...register("shippingAddress.pincode")} placeholder="Pincode" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-gray-600">
                    Total Amount: <span className="text-2xl font-bold text-gray-900 ml-2">₹{selectedProduct?.price * quantity}</span>
                  </div>
                  <button type="submit" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 shadow-lg">
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
