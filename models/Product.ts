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
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
