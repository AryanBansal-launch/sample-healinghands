import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Package, ShieldAlert, Sparkles } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import { normalizeProductImages } from "@/lib/normalizeProductImages";
import Product from "@/models/Product";
import ProductImageGallery from "@/components/shop/ProductImageGallery";

type ProductDoc = {
  name: string;
  slug: string;
  description: string;
  benefits: string[];
  usageInstructions: string[];
  safetyNotes: string;
  price: number;
  currency: string;
  images: string[];
  inStock: boolean;
  stockLeft?: number;
};

async function getProduct(slug: string): Promise<ProductDoc | null> {
  await dbConnect();
  const doc = await Product.findOne({ slug, isActive: true }).lean();
  if (!doc) return null;
  const p = JSON.parse(JSON.stringify(doc)) as ProductDoc & { _id?: string };
  const stockLeft =
    typeof p.stockLeft === "number" && Number.isFinite(p.stockLeft)
      ? Math.max(0, Math.floor(p.stockLeft))
      : undefined;
  const inStock = stockLeft !== undefined ? stockLeft > 0 : p.inStock !== false;
  return {
    name: p.name,
    slug: p.slug,
    description: p.description,
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
    usageInstructions: Array.isArray(p.usageInstructions) ? p.usageInstructions : [],
    safetyNotes: p.safetyNotes || "",
    price: p.price,
    currency: p.currency || "INR",
    images: normalizeProductImages(
      Array.isArray(p.images) && p.images.length > 0 ? p.images : undefined
    ),
    inStock,
    stockLeft,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return { title: "Product | The Healing Hands" };
  }
  return {
    title: `${product.name} | Shop | The Healing Hands`,
    description: product.description.slice(0, 155).replace(/\s+/g, " ").trim(),
  };
}

export default async function ProductCatalogPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) {
    notFound();
  }

  const priceLabel =
    product.currency === "INR" ? `₹${product.price}` : `${product.currency} ${product.price}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/shop" className="hover:text-primary-700 font-medium inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to shop
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductImageGallery images={product.images} alt={product.name} />

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 mb-2">
                The Healing Hands — Shop
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">{priceLabel}</span>
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 text-primary-900 px-3 py-1 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" aria-hidden />
                    {typeof product.stockLeft === "number"
                      ? `${product.stockLeft} in stock`
                      : "In stock"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-sm font-semibold">
                    Currently unavailable
                  </span>
                )}
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              {product.inStock ? (
                <Link
                  href={`/shop?open=${encodeURIComponent(product.slug)}`}
                  className="inline-flex justify-center items-center rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-700 transition-colors"
                >
                  Buy now
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed justify-center items-center rounded-2xl bg-gray-200 px-8 py-4 text-lg font-bold text-gray-500 shadow-inner"
                  title="This product is currently out of stock"
                >
                  Buy now
                </button>
              )}
              <Link
                href="/contact"
                className="inline-flex justify-center items-center rounded-2xl border-2 border-primary-200 bg-white px-8 py-4 text-lg font-semibold text-primary-800 hover:bg-primary-50 transition-colors"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {product.benefits.length > 0 && (
            <section className="rounded-2xl bg-white/90 border border-gray-100 p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gold-500" aria-hidden />
                Benefits
              </h2>
              <ul className="space-y-3">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.usageInstructions.length > 0 && (
            <section className="rounded-2xl bg-white/90 border border-gray-100 p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary-600" aria-hidden />
                How to use
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {product.usageInstructions.map((step, i) => (
                  <li key={i} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {product.safetyNotes?.trim() && (
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-6 md:p-8">
            <h2 className="font-serif text-xl font-bold text-amber-950 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" aria-hidden />
              Safety &amp; notes
            </h2>
            <p className="text-amber-950/90 leading-relaxed">{product.safetyNotes}</p>
          </section>
        )}
      </div>
    </div>
  );
}
