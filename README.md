# Healing Hands - Next.js Website

A modern, spiritual website for Healing Hands - Energy Healing, Pranic Healing, Aura Cleansing & Holistic Wellness.

## Features

- ✨ Modern, calm, and spiritual design
- 📱 Fully responsive
- 🎨 Beautiful animations with Framer Motion
- 📝 Form validation with React Hook Form + Zod
- 🔗 WhatsApp integration
- 🎯 SEO optimized
- 🌈 Soft gradients and peaceful aesthetics

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Fonts:** Inter + Playfair Display

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Pages

- `/` - Landing Page
- `/about` - About Healing Hands & Founder
- `/services` - Healing Services
- `/shop` - Aura Cleansing Spray (E-commerce)
- `/book-session` - Online Appointment Booking
- `/certifications` - Certificates & Credentials
- `/testimonials` - Client Experiences
- `/contact` - Contact & WhatsApp CTA

## Configuration

### WhatsApp Number

Update the WhatsApp number in:
- `components/WhatsAppButton.tsx`
- `app/shop/page.tsx`
- `app/book-session/page.tsx`
- `app/contact/page.tsx`

### Contact Information

Update contact details in `app/contact/page.tsx`:
- Phone number
- Email address
- Location (if applicable)

### Product Images

Add product images to:
- `public/` directory
- Update image paths in `app/shop/page.tsx`

### Certificate Images

Add certificate images to:
- `public/certificates/` directory
- Update image paths in `app/certifications/page.tsx`

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically

## Notes

- All forms currently log to console. Integrate with your backend API as needed.
- Payment integration (Razorpay/Stripe) can be added to the shop page.
- Google Calendar integration can be added to the booking page.
- Replace placeholder images with actual product and certificate photos.

## License

Private - Healing Hands by Preyanka Jain

