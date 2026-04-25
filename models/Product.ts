import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    usageInstructions: [{ type: String }],
    safetyNotes: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    images: [{ type: String }],
    /** Units remaining; `inStock` should stay in sync (true when stockLeft > 0). */
    stockLeft: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
