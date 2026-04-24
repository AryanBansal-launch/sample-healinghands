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
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  service: z.string().min(1, "Service is required"),
  preferredDate: z.string().or(z.date()),
  preferredTime: z.string(),
  concerns: z.string().min(5, "Please share your concerns"),
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

export const testimonialSchema = z.object({
  clientName: z.string().min(2),
  quote: z.string().min(10),
  tagline: z.string().min(5),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

/** Relative paths (/logo.jpeg) or https URLs (Cloudinary) */
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
  images: z.array(z.string()).min(1, "Upload or keep at least one image"),
  inStock: z.boolean(),
  isActive: z.boolean(),
});
