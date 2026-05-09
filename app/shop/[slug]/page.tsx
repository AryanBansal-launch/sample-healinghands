import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Package, ShieldAlert, Sparkles } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import { normalizeProductImages } from "@/lib/normalizeProductImages";
import { serializeProductForPublic } from "@/lib/productVariants";
import Product from "@/models/Product";
import ProductShopColumn from "@/components/shop/ProductShopColumn";
import type { ProductBuyActionsProduct } from "@/components/shop/ProductBuyActions";

async function getProduct(slug: string): Promise<ProductBuyActionsProduct & {
  description: string;
  benefits: string[];
  usageInstructions: string[];
  safetyNotes: string;
  images: string[];
} | null> {
  await dbConnect();
  const doc = await Product.findOne({ slug, isActive: true }).lean();
  if (!doc) return null;
  const raw = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
  raw.images = normalizeProductImages(
    Array.isArray(raw.images) && (raw.images as string[]).length > 0
      ? (raw.images as string[])
      : undefined
  );
  const pub = serializeProductForPublic(raw) as Record<string, unknown>;
  const variants = (pub.variants ?? []) as ProductBuyActionsProduct["variants"];
  const priceRange = (pub.priceRange ?? {
    min: Number(pub.price) || 0,
    max: Number(pub.price) || 0,
    showFrom: false,
  }) as ProductBuyActionsProduct["priceRange"];

  return {
    name: String(pub.name ?? ""),
    slug: String(pub.slug ?? ""),
    description: String(pub.description ?? ""),
    benefits: Array.isArray(pub.benefits) ? (pub.benefits as string[]) : [],
    usageInstructions: Array.isArray(pub.usageInstructions)
      ? (pub.usageInstructions as string[])
      : [],
    safetyNotes: String(pub.safetyNotes ?? ""),
    images: Array.isArray(pub.images) ? (pub.images as string[]) : [],
    inStock: pub.inStock !== false,
    currency: String(pub.currency ?? "INR"),
    price: Number(pub.price) || 0,
    stockLeft: Number(pub.stockLeft) || 0,
    variants,
    priceRange,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lavender-50 to-gold-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/shop" className="hover:text-primary-700 font-medium inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to shop
          </Link>
        </nav>

        <ProductShopColumn product={product} />

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
