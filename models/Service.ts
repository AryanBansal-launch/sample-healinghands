import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    features: [{ type: String }],
    icon: { type: String, required: true },
    image: { type: String },
    isProgram: { type: Boolean, default: false },
    programDetails: {
      sessions: { type: Number },
      price: { type: Number },
      currency: { type: String, default: "INR" },
      highlights: [{ type: String }],
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = models.Service || model("Service", ServiceSchema);

export default Service;
