import mongoose from "mongoose";
import { normalizeProductImageUrl } from "@/lib/normalizeProductImages";

/** Sentinel id for products stored without a `variants` array (legacy root price/stock). */
export const LEGACY_VARIANT_ID = "legacy";

export type PublicProductVariant = {
  id: string;
  label: string;
  price: number;
  stockLeft: number;
  inStock: boolean;
  /** Normalized URL when this variant has its own image. */
  image?: string;
};

export type PriceRangeMeta = {
  min: number;
  max: number;
  showFrom: boolean;
};

function stockLeftFromUnknown(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.floor(v));
  return 0;
}

/** Effective sellable SKUs for a product document (lean or hydrated). */
export function getEffectiveVariants(product: Record<string, unknown>): PublicProductVariant[] {
  const raw = product.variants;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((v: Record<string, unknown>) => {
      const stockLeft = stockLeftFromUnknown(v.stockLeft);
      const imgRaw = typeof v.image === "string" ? v.image.trim() : "";
      const image = imgRaw ? normalizeProductImageUrl(imgRaw) : undefined;
      return {
        id: v._id ? String(v._id) : "",
        label: String(v.label ?? "").trim() || "Variant",
        price: Number(v.price) || 0,
        stockLeft,
        inStock: stockLeft > 0,
        ...(image ? { image } : {}),
      };
    });
  }

  const sl = stockLeftFromUnknown(product.stockLeft);
  const price = Number(product.price) || 0;
  const inStock = sl > 0 || product.inStock !== false;
  return [
    {
      id: LEGACY_VARIANT_ID,
      label: "Standard",
      price,
      stockLeft: sl,
      inStock,
    },
  ];
}

export function getPriceRangeMeta(variants: PublicProductVariant[]): PriceRangeMeta {
  if (variants.length === 0) return { min: 0, max: 0, showFrom: false };
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    min,
    max,
    showFrom: variants.length > 1 && min !== max,
  };
}

/** Normalized variant list + aggregated listing fields for shop/API consumers. */
export function serializeProductForPublic(product: Record<string, unknown>): Record<string, unknown> {
  const { variants: _drop, ...rest } = product;
  const variants = getEffectiveVariants(product);
  const stockSum = variants.reduce((s, v) => s + v.stockLeft, 0);
  const anyInStock = variants.some((v) => v.inStock);
  const range = getPriceRangeMeta(variants);

  return {
    ...rest,
    variants,
    price: range.min,
    stockLeft: stockSum,
    inStock: anyInStock,
    priceRange: range,
  };
}

export type SanitizedVariantInput = {
  label: string;
  price: number;
  stockLeft: number;
  image?: string;
  _id?: mongoose.Types.ObjectId;
};

/** Parse variant rows from admin JSON; falls back to legacy root price/stock when none valid. */
export function sanitizeVariantsFromAdminBody(body: Record<string, unknown>): SanitizedVariantInput[] {
  const arr = Array.isArray(body.variants) ? body.variants : [];
  const out: SanitizedVariantInput[] = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== "object") continue;
    const v = raw as Record<string, unknown>;
    const label = String(v.label ?? "").trim();
    if (!label) continue;
    const price = Math.max(0, Number(v.price) || 0);
    const stockLeft = Math.max(0, Math.floor(Number(v.stockLeft) || 0));
    const idRaw = v._id;
    const _id =
      idRaw && mongoose.Types.ObjectId.isValid(String(idRaw))
        ? new mongoose.Types.ObjectId(String(idRaw))
        : undefined;
    const imgRaw = typeof v.image === "string" ? v.image.trim() : "";
    const image = imgRaw ? normalizeProductImageUrl(imgRaw) : undefined;
    const row = { label, price, stockLeft, ...(image ? { image } : {}) };
    out.push(_id ? { ...row, _id } : row);
  }
  if (out.length === 0) {
    const price = Math.max(0, Number(body.price) || 0);
    const stockLeft = Math.max(0, Math.floor(Number(body.stockLeft) || 0));
    out.push({ label: "Standard", price, stockLeft });
  }
  return out;
}

/** Derive root listing fields from variant rows (admin save). */
export function syncRootFromVariants(variants: { price: number; stockLeft: number }[]): {
  price: number;
  stockLeft: number;
  inStock: boolean;
} {
  if (variants.length === 0) return { price: 0, stockLeft: 0, inStock: false };
  const prices = variants.map((v) => v.price);
  const stockLeft = variants.reduce((s, v) => s + Math.max(0, Math.floor(v.stockLeft)), 0);
  return {
    price: Math.min(...prices),
    stockLeft,
    inStock: stockLeft > 0,
  };
}
