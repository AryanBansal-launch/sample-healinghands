import mongoose, { Schema, model, models } from "mongoose";

const ProductVariantSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockLeft: { type: Number, default: 0, min: 0 },
    /** Optional hero image for this SKU (shown first in gallery when selected). */
    image: { type: String },
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    usageInstructions: [{ type: String }],
    safetyNotes: { type: String },
    /** Kept in sync from variants (minimum price) for listings and legacy reads. */
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    images: [{ type: String }],
    /**
     * Optional variant rows (size, volume, etc.). When empty, `price` / `stockLeft` act as a single “standard” SKU.
     * When non-empty, root `price` / `stockLeft` / `inStock` are derived on save.
     */
    variants: { type: [ProductVariantSchema], default: [] },
    /** Total units across variants, or legacy single SKU count. */
    stockLeft: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
