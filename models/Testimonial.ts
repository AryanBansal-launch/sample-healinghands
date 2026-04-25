import mongoose, { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    quote: { type: String, required: true },
    tagline: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    /** `customer` = submitted via site; pending until admin sets isActive */
    source: {
      type: String,
      enum: ["admin", "customer"],
      default: "admin",
    },
    submitterEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

const Testimonial =
  models.Testimonial || model("Testimonial", TestimonialSchema);

export default Testimonial;
