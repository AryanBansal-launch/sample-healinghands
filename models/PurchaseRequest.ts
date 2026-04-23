import mongoose, { Schema, model, models } from "mongoose";

const PurchaseRequestSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    adminNotes: { type: String },
    whatsappRedirected: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PurchaseRequest =
  models.PurchaseRequest || model("PurchaseRequest", PurchaseRequestSchema);

export default PurchaseRequest;
