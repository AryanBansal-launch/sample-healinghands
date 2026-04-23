import mongoose, { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
