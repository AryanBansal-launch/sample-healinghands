import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 px-4 py-24">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">Product not found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        This item may have been removed or the link is incorrect.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to shop
      </Link>
    </div>
  );
}
