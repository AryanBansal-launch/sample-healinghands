import mongoose, { Schema, model, models } from "mongoose";

const CertificationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    certificateImage: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Certification =
  models.Certification || model("Certification", CertificationSchema);

export default Certification;
