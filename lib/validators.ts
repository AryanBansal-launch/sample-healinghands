import { validateBookingCalendarAndTime } from "@/lib/booking-datetime-policy";
import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional().default(""),
  fullDescription: z.string().optional().default(""),
  features: z.array(z.string()).optional().default([]),
  icon: z.string().optional().default("Sparkles"),
  image: z.string().optional(),
  isProgram: z.boolean().default(false),
  programDetails: z
    .object({
      sessions: z.any().optional(),
      price: z.any().optional(),
      currency: z.string().optional().default("INR"),
      highlights: z.array(z.string()).optional().default([]),
    })
    .optional()
    .nullable(),
  order: z.number().optional().default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  benefits: z.array(z.string()),
  usageInstructions: z.array(z.string()),
  safetyNotes: z.string(),
  price: z.number().min(0),
  currency: z.string().default("INR"),
  images: z.array(z.string()),
  stockLeft: z.number().int().min(0).default(0),
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const bookingSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    service: z.string().min(1, "Service is required"),
    preferredDate: z.string().or(z.date()),
    preferredTime: z.string().min(1, "Please select a time slot"),
    concerns: z.string().min(5, "Please share your concerns"),
  })
  .superRefine((data, ctx) => {
    const timing = validateBookingCalendarAndTime(data.preferredDate, data.preferredTime);
    if (!timing) return;
    if (timing.code === "BAD_DATE") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: timing.message,
        path: ["preferredDate"],
      });
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: timing.message,
        path: ["preferredTime"],
      });
    }
  });

export const purchaseRequestSchema = z.object({
  product: z.string(),
  productName: z.string(),
  quantity: z.number().min(1),
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(10, "Phone is required"),
  shippingAddress: z.object({
    addressLine1: z.string().min(5, "Address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(6, "Pincode is required"),
    country: z.string().default("India"),
  }),
  totalAmount: z.number(),
});

/** Public testimonials page — submissions await admin approval */
export const testimonialPublicSubmitSchema = z.object({
  clientName: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  quote: z
    .string()
    .trim()
    .min(20, "Please write at least a few sentences (20 characters minimum)")
    .max(2000),
  tagline: z
    .string()
    .trim()
    .min(3, "Add a short headline (e.g. what shifted for you)")
    .max(120),
  rating: z.coerce.number().min(1).max(5).default(5),
  email: z.string().trim().max(120).optional(),
}).superRefine((data, ctx) => {
  if (data.email && data.email.length > 0) {
    const r = z.string().email().safeParse(data.email);
    if (!r.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid email address", path: ["email"] });
    }
  }
});

export const testimonialSchema = z.object({
  clientName: z.string().min(2),
  quote: z.string().min(10),
  tagline: z.string().min(5),
  rating: z.coerce.number().min(1).max(5).optional(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().default(0),
  source: z.enum(["admin", "customer"]).optional(),
  submitterEmail: z.string().max(120).optional(),
});

/** Relative paths (/logo.jpeg, /banners/..., /products/...) or https URLs (Cloudinary) */
const imageRefSchema = z
  .string()
  .min(1, "Image is required")
  .refine(
    (s) => s.startsWith("/") || /^https?:\/\//i.test(s),
    "Must be a site path (/) or a full image URL"
  );

export const certificationSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  certificateImage: imageRefSchema,
  order: z.preprocess(
    (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    },
    z.number().int().min(0)
  ),
  isActive: z.boolean(),
});

/** Admin product form — optional lists, coerced booleans from checkboxes */
export const adminProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  benefits: z.array(z.string()).default([]),
  usageInstructions: z.array(z.string()).default([]),
  safetyNotes: z.string().optional().default(""),
  price: z.coerce.number().min(0),
  currency: z.string().default("INR"),
  images: z
    .array(z.string().min(1, "Image URL cannot be empty"))
    .min(1, "Add at least one product image"),
  /** 0 = out of stock (Buy now disabled). Stored as `stockLeft`; `inStock` is derived when saving. */
  stockLeft: z.coerce.number().int().min(0, "Stock cannot be negative"),
  isActive: z.boolean(),
});
