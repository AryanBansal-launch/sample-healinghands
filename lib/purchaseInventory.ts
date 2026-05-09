import mongoose from "mongoose";
import {
  LEGACY_VARIANT_ID,
  getEffectiveVariants,
  syncRootFromVariants,
} from "@/lib/productVariants";

type VariantLine = {
  label: string;
  price: number;
  stockLeft: number;
  _id?: mongoose.Types.ObjectId;
};

/** Shape returned by `Product.findById` / `findOne` for inventory helpers */
export type ProductStockDocument = {
  variants?: mongoose.Types.DocumentArray<VariantLine> | VariantLine[] | null;
  stockLeft?: number;
  inStock?: boolean;
  price?: number;
  toObject(): Record<string, unknown>;
};

function variantsId(
  variants: ProductStockDocument["variants"],
  id: string
): VariantLine | null {
  if (!variants || !Array.isArray(variants)) return null;
  const docArr = variants as mongoose.Types.DocumentArray<VariantLine>;
  if (typeof docArr.id === "function") {
    const found = docArr.id(id);
    return found ? (found as VariantLine) : null;
  }
  return null;
}

/** Validate that the line can be fulfilled (does not mutate). */
export function validatePurchaseStock(
  product: ProductStockDocument,
  qty: number,
  requestedVariantId?: string | null
): { ok: true } | { ok: false; error: string } {
  const rawVariants = product.variants;
  const hasStoredVariants = Array.isArray(rawVariants) && rawVariants.length > 0;

  if (hasStoredVariants) {
    let sub: VariantLine | null = null;
    if (
      requestedVariantId &&
      requestedVariantId !== LEGACY_VARIANT_ID &&
      mongoose.Types.ObjectId.isValid(requestedVariantId)
    ) {
      sub = variantsId(rawVariants, requestedVariantId);
    }
    if (!sub && rawVariants!.length === 1) {
      sub = rawVariants![0] as VariantLine;
    }
    if (!sub) return { ok: false, error: "Select a valid variant" };
    if (sub.stockLeft < qty) return { ok: false, error: "Not enough stock for this variant" };
    return { ok: true };
  }

  const eff = getEffectiveVariants(product.toObject() as Record<string, unknown>);
  const line = eff[0];
  if (!line.inStock || line.stockLeft < qty) {
    return { ok: false, error: "This product is out of stock" };
  }
  return { ok: true };
}

/** Decrement inventory for an approved purchase (mutates `product`, does not save). */
export function applyDecrementToProduct(
  product: ProductStockDocument,
  qty: number,
  requestedVariantId?: string | null
): { ok: true } | { ok: false; error: string } {
  const check = validatePurchaseStock(product, qty, requestedVariantId);
  if (!check.ok) return check;

  const rawVariants = product.variants;
  const hasStoredVariants = Array.isArray(rawVariants) && rawVariants.length > 0;

  if (hasStoredVariants) {
    let sub: VariantLine | null = null;
    if (
      requestedVariantId &&
      requestedVariantId !== LEGACY_VARIANT_ID &&
      mongoose.Types.ObjectId.isValid(requestedVariantId)
    ) {
      sub = variantsId(rawVariants, requestedVariantId);
    }
    if (!sub && rawVariants!.length === 1) {
      sub = rawVariants![0] as VariantLine;
    }
    if (!sub) return { ok: false, error: "Select a valid variant" };
    sub.stockLeft -= qty;
    const root = syncRootFromVariants(
      rawVariants!.map((v: VariantLine) => ({
        price: v.price,
        stockLeft: v.stockLeft,
      }))
    );
    product.price = root.price;
    product.stockLeft = root.stockLeft;
    product.inStock = root.inStock;
  } else {
    product.stockLeft = Math.max(0, (product.stockLeft ?? 0) - qty);
    product.inStock = (product.stockLeft ?? 0) > 0;
  }

  return { ok: true };
}

/** Add stock back when a purchase that had been deducted is cancelled (mutates `product`, does not save). */
export function applyIncrementToProduct(
  product: ProductStockDocument,
  qty: number,
  variantId?: mongoose.Types.ObjectId | string | null
): void {
  const rawVariants = product.variants;
  const hasStoredVariants = Array.isArray(rawVariants) && rawVariants.length > 0;
  const vid = variantId ? String(variantId) : null;

  if (hasStoredVariants) {
    let sub: VariantLine | null = null;
    if (vid && mongoose.Types.ObjectId.isValid(vid)) {
      sub = variantsId(rawVariants, vid);
    }
    if (!sub && rawVariants!.length === 1) {
      sub = rawVariants![0] as VariantLine;
    }
    if (sub) {
      sub.stockLeft += qty;
      const root = syncRootFromVariants(
        rawVariants!.map((v: VariantLine) => ({
          price: v.price,
          stockLeft: v.stockLeft,
        }))
      );
      product.price = root.price;
      product.stockLeft = root.stockLeft;
      product.inStock = root.inStock;
    }
    return;
  }

  product.stockLeft = (product.stockLeft ?? 0) + qty;
  product.inStock = (product.stockLeft ?? 0) > 0;
}
