import mongoose, { Schema, model, models } from "mongoose";

const PageContentSchema = new Schema(
  {
    pageSlug: { type: String, required: true },
    sectionKey: { type: String, required: true },
    content: { type: String, required: true },
    contentType: {
      type: String,
      enum: ["text", "markdown", "html"],
      default: "text",
    },
  },
  { timestamps: true }
);

PageContentSchema.index({ pageSlug: 1, sectionKey: 1 }, { unique: true });

const PageContent =
  models.PageContent || model("PageContent", PageContentSchema);

export default PageContent;
