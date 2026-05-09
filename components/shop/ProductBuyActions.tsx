"use client";

import Link from "next/link";
import Image from "next/image";
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
    image?: string;
  }[];
  priceRange: { min: number; max: number; showFrom: boolean };
};

function money(currency: string, n: number) {
  return currency === "INR" ? `₹${n}` : `${currency} ${n}`;
}

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type Props = {
  product: ProductBuyActionsProduct;
  selectedVariantId: string;
  onSelectVariant: (id: string) => void;
};

export default function ProductBuyActions({ product, selectedVariantId, onSelectVariant }: Props) {
  const { variants, currency, priceRange } = product;
  const selected = variants.find((v) => v.id === selectedVariantId);
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
    selectedVariantId ? `&variant=${encodeURIComponent(selectedVariantId)}` : ""
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
        <fieldset className="pt-2">
          <legend className="text-sm font-semibold text-gray-700 mb-3">Choose size</legend>
          <div className="flex flex-col gap-2 max-w-md" role="radiogroup" aria-label="Product size">
            {variants.map((v) => {
              const inputId = `variant-${product.slug}-${v.id}`;
              return (
                <label
                  key={v.id}
                  htmlFor={inputId}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors sm:px-4 sm:py-3 ${
                    selectedVariantId === v.id
                      ? "border-primary-600 bg-white shadow-sm ring-1 ring-primary-600/20"
                      : "border-gray-200 bg-white/80 hover:border-primary-300"
                  } ${!v.inStock ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={`product-variant-${product.slug}`}
                    value={v.id}
                    checked={selectedVariantId === v.id}
                    disabled={!v.inStock}
                    onChange={() => onSelectVariant(v.id)}
                    className="h-4 w-4 shrink-0 border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  {v.image ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <Image
                        src={v.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={isRemote(v.image)}
                      />
                    </span>
                  ) : null}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="font-medium text-gray-900">{v.label}</span>
                    <span className="text-sm font-semibold text-primary-800 sm:text-base">
                      {money(currency, v.price)}
                      {!v.inStock && (
                        <span className="ml-2 text-xs font-normal text-gray-500">Unavailable</span>
                      )}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
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
