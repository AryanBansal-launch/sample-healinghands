# Healing Hands — Full-Stack Development Specification

> **Purpose:** This document is a complete development brief for rebuilding the Healing Hands website (currently at `https://sample-healinghands.vercel.app/`) into a full-stack Next.js application with an admin dashboard, MongoDB backend, Cloudinary media management, and WhatsApp integration.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Content Gap Analysis — What to Add](#3-content-gap-analysis--what-to-add)
4. [Database Schema (MongoDB)](#4-database-schema-mongodb)
5. [Authentication — Admin Auth with NextAuth](#5-authentication--admin-auth-with-nextauth)
6. [Cloudinary Integration](#6-cloudinary-integration)
7. [Page-by-Page Specification](#7-page-by-page-specification)
8. [Admin Dashboard Specification](#8-admin-dashboard-specification)
9. [Session Booking Flow](#9-session-booking-flow)
10. [Shop & Purchase Flow](#10-shop--purchase-flow)
11. [WhatsApp Integration](#11-whatsapp-integration)
12. [API Routes](#12-api-routes)
13. [Middleware & Route Protection](#13-middleware--route-protection)
14. [Environment Variables](#14-environment-variables)
15. [Deployment Notes](#15-deployment-notes)

---

## 1. Project Overview

**Healing Hands** is an energy healing practice by **Preyanka Jain** (Pranic Healer, Crystal Healing, Angel Healing, Divine Healing, Astrologer, Numerologist, Counselor, Yoga Trainer). The current website is a static Next.js site deployed on Vercel. We need to convert it into a dynamic, admin-managed full-stack application.

### Two Personas

| Persona | Description |
|---------|-------------|
| **User (Public)** | Visitors who browse services, book sessions, buy products, read testimonials |
| **Admin (Preyanka / Manager)** | Authenticated user who manages all content, approves bookings, tracks purchases |

### Branding

- **Full Name:** THE HEALING HANDS
- **Founder:** Preyanka Jain
- **Phone:** 9355733831
- **Tagline:** "Healing starts from within"
- **Tone:** Warm, spiritual, compassionate, professional
- **Color Palette:** Keep the existing site's calming aesthetic (soft greens, golds, purples, whites)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (matching current site aesthetic) |
| Database | MongoDB Atlas (free tier) |
| ODM | Mongoose |
| Auth | NextAuth.js v4/v5 — Credentials Provider (username + password) |
| Media Storage | Cloudinary (free tier) |
| Deployment | Vercel |
| WhatsApp | `https://wa.me/919355733831?text=...` URL scheme (no paid API needed) |

---

## 3. Content Gap Analysis — What to Add

The following content exists in the provided images and data but is **missing from the current website**. All of this must be added gracefully into the relevant pages.

### 3.1 Missing Services (Not on Website)

These services appear in the flyer images and text data but are NOT listed on the current website:

| Missing Service | Details | Where to Add |
|----------------|---------|--------------|
| **Financial Healing** | Energy healing focused on financial blocks and prosperity | Services page — new service card |
| **Hair Regrowth Healing** | Energy healing to support hair regrowth | Services page — new service card |
| **Job & Business Healing** | Healing for career growth, job issues, business success | Services page — new service card |
| **Prosperity Healing Program** | 15 Sessions / Rs. 10,000 — structured program (from Image 1) | Services page — featured program section AND/OR a dedicated "Programs" section |
| **Physical Ailment Healing** | Aches/Pains, Blood Pressure, Cysts, Asthma, Diabetes, Migraine, Skin Disorders, Heart ailments, Immune & Defence system, Thyroid, Fever, Cancer (from Images 2 & 3) | Services page — add under a "Physical Wellness Support" service card |
| **Psychological Healing (expanded)** | Stress, Fear & Phobia, Low self esteem, Addictions, ADHD, Depression, Low confidence, Grief/sadness, Trauma, Anger (from Image 2) | Services page — expand the existing "Emotional & Mental Wellness Support" card with these specifics |
| **Past Life / Present Life Trauma Healing** | From Image 3 | Services page — add under trauma support |
| **Weight Loss / Gain Support** | From Image 2 | Services page — new or existing card |
| **Scanning Aura, Chakras, Place & More** | From Image 2 | Services page — add to Aura & Chakra Cleansing |
| **All Types of Counseling / Motivation** | From text data | Services page — add as a service |

### 3.2 Missing Product Details (Healing Spray)

The current shop page has a generic description. The provided text data has richer details for the Healing Bliss spray:

**Add this copy to the Shop page product description:**
- "With the blessings of God and Divine healing Angels, this Healing Spray will remove all negative energies around you and from your home."
- Removes pain and dizziness
- Very effective at workplace, business, office, bedrooms
- For children affected by negative energy (nazar), spray around the child
- Carry while travelling — use in hotels, buses, trains, etc.
- Filled with divinely loving healing energies
- **Contact:** Preyanka Jain — 9355733831

### 3.3 Missing Pricing Information

From Image 1 (Prosperity Healing Program):
- **Prosperity Healing Program:** 15 Sessions — ₹10,000
  - Clear Energy Blocks & Limiting Beliefs
  - Release Subconscious Fears
  - Attract Opportunities & Financial Growth
  - Enhance Confidence & Decision Making
  - Create an Abundant Mindset
  - Strengthen Your Wealth Receiving Ability
  - Tagline: "Unlock Abundance. Align with Success. Transform Your Life."
  - Footer: "Align Your Energy with Abundance & Thrive"

### 3.4 Missing Info in About Page

Add these credential details (from Image 3 and text data):
- Full list of credentials: Pranic Healer, Crystal Healing, Angel Healing, Divine Healing, Astrologer, Numerologist, Counselor, Yoga Trainer, Life Coach
- Phone: 9355733831 (the website currently shows a placeholder 98765 43210 — **replace with real number**)

### 3.5 Contact Info Fix

The website currently uses placeholder contact info:
- **Replace** `+91 98765 43210` → `+91 93557 33831`
- **Replace** `info@healinghands.com` → confirm real email or keep as is
- **Replace** WhatsApp link from `wa.me/919876543210` → `wa.me/919355733831`

### 3.6 Images to Use

The 3 uploaded images should be used as follows:
- **Image 1** (Prosperity Healing Program — gold/green poster): Use on the Services page for the Prosperity Healing Program section, or as a promotional banner
- **Image 2** (Pranic Healing Packages — purple cards): Use on the Services page as a visual reference or in the admin-uploaded gallery
- **Image 3** (Green flyer — full service list): Use on the Services page or About page as a visual

Upload all 3 images to Cloudinary and reference them dynamically.

---

## 4. Database Schema (MongoDB)

Use MongoDB Atlas free tier. Database name: `healinghands`

### 4.1 Collections & Schemas

```typescript
// ===== services =====
interface Service {
  _id: ObjectId;
  title: string;                    // e.g. "Remote Pranic Healing"
  slug: string;                     // e.g. "remote-pranic-healing"
  shortDescription: string;         // Card description
  fullDescription: string;          // Rich text / markdown
  features: string[];               // e.g. ["Convenient remote sessions", "Energy body cleansing"]
  icon: string;                     // Icon name or emoji
  image?: string;                   // Cloudinary URL (optional)
  isProgram: boolean;               // true for structured programs like Prosperity Healing
  programDetails?: {
    sessions: number;               // e.g. 15
    price: number;                  // e.g. 10000
    currency: string;               // "INR"
    highlights: string[];           // Program-specific bullet points
  };
  order: number;                    // Display order
  isActive: boolean;                // Show/hide on frontend
  createdAt: Date;
  updatedAt: Date;
}

// ===== products =====
interface Product {
  _id: ObjectId;
  name: string;                     // "Healing Bliss Aura Cleansing Spray"
  slug: string;
  description: string;              // Rich description
  benefits: string[];
  usageInstructions: string[];
  safetyNotes: string;
  price: number;                    // 999
  currency: string;                 // "INR"
  images: string[];                 // Array of Cloudinary URLs
  inStock: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== certifications =====
interface Certification {
  _id: ObjectId;
  title: string;                    // "Pranic Healer"
  description: string;
  certificateImage: string;         // Cloudinary URL
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== testimonials =====
interface Testimonial {
  _id: ObjectId;
  clientName: string;               // "Anonymous", "R.P.", etc.
  quote: string;
  tagline: string;                  // "Emotional relief and peace"
  rating?: number;                  // 1-5 (optional)
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== bookings =====
interface Booking {
  _id: ObjectId;
  fullName: string;
  email: string;
  phone: string;                    // With country code
  service: string;                  // Service title or ID
  preferredDate: Date;
  preferredTime: string;            // e.g. "10:00 AM"
  concerns: string;                 // What the user wants support with
  status: "pending" | "approved" | "rejected" | "completed";
  adminNotes?: string;              // Admin can add internal notes
  whatsappSent: boolean;            // Track if approval WhatsApp was sent
  createdAt: Date;
  updatedAt: Date;
}

// ===== purchaseRequests =====
interface PurchaseRequest {
  _id: ObjectId;
  product: ObjectId;                // Ref to Product
  productName: string;              // Denormalized for quick display
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;                // Default "India"
  };
  totalAmount: number;              // price × quantity
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  adminNotes?: string;
  whatsappRedirected: boolean;      // Was the user redirected to WhatsApp
  createdAt: Date;
  updatedAt: Date;
}

// ===== pages =====
// For admin-editable page content (About, Home hero text, etc.)
interface PageContent {
  _id: ObjectId;
  pageSlug: string;                 // "home", "about", "services-intro", etc.
  sectionKey: string;               // "hero_title", "hero_subtitle", "founder_quote", etc.
  content: string;                  // The actual text content (supports markdown)
  contentType: "text" | "markdown" | "html";
  updatedAt: Date;
}

// ===== siteSettings =====
interface SiteSettings {
  _id: ObjectId;
  key: string;                      // "phone", "email", "whatsapp", "address", "tagline"
  value: string;
  updatedAt: Date;
}

// ===== admin (for NextAuth) =====
interface Admin {
  _id: ObjectId;
  username: string;
  passwordHash: string;             // bcrypt hashed
  name: string;
  role: "admin";
  createdAt: Date;
}
```

---

## 5. Authentication — Admin Auth with NextAuth

### Setup

- Use **NextAuth.js** with the **Credentials Provider**
- Admin login is username + password only (no OAuth, no user registration)
- Store admin credentials in MongoDB `admin` collection
- Hash passwords with `bcrypt`

### Login Page

- Route: `/admin/login`
- Simple form: username + password
- On success → redirect to `/admin/dashboard`
- On failure → show error message

### Middleware (Route Protection)

Create `middleware.ts` at the project root:

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],  // Protect ALL /admin/* routes EXCEPT /admin/login
};
```

**Important:** `/admin/login` must be excluded from middleware protection so the login page is accessible.

### Seed Script

Create a seed script (`scripts/seed-admin.ts`) that:
1. Connects to MongoDB
2. Hashes a default password with bcrypt
3. Inserts the admin user
4. Logs success

```
Default credentials (change in production):
  Username: admin
  Password: healinghands@admin
```

---

## 6. Cloudinary Integration

### Setup

- Use **Cloudinary free tier** (25 credits/month, ~25GB storage)
- Install: `cloudinary` and `next-cloudinary` packages
- All media uploads go through an API route, NOT directly from the client

### Cloudinary Folder Structure

```
healinghands/
├── certifications/        # Certificate images
├── products/              # Product images
├── services/              # Service images
├── banners/               # Page banners and hero images
├── gallery/               # Flyers, promotional materials (the 3 uploaded images go here)
└── misc/                  # Other uploads
```

### Upload API Route

`POST /api/admin/upload`

- Accepts multipart form data (image file)
- Validates file type (jpg, jpeg, png, webp) and size (max 5MB)
- Uploads to Cloudinary under the specified folder
- Returns the Cloudinary URL and public_id
- **Admin-only** (protected by middleware)

### Delete API

`DELETE /api/admin/upload`

- Accepts Cloudinary `public_id`
- Deletes from Cloudinary
- **Admin-only**

---

## 7. Page-by-Page Specification

### 7.1 Home Page (`/`)

**Data Source:** MongoDB `pageContent`, `services`, `testimonials`, `siteSettings`

**Sections:**
1. **Hero Banner** — Admin-editable title, subtitle, CTA buttons
2. **What We Do** — Pull active services from DB (show first 6, ordered by `order` field)
3. **Meet the Founder** — Admin-editable bio and quote
4. **How It Works** — 3-step process (admin-editable)
5. **Why Healing Hands** — Trust badges / selling points
6. **Client Experiences** — Pull 3 featured testimonials from DB
7. **Purpose & Philosophy** — Admin-editable section
8. **CTA Banner** — Book session / Contact

### 7.2 About Page (`/about`)

**Data Source:** MongoDB `pageContent`, `siteSettings`

**Content to add (from gap analysis):**
- Full credentials list: Pranic Healer, Crystal Healing, Angel Healing, Divine Healing, Astrologer, Numerologist, Counselor, Yoga Trainer, Life Coach
- All text admin-editable

### 7.3 Services Page (`/services`)

**Data Source:** MongoDB `services`

**CRITICAL — Add these missing services to the seed data:**

1. Remote Pranic Healing *(exists)*
2. Aura & Chakra Cleansing *(exists but expand — add "Scanning Aura, Chakras, Place & More")*
3. Emotional & Mental Wellness Support *(exists but expand with: Stress, Fear & Phobia, Low self esteem, Addictions, ADHD, Depression, Low confidence, Grief/sadness, Trauma, Anger)*
4. Stress, Anxiety & Trauma Support *(exists but add Past Life/Present Life Trauma Healing)*
5. Relationship & Life Balance Support *(exists)*
6. Child & Student Wellness Support *(exists but expand with: Fear, Overthinking, Behavior Issues, Exam Stress, Lack of Focus, Study Pressure)*
7. Space Energy Cleansing *(exists)*
8. **Financial Healing** *(NEW — clearing energy blocks around money, financial growth)*
9. **Hair Regrowth Healing** *(NEW — energy healing to support hair regrowth)*
10. **Job & Business Healing** *(NEW — career growth, job issues, business success, workplace relationships)*
11. **Physical Ailment Support** *(NEW — Aches/Pains, Blood Pressure, Cysts, Asthma, Diabetes, Migraine, Skin Disorders, Heart ailments, Immune system, Thyroid, Fever, Cancer — with clear disclaimer that this is complementary wellness, not medical treatment)*
12. **Weight Management Support** *(NEW — weight loss/gain through energy healing)*
13. **Counseling & Motivation** *(NEW — all types of counseling, motivational support)*

**Featured Program Section (from Image 1):**
- **Prosperity Healing Program** — 15 Sessions / ₹10,000
- Display as a premium highlighted card/banner
- Include all bullet points from Image 1
- Admin can CRUD programs like any other service (using `isProgram: true`)

**Add disclaimer at top of services page:**
> "All services are complementary wellness practices and are not a substitute for professional medical treatment. Results may vary and are not guaranteed."

### 7.4 Shop Page (`/shop`)

**Data Source:** MongoDB `products`

**Current:** Single product (Healing Bliss spray at ₹999)
**Enhanced with new copy from provided data:**

Product description should include:
- Removes all negative energies around you and from your home
- Removes pain and dizziness
- Very effective at workplace, business, office, bedrooms
- For children: spray around the child for protection from negative energy
- Travel use: use in hotels, buses, trains, etc.
- Filled with divinely loving healing energies

**Purchase Flow (see Section 10 for full detail):**
1. User clicks "Buy Now"
2. Modal/page opens asking for: Name, Email, Phone, Shipping Address (Line 1, Line 2, City, State, Pincode), Quantity
3. User fills details and clicks "Proceed to Purchase"
4. System saves the purchase request to MongoDB with status "pending"
5. User is immediately redirected to WhatsApp: `https://wa.me/919355733831?text=` with a pre-filled message containing their order details
6. Admin sees the request on the dashboard

### 7.5 Book Session Page (`/book-session`)

**Data Source:** MongoDB `services` (for dropdown), `bookings` (to store submissions)

**Form Fields:**
- Full Name *
- Email Address *
- Phone Number *
- Select Service * (dynamically pulled from active services in DB)
- Preferred Date *
- Preferred Time * (9 AM – 6 PM slots)
- What would you like support with? * (textarea)

**On Submit:**
1. Validate all fields
2. POST to `/api/bookings` → saves to MongoDB with status `"pending"`
3. Show success message: "Your booking request has been submitted. You will receive a WhatsApp confirmation once approved."
4. Admin sees it in dashboard → can Approve or Reject
5. On Approve → user gets redirected/sent a WhatsApp message (see Section 9)

### 7.6 Certifications Page (`/certifications`)

**Data Source:** MongoDB `certifications`

**Display:** Grid of certification cards, each with:
- Title
- Description
- "View Certificate" button → opens the Cloudinary-hosted certificate image in a modal/lightbox

**Admin:** Can add/remove/reorder certifications and upload certificate images via Cloudinary

### 7.7 Testimonials Page (`/testimonials`)

**Data Source:** MongoDB `testimonials`

**Display:** All active testimonials in a grid/list layout
**Admin:** Can add/edit/delete testimonials

### 7.8 Contact Page (`/contact`)

**Data Source:** MongoDB `siteSettings`

**Fix placeholder data:**
- Phone: 9355733831
- WhatsApp: wa.me/919355733831
- Email: confirm with client or keep info@healinghands.com

**Contact form** submits to `/api/contact` → stores in a `contactMessages` collection (optional) or sends as email notification

---

## 8. Admin Dashboard Specification

### Route: `/admin/dashboard`

Protected by NextAuth middleware. Only accessible after login.

### Dashboard Layout

**Sidebar Navigation:**
```
📊 Dashboard (overview)
📋 Bookings
🛒 Purchase Requests
🔧 Services
🛍️ Products
🏆 Certifications
💬 Testimonials
📄 Page Content
⚙️ Site Settings
🚪 Logout
```

### 8.1 Dashboard Overview (`/admin/dashboard`)

Stats cards showing:
- Total Pending Bookings
- Total Pending Purchase Requests
- Total Active Services
- Total Products
- Recent activity feed (last 5 bookings + last 5 purchases)

### 8.2 Bookings Management (`/admin/dashboard/bookings`)

**Table view** of all bookings with columns:
- Name, Phone, Service, Date, Time, Status, Created At, Actions

**Filters:** Status (All / Pending / Approved / Rejected / Completed)

**Actions per booking:**
- **View Details** → modal/page showing full booking info including concerns text
- **Approve** → changes status to "approved", generates a WhatsApp link to send confirmation to the user
- **Reject** → changes status to "rejected", optionally add admin notes
- **Mark Completed** → changes status to "completed"
- **Add Notes** → admin can write internal notes

**Approve Flow:**
1. Admin clicks "Approve"
2. Status updates to "approved" in DB
3. System shows a "Send WhatsApp Confirmation" button
4. Clicking it opens: `https://wa.me/91{userPhone}?text=Hello {userName}! Your healing session for {serviceName} on {date} at {time} has been confirmed. — Healing Hands by Preyanka Jain 🙏`
5. Mark `whatsappSent: true` after admin confirms they sent it

### 8.3 Purchase Requests Management (`/admin/dashboard/purchases`)

**Table view** with columns:
- Customer Name, Phone, Product, Qty, Amount, Status, Created At, Actions

**Filters:** Status (All / Pending / Confirmed / Shipped / Delivered / Cancelled)

**Actions:**
- View full details (including shipping address)
- Update status (Pending → Confirmed → Shipped → Delivered)
- Cancel order
- Add admin notes

### 8.4 Services CRUD (`/admin/dashboard/services`)

**List view** with drag-and-drop reordering (or manual order number)

**Create/Edit form:**
- Title, Slug (auto-generated from title), Short Description, Full Description (markdown)
- Features (dynamic add/remove list)
- Icon, Image upload (Cloudinary)
- Is Program? toggle → reveals: Sessions count, Price, Currency, Highlights
- Is Active? toggle
- Order number

**Delete:** Soft delete (set `isActive: false`) or hard delete with confirmation

### 8.5 Products CRUD (`/admin/dashboard/products`)

**Create/Edit form:**
- Name, Slug, Description (rich text)
- Benefits (dynamic list)
- Usage Instructions (dynamic list)
- Safety Notes
- Price, Currency
- Images (multiple upload to Cloudinary, drag to reorder)
- In Stock toggle
- Is Active toggle

### 8.6 Certifications CRUD (`/admin/dashboard/certifications`)

**Create/Edit form:**
- Title, Description
- Certificate Image (upload to Cloudinary — this is the main use case for Cloudinary)
- Order, Is Active

### 8.7 Testimonials CRUD (`/admin/dashboard/testimonials`)

**Create/Edit form:**
- Client Name, Quote, Tagline, Rating (optional), Order, Is Active

### 8.8 Page Content Editor (`/admin/dashboard/pages`)

A section where admin can edit key text content on each page without touching code:

- **Home page:** Hero title, Hero subtitle, Founder quote, Philosophy section
- **About page:** Full bio text, credentials list, message of hope
- **Services page:** Intro text, disclaimer text
- **Contact page:** Quote/message

Each entry is a key-value pair stored in `pageContent` collection. Admin edits the text in a textarea (markdown supported) and saves.

### 8.9 Site Settings (`/admin/dashboard/settings`)

Editable settings:
- Phone number
- WhatsApp number
- Email
- Address / Location text
- Site tagline
- Social hashtags
- Footer text

---

## 9. Session Booking Flow (Detailed)

```
USER SIDE:
1. User visits /book-session
2. Fills form (name, email, phone, service, date, time, concerns)
3. Clicks "Submit Booking Request"
4. POST /api/bookings → saves to MongoDB (status: "pending")
5. User sees: "Thank you! Your booking request has been submitted.
   You'll receive a WhatsApp confirmation once your session is approved."

ADMIN SIDE:
6. Admin logs in → /admin/dashboard/bookings
7. Sees new booking with status "Pending" (highlighted)
8. Clicks "View" → reads full details and concerns
9. Clicks "Approve" → status changes to "approved"
10. System shows a button: "Send WhatsApp Confirmation"
11. Button opens WhatsApp web/app with pre-filled message to the user's phone:
    "🙏 Namaste {name}! Your {service} session with Healing Hands has been
     confirmed for {date} at {time}. We look forward to supporting your
     healing journey. — Preyanka Jain, Healing Hands 🙏"
12. Admin can also Reject with a reason
```

---

## 10. Shop & Purchase Flow (Detailed)

```
USER SIDE:
1. User visits /shop
2. Browses product(s), selects quantity
3. Clicks "Buy Now"
4. A modal or new page opens with a purchase form:
   - Full Name *
   - Email *
   - Mobile Number *
   - Shipping Address:
     - Address Line 1 *
     - Address Line 2
     - City *
     - State *
     - Pincode *
     - Country (default: India)
   - Quantity (carried from shop page)
   - Order Summary showing: Product name, Qty, Unit Price, Total
5. User clicks "Proceed to Purchase"
6. POST /api/purchases → saves to MongoDB (status: "pending", whatsappRedirected: true)
7. User is IMMEDIATELY redirected to WhatsApp:
   https://wa.me/919355733831?text=Hello! I'd like to purchase {quantity}x {productName}
   (₹{totalAmount}). My details — Name: {name}, Phone: {phone}, Address: {fullAddress}.
   Please confirm my order. 🙏
8. User completes the conversation and payment on WhatsApp

ADMIN SIDE:
9. Admin sees the purchase request in /admin/dashboard/purchases
10. Can update status: Pending → Confirmed → Shipped → Delivered
11. Full customer details and shipping address visible
```

---

## 11. WhatsApp Integration

No paid WhatsApp API needed. Use the `wa.me` URL scheme throughout:

```
Base URL: https://wa.me/919355733831
```

### Usage Locations:

| Location | Pre-filled Message |
|----------|-------------------|
| Shop "Talk on WhatsApp" | `Hello! I would like to purchase the Healing Bliss Aura Cleansing Spray.` |
| Purchase completion redirect | `Hello! I'd like to purchase {qty}x {product} (₹{total}). Name: {name}, Phone: {phone}, Address: {address}. Please confirm my order. 🙏` |
| Booking approval (admin-initiated) | `🙏 Namaste {name}! Your {service} session with Healing Hands has been confirmed for {date} at {time}. — Preyanka Jain, Healing Hands` |
| Contact page WhatsApp link | `Hello! I'd like to know more about your healing services.` |

All messages should be URL-encoded when constructing the `wa.me` URL.

---

## 12. API Routes

All API routes live under `/app/api/`.

### Public Routes (No Auth Required)

```
GET    /api/services              → List active services (ordered)
GET    /api/services/[slug]       → Single service details
GET    /api/products              → List active products
GET    /api/products/[slug]       → Single product details
GET    /api/certifications        → List active certifications (ordered)
GET    /api/testimonials          → List active testimonials (ordered)
GET    /api/page-content/[slug]   → Get page content by pageSlug
GET    /api/site-settings         → Get all site settings

POST   /api/bookings              → Create new booking (user submission)
POST   /api/purchases             → Create new purchase request
POST   /api/contact               → Submit contact form message
```

### Admin Routes (Auth Required — validate session in each route)

```
# Services
GET    /api/admin/services            → List ALL services (including inactive)
POST   /api/admin/services            → Create service
PUT    /api/admin/services/[id]       → Update service
DELETE /api/admin/services/[id]       → Delete service

# Products
GET    /api/admin/products            → List ALL products
POST   /api/admin/products            → Create product
PUT    /api/admin/products/[id]       → Update product
DELETE /api/admin/products/[id]       → Delete product

# Certifications
GET    /api/admin/certifications      → List ALL certifications
POST   /api/admin/certifications      → Create certification
PUT    /api/admin/certifications/[id] → Update certification
DELETE /api/admin/certifications/[id] → Delete certification

# Testimonials
GET    /api/admin/testimonials        → List ALL testimonials
POST   /api/admin/testimonials        → Create testimonial
PUT    /api/admin/testimonials/[id]   → Update testimonial
DELETE /api/admin/testimonials/[id]   → Delete testimonial

# Bookings
GET    /api/admin/bookings            → List all bookings (with filters)
GET    /api/admin/bookings/[id]       → Single booking details
PUT    /api/admin/bookings/[id]       → Update booking (status, notes)

# Purchases
GET    /api/admin/purchases           → List all purchase requests (with filters)
GET    /api/admin/purchases/[id]      → Single purchase details
PUT    /api/admin/purchases/[id]      → Update purchase (status, notes)

# Page Content
GET    /api/admin/page-content        → List all page content entries
PUT    /api/admin/page-content/[id]   → Update page content

# Site Settings
GET    /api/admin/site-settings       → List all settings
PUT    /api/admin/site-settings/[id]  → Update setting

# Media Upload
POST   /api/admin/upload              → Upload image to Cloudinary
DELETE /api/admin/upload              → Delete image from Cloudinary

# Dashboard Stats
GET    /api/admin/stats               → Aggregated dashboard stats
```

---

## 13. Middleware & Route Protection

### File: `middleware.ts` (project root)

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Additional checks can go here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/((?!login).*):",    // All /admin/* EXCEPT /admin/login
    "/api/admin/:path*",        // All admin API routes
  ],
};
```

### API Route Protection (Belt & Suspenders)

Even though middleware protects `/api/admin/*`, each admin API route should also verify the session:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... proceed
}
```

---

## 14. Environment Variables

Create `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/healinghands?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=<generate-a-random-32-char-string>
NEXTAUTH_URL=http://localhost:3000
# For production: NEXTAUTH_URL=https://your-domain.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# WhatsApp (for easy config changes)
NEXT_PUBLIC_WHATSAPP_NUMBER=919355733831

# Admin seed (for initial setup only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=healinghands@admin
```

---

## 15. Deployment Notes

### Vercel Deployment

1. Push to GitHub repo
2. Connect to Vercel
3. Add ALL environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup

1. Create free cluster on [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user
3. Whitelist `0.0.0.0/0` for Vercel (or use Vercel's IP list)
4. Get connection string → add to `MONGODB_URI`

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
2. Get Cloud Name, API Key, API Secret from dashboard
3. Add to environment variables

### Seed Script

After first deployment:
```bash
npx ts-node scripts/seed-admin.ts      # Creates admin user
npx ts-node scripts/seed-data.ts       # Seeds initial services, products,
                                        # certifications, testimonials, page content,
                                        # and site settings from current website data
```

The seed script should populate:
- All 13 services (7 existing + 6 new from gap analysis)
- The Prosperity Healing Program
- The Healing Bliss spray product (with enhanced description)
- All 7 certifications
- All 6 testimonials
- Page content entries for Home, About, Services
- Site settings with correct phone (9355733831), WhatsApp, email

---

## Appendix A: File/Folder Structure (Suggested)

```
healing-hands/
├── app/
│   ├── (public)/                   # Public-facing pages
│   │   ├── page.tsx                # Home
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── book-session/page.tsx
│   │   ├── certifications/page.tsx
│   │   ├── testimonials/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx            # Overview
│   │       ├── bookings/page.tsx
│   │       ├── purchases/page.tsx
│   │       ├── services/
│   │       │   ├── page.tsx        # List
│   │       │   ├── new/page.tsx    # Create
│   │       │   └── [id]/page.tsx   # Edit
│   │       ├── products/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── certifications/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── testimonials/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── pages/page.tsx      # Page content editor
│   │       └── settings/page.tsx   # Site settings
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── services/route.ts
│   │   ├── services/[slug]/route.ts
│   │   ├── products/route.ts
│   │   ├── products/[slug]/route.ts
│   │   ├── certifications/route.ts
│   │   ├── testimonials/route.ts
│   │   ├── bookings/route.ts
│   │   ├── purchases/route.ts
│   │   ├── contact/route.ts
│   │   ├── page-content/[slug]/route.ts
│   │   ├── site-settings/route.ts
│   │   └── admin/
│   │       ├── services/route.ts
│   │       ├── services/[id]/route.ts
│   │       ├── products/route.ts
│   │       ├── products/[id]/route.ts
│   │       ├── certifications/route.ts
│   │       ├── certifications/[id]/route.ts
│   │       ├── testimonials/route.ts
│   │       ├── testimonials/[id]/route.ts
│   │       ├── bookings/route.ts
│   │       ├── bookings/[id]/route.ts
│   │       ├── purchases/route.ts
│   │       ├── purchases/[id]/route.ts
│   │       ├── page-content/route.ts
│   │       ├── page-content/[id]/route.ts
│   │       ├── site-settings/route.ts
│   │       ├── site-settings/[id]/route.ts
│   │       ├── upload/route.ts
│   │       └── stats/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                         # Reusable UI components
│   ├── public/                     # Public page components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── BookingForm.tsx
│   │   ├── PurchaseModal.tsx
│   │   └── CertificateModal.tsx
│   └── admin/                      # Admin dashboard components
│       ├── Sidebar.tsx
│       ├── StatsCard.tsx
│       ├── DataTable.tsx
│       ├── BookingActions.tsx
│       ├── ImageUploader.tsx
│       ├── RichTextEditor.tsx
│       └── WhatsAppButton.tsx
├── lib/
│   ├── mongodb.ts                  # MongoDB connection singleton
│   ├── auth.ts                     # NextAuth config
│   ├── cloudinary.ts               # Cloudinary config & helpers
│   ├── whatsapp.ts                 # WhatsApp URL builder helper
│   └── validators.ts               # Zod schemas for form validation
├── models/
│   ├── Service.ts
│   ├── Product.ts
│   ├── Certification.ts
│   ├── Testimonial.ts
│   ├── Booking.ts
│   ├── PurchaseRequest.ts
│   ├── PageContent.ts
│   ├── SiteSettings.ts
│   └── Admin.ts
├── scripts/
│   ├── seed-admin.ts
│   └── seed-data.ts
├── middleware.ts
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Appendix B: Key UX Notes

1. **All public pages should fetch data from MongoDB** — no hardcoded content. If the DB is empty, show graceful fallbacks.
2. **Loading states** — use skeleton loaders on public pages while data loads.
3. **Mobile responsive** — the current site is mobile-friendly; maintain that.
4. **Toast notifications** — use for form submissions (success/error) on both public and admin sides.
5. **Confirmation dialogs** — before any destructive action (delete service, reject booking, etc.).
6. **Image optimization** — use Next.js `<Image>` component with Cloudinary URLs. Use Cloudinary transformations for thumbnails.
7. **SEO** — maintain proper `<title>`, `<meta>` tags, and Open Graph data on all public pages. Admin pages don't need SEO.
8. **The 3 uploaded images** — upload these to Cloudinary during seed and reference them in services/banners.

---

## Appendix C: WhatsApp URL Helper

```typescript
// lib/whatsapp.ts
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919355733831";

export function buildWhatsAppURL(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildBookingApprovalMessage(booking: {
  fullName: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
}): string {
  return `🙏 Namaste ${booking.fullName}! Your ${booking.service} session with Healing Hands has been confirmed for ${booking.preferredDate} at ${booking.preferredTime}. We look forward to supporting your healing journey. — Preyanka Jain, Healing Hands 🙏`;
}

export function buildPurchaseMessage(purchase: {
  productName: string;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}): string {
  return `Hello! I'd like to purchase ${purchase.quantity}x ${purchase.productName} (₹${purchase.totalAmount}). My details — Name: ${purchase.customerName}, Phone: ${purchase.customerPhone}, Address: ${purchase.shippingAddress}. Please confirm my order. 🙏`;
}
```

---

*End of specification. This document should be provided to Cursor/Claude Code as the single source of truth for development.*
