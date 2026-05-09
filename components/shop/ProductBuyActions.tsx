"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export type ProductBuyActionsProduct = {
  name: string;
  slug: string;
  inStock: boolean;
  currency: string;
  price: number;
  stockLeft: number;
  variants: {
    id: string;
    label: string;
    price: number;
    stockLeft: number;
    inStock: boolean;
  }[];
  priceRange: { min: number; max: number; showFrom: boolean };
};

function money(currency: string, n: number) {
  return currency === "INR" ? `₹${n}` : `${currency} ${n}`;
}

export default function ProductBuyActions({ product }: { product: ProductBuyActionsProduct }) {
  const { variants, currency, priceRange } = product;
  const [vid, setVid] = useState<string>("");

  useEffect(() => {
    const first = variants.find((v) => v.inStock) ?? variants[0];
    setVid(first?.id ?? "");
  }, [variants]);

  const selected = variants.find((v) => v.id === vid);
  const showVariantPicker = variants.length > 1;
  const displayPrice = selected ? selected.price : product.price;
  const priceTitle = showVariantPicker
    ? money(currency, displayPrice)
    : priceRange.showFrom
      ? `From ${money(currency, priceRange.min)}`
      : money(currency, displayPrice);

  const selectedStock =
    selected && typeof selected.stockLeft === "number" ? selected.stockLeft : product.stockLeft;
  const canBuy = Boolean(product.inStock && selected?.inStock);
  const buyHref = `/shop?open=${encodeURIComponent(product.slug)}${
    vid ? `&variant=${encodeURIComponent(vid)}` : ""
  }`;

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="text-3xl md:text-4xl font-bold text-gray-900">{priceTitle}</span>
        {selected && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 text-primary-900 px-3 py-1 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" aria-hidden />
            {selectedStock > 0 ? `${selectedStock} in stock` : "Out of stock"}
          </span>
        )}
      </div>

      {showVariantPicker && (
        <div className="pt-2">
          <label htmlFor="product-variant" className="sr-only">
            Choose option
          </label>
          <select
            id="product-variant"
            value={vid}
            onChange={(e) => setVid(e.target.value)}
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id} disabled={!v.inStock}>
                {v.label} — {money(currency, v.price)}
                {!v.inStock ? " (Unavailable)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {canBuy ? (
          <Link
            href={buyHref}
            className="inline-flex justify-center items-center rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-700 transition-colors"
          >
            Buy now
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed justify-center items-center rounded-2xl bg-gray-200 px-8 py-4 text-lg font-bold text-gray-500 shadow-inner"
            title="This option is currently unavailable"
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
    </>
  );
}
