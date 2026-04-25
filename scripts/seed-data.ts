import dbConnect from "../lib/mongodb";
import Service from "../models/Service";
import Product from "../models/Product";
import Certification from "../models/Certification";
import Testimonial from "../models/Testimonial";
import SiteSettings from "../models/SiteSettings";
import { BOOKING_SLOTS_SETTING_DEFAULTS } from "../lib/booking-time-slots";
import {
  DEFAULT_FEATURED_BANNER_CONTENT,
  DEFAULT_FEATURED_BANNER_ENABLED,
} from "../lib/featured-banner-defaults";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

/** Collections this script can seed (others, e.g. bookings, are never touched). */
const SEEDABLE = [
  "services",
  "products",
  "certifications",
  "testimonials",
  "sitesettings",
] as const;
type SeedableCollection = (typeof SEEDABLE)[number];

const SITE_SETTINGS_DEFAULTS: { key: string; value: string }[] = [
  { key: "phone", value: "9355733831" },
  { key: "email", value: "healinghandswithpreyanka@gmail.com" },
  { key: "whatsapp", value: "919217046526" },
  { key: "tagline", value: "Healing starts from within" },
  { key: "featuredBannerEnabled", value: DEFAULT_FEATURED_BANNER_ENABLED },
  { key: "featuredBannerContent", value: DEFAULT_FEATURED_BANNER_CONTENT },
  { key: "bookingTimeSlots", value: BOOKING_SLOTS_SETTING_DEFAULTS.bookingTimeSlots },
];

function normalizeCollectionName(raw: string): SeedableCollection | null {
  const s = raw.trim().toLowerCase().replace(/_/g, "");
  const map: Record<string, SeedableCollection> = {
    services: "services",
    service: "services",
    products: "products",
    product: "products",
    certifications: "certifications",
    certification: "certifications",
    certs: "certifications",
    testimonials: "testimonials",
    testimonial: "testimonials",
    sitesettings: "sitesettings",
    sitesetting: "sitesettings",
    settings: "sitesettings",
    site: "sitesettings",
  };
  return map[s] ?? null;
}

function parseTargetCollections(): SeedableCollection[] | "help" | "error" {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return "help";
  }

  if (argv.includes("--all")) {
    if (argv.some((a) => a === "--only" || a.startsWith("--only="))) {
      console.error("Cannot combine --all with --only.");
      return "error";
    }
    return Array.from(SEEDABLE);
  }

  const onlyParts: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--only" && argv[i + 1] && !argv[i + 1].startsWith("-")) {
      onlyParts.push(...argv[i + 1].split(","));
      i++;
    } else if (a.startsWith("--only=")) {
      onlyParts.push(...a.slice("--only=".length).split(","));
    }
  }

  if (onlyParts.length === 0) {
    console.error("Missing --only <names> or use --all. Try: npx tsx scripts/seed-data.ts --help");
    return "error";
  }

  const out = new Set<SeedableCollection>();
  for (const part of onlyParts) {
    const n = normalizeCollectionName(part);
    if (!n) {
      console.error(`Unknown collection "${part.trim()}". Valid: ${SEEDABLE.join(", ")}`);
      return "error";
    }
    out.add(n);
  }
  return Array.from(out);
}

function printHelp() {
  console.log(`
Healing Hands — seed data (MongoDB)

This script only touches the collections you choose. It does NOT modify
bookings, purchases, users, page content, or any other collections.

Usage:
  npx tsx scripts/seed-data.ts --only <collection>[,<collection>...]
  npx tsx scripts/seed-data.ts --all

Collections:
  services        Replace all Service documents with seed list
  products        Replace all Product documents with seed list
  certifications  Replace all Certification documents with seed list
  testimonials    Replace all Testimonial documents with seed list
  sitesettings      Upsert default site keys (phone, banner, booking time slots, etc.); does not delete other keys

Examples:
  npx tsx scripts/seed-data.ts --only services
  npx tsx scripts/seed-data.ts --only products,services
  npx tsx scripts/seed-data.ts --all

Note: --only services (etc.) runs deleteMany on that collection, then insertMany — same
as before for that collection only. Use --all to reset every seedable collection at once.
For site settings, defaults are merged by key (safe alongside custom admin keys).
`);
}

const services = [
  {
    title: "Remote Pranic Healing",
    slug: "remote-pranic-healing",
    shortDescription: "Experience deep energy cleansing and restoration from anywhere in the world.",
    fullDescription: "Experience the power of Pranic Healing from the comfort of your home. This highly evolved system of energy medicine utilizes prana to balance, harmonize, and transform the body's energy processes. Each session focuses on scanning, cleansing, and energizing your aura and chakras to facilitate the body's natural ability to heal itself, without any physical contact.",
    features: ["Convenient remote sessions", "Energy body cleansing", "Restore natural vitality", "No physical contact required"],
    icon: "Sparkles",
    order: 1,
  },
  {
    title: "Aura & Chakra Cleansing",
    slug: "aura-chakra-cleansing",
    shortDescription: "A specialized session to scan and cleanse your energy body.",
    fullDescription: "Your aura and chakras are the blueprint of your physical and emotional well-being. In this session, we scan and cleanse your energy body to remove congestion, blockages, and negative energies. This process helps restore your natural vitality, peace, and clarity, allowing for a more balanced and harmonious life experience.",
    features: ["Aura scanning & diagnostic", "Chakra balancing", "Energy blockage removal", "Negative energy extraction"],
    icon: "Shield",
    order: 2,
  },
  {
    title: "Prosperity Healing Program",
    slug: "prosperity-healing-program",
    shortDescription: "A comprehensive 15-session journey to transform your financial reality.",
    fullDescription: "Unlock abundance and align with success through this structured 15-session program. We work deeply to clear energy blocks and limiting beliefs that hinder your financial growth. By releasing subconscious fears and strengthening your wealth-receiving ability, you can transform your mindset and attract new opportunities for prosperity.",
    features: ["Clear financial energy blocks", "Release subconscious fears", "Attract opportunities", "Enhance confidence & decision making"],
    icon: "Gem",
    isProgram: true,
    programDetails: {
      sessions: 15,
      price: 10000,
      currency: "INR",
      highlights: [
        "Clear Energy Blocks & Limiting Beliefs",
        "Release Subconscious Fears",
        "Attract Opportunities & Financial Growth",
        "Enhance Confidence & Decision Making",
        "Create an Abundant Mindset",
        "Strengthen Your Wealth Receiving Ability"
      ]
    },
    order: 3,
  },
  {
    title: "Emotional & Mental Wellness Support",
    slug: "emotional-mental-wellness-support",
    shortDescription: "Gentle support for emotional challenges and mental peace.",
    fullDescription: "Find relief from emotional and mental challenges through specialized energy healing. We provide compassionate support for issues such as stress, fear, phobias, low self-esteem, addictions, ADHD, depression, and low confidence. Each session is tailored to help you release grief, sadness, and anger, fostering a state of emotional balance and inner peace.",
    features: ["Stress & anxiety relief", "Trauma release", "Addiction support", "Self-esteem boosting"],
    icon: "Heart",
    order: 4,
  },
  {
    title: "Relationship & Life Balance Support",
    slug: "relationship-life-balance-support",
    shortDescription: "Harmonize your personal and professional relationships.",
    fullDescription: "Relationships are the cornerstone of our lives. This service focuses on harmonizing your personal and professional connections through energy balancing and spiritual guidance. By clearing discordant energies and fostering understanding, we help you find your center and maintain balance in a fast-paced world.",
    features: ["Family harmony", "Professional relationship healing", "Conflict resolution", "Personal boundary setting"],
    icon: "Users",
    order: 5,
  },
  {
    title: "Child & Student Wellness Support",
    slug: "child-student-wellness-support",
    shortDescription: "Specialized energy support for children and students.",
    fullDescription: "Support the well-being of the younger generation as they navigate academic and social pressures. We offer energy healing for children and students dealing with fear, overthinking, behavioral issues, exam stress, lack of focus, and study pressure. These sessions help promote a calm mind and enhanced concentration for better performance and well-being.",
    features: ["Exam stress relief", "Enhanced concentration", "Behavioral harmony", "Confidence building for youth"],
    icon: "Baby",
    order: 6,
  },
  {
    title: "Space Energy Cleansing",
    slug: "space-energy-cleansing",
    shortDescription: "Clear the energy of your home, office, or workplace.",
    fullDescription: "The environments we inhabit significantly impact our well-being and productivity. This service involves clearing stagnant or negative energies from your home, office, or workplace. By creating a harmonious and peaceful energy environment, you can experience improved focus, better sleep, and more positive interactions in your space.",
    features: ["Home energy clearing", "Office productivity boost", "Removal of stagnant energy", "Atmospheric harmonization"],
    icon: "Home",
    order: 7,
  },
  {
    title: "Financial Healing",
    slug: "financial-healing",
    shortDescription: "Targeted energy work to clear financial blocks.",
    fullDescription: "Identify and clear the subtle energy blocks that may be hindering your financial success. This service focuses on aligning your personal frequency with the frequency of prosperity and abundance. By clearing the energetic path for wealth, you can experience a more fluid and positive relationship with money and financial opportunities.",
    features: ["Money block identification", "Prosperity alignment", "Success frequency tuning", "Abundance mindset"],
    icon: "Coins",
    order: 8,
  },
  {
    title: "Hair Regrowth Healing",
    slug: "hair-regrowth-healing",
    shortDescription: "Natural energy healing support for healthy hair regrowth.",
    fullDescription: "Revitalize your hair's natural growth patterns through targeted energy healing. This service focuses on revitalizing hair follicles and promoting healthy regrowth by balancing the underlying energy patterns. It is a gentle, non-invasive approach to supporting your body's natural beauty and vitality from within.",
    features: ["Follicle revitalization", "Energy-based growth support", "Scalp vitality enhancement", "Natural holistic approach"],
    icon: "Wind",
    order: 9,
  },
  {
    title: "Job & Business Healing",
    slug: "job-business-healing",
    shortDescription: "Enhance your professional success through energy balancing.",
    fullDescription: "Elevate your career and business endeavors by clearing energetic obstacles to success. This service focuses on clearing blocks related to career growth, workplace relationships, and business achievements. By aligning your professional energy with your goals, you can experience smoother progress and greater success in your professional life.",
    features: ["Career growth alignment", "Business success boost", "Workplace relationship healing", "Opportunity attraction"],
    icon: "Briefcase",
    order: 10,
  },
  {
    title: "Physical Ailment Support",
    slug: "physical-ailment-support",
    shortDescription: "Complementary wellness support for various physical conditions.",
    fullDescription: "Experience complementary wellness support for a wide range of physical conditions. We offer energy healing for aches, pains, blood pressure, asthma, diabetes, migraines, and more. Our approach focuses on boosting the immune system and supporting the body's natural healing processes. *Disclaimer: This is not a substitute for professional medical treatment.*",
    features: ["Immune system support", "Pain management support", "Vitality restoration", "Chronic condition wellness"],
    icon: "Activity",
    order: 11,
  },
  {
    title: "Weight Management Support",
    slug: "weight-management-support",
    shortDescription: "Energy healing support for healthy weight goals.",
    fullDescription: "Support your journey toward a healthy weight by aligning your body's energy with your wellness goals. Whether you are seeking weight loss or healthy weight gain, this service focuses on balancing the underlying energy patterns that influence metabolism and well-being, helping you achieve your goals in a more balanced and sustainable way.",
    features: ["Metabolic energy balancing", "Wellness goal alignment", "Body confidence support", "Sustainable energy approach"],
    icon: "Scale",
    order: 12,
  },
  {
    title: "Counseling & Motivation",
    slug: "counseling-motivation",
    shortDescription: "Personalized guidance and motivational support.",
    fullDescription: "Navigate life's challenges with clarity, purpose, and renewed energy through personalized guidance. Our counseling and motivational support help you identify your strengths, overcome obstacles, and find your unique path. These sessions are designed to empower you with a positive mindset and the clarity needed to take your next steps with confidence.",
    features: ["Clarity and focus", "Overcoming life obstacles", "Purpose identification", "Confidence & motivation building"],
    icon: "Lightbulb",
    order: 13,
  }
];

const products = [
  {
    name: "Healing Bliss Aura Cleansing Spray",
    slug: "healing-bliss-spray",
    description: "With the blessings of God and Divine healing Angels, this Healing Spray will remove all negative energies around you and from your home. Filled with divinely loving healing energies.",
    benefits: [
      "Removes all negative energies",
      "Removes pain and dizziness",
      "Effective at workplace, business, office, bedrooms",
      "Protection for children (nazar)",
      "Essential for travel (hotels, buses, trains)"
    ],
    usageInstructions: [
      "Spray around your aura",
      "Spray in the corners of your room",
      "Use before meditation or sleep"
    ],
    safetyNotes: "For external use only. Keep away from eyes.",
    price: 999,
    images: ["/products/spray.jpeg"],
    stockLeft: 50,
    inStock: true,
  }
];

const certifications = [
  {
    _id: new mongoose.Types.ObjectId("69ebac5f136592ef3c982053"),
    title: "MASTER CHOA KOK SUI PRANIC PSYCHOTHERAPY COURSE",
    description:
      "Certified in Pranic Healing techniques for energy body cleansing and restoration.",
    certificateImage:
      "https://res.cloudinary.com/dxf4feuve/image/upload/v1777053871/healinghands/certifications/xykwi6gw2qvkqypxokzr.jpg",
    order: 1,
    isActive: true,
    createdAt: new Date("2026-04-24T17:46:07.177Z"),
    updatedAt: new Date("2026-04-24T18:04:34.385Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("69ebac5f136592ef3c982054"),
    title: "MASTER CHOA KOK SUI ARHATIC YOGA® PREPARATORY LEVEL",
    description:
      "Trained in crystal healing modalities for chakra balancing and energy work.",
    certificateImage:
      "https://res.cloudinary.com/dxf4feuve/image/upload/v1777053913/healinghands/certifications/kwtjqan9o0husr5xfsti.jpg",
    order: 2,
    isActive: true,
    createdAt: new Date("2026-04-24T17:46:07.177Z"),
    updatedAt: new Date("2026-04-24T18:05:16.175Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("69ebac5f136592ef3c982055"),
    title: "MASTER CHOA KOK SUI ACHIEVING ONENESS WITH THE HIGHER SOUL®",
    description:
      "Certified yoga instructor specializing in therapeutic and healing practices.",
    certificateImage:
      "https://res.cloudinary.com/dxf4feuve/image/upload/v1777053952/healinghands/certifications/uvuf8ew37h1itqe6tfyp.jpg",
    order: 3,
    isActive: true,
    createdAt: new Date("2026-04-24T17:46:07.177Z"),
    updatedAt: new Date("2026-04-24T18:05:56.934Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("69ebb1354005db88d9c83492"),
    title: "MASTER CHOA KOK SUI PRANIC CRYSTAL HEALING COURSE®",
    description:
      "Certified in Pranic Healing techniques for energy body cleansing and restoration.",
    certificateImage:
      "https://res.cloudinary.com/dxf4feuve/image/upload/v1777054002/healinghands/certifications/gsd8zl2dx7dpvs5fqrar.jpg",
    order: 4,
    isActive: true,
    createdAt: new Date("2026-04-24T18:06:45.984Z"),
    updatedAt: new Date("2026-04-24T18:06:45.984Z"),
  },
];

const testimonials = [
  {
    clientName: "Anonymous",
    quote: "The remote pranic healing session was incredibly calming. I felt a sense of peace and lightness that I hadn't experienced in months.",
    tagline: "Emotional relief and peace",
    rating: 5,
    order: 1,
    source: "admin",
    isActive: true,
  },
  {
    clientName: "R.P.",
    quote: "After several sessions, I noticed a significant improvement in my stress levels and overall emotional balance.",
    tagline: "Reduced stress & improved balance",
    rating: 5,
    order: 2,
    source: "admin",
    isActive: true,
  },
];

async function seedServices() {
  console.log("Seeding services...");
  await Service.deleteMany({});
  await Service.insertMany(services);
}

async function seedProducts() {
  console.log("Seeding products...");
  await Product.deleteMany({});
  await Product.insertMany(products);
}

async function seedCertifications() {
  console.log("Seeding certifications...");
  await Certification.deleteMany({});
  await Certification.insertMany(certifications);
}

async function seedTestimonials() {
  console.log("Seeding testimonials...");
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonials);
}

async function seedSiteSettings() {
  console.log("Seeding site settings (upsert keys only)...");
  for (const row of SITE_SETTINGS_DEFAULTS) {
    await SiteSettings.findOneAndUpdate(
      { key: row.key },
      { $set: { value: row.value } },
      { upsert: true }
    );
  }
}

async function seedSelected(targets: SeedableCollection[]) {
  await dbConnect();
  console.log(`Running seed for: ${targets.join(", ")}`);
  for (const name of targets) {
    switch (name) {
      case "services":
        await seedServices();
        break;
      case "products":
        await seedProducts();
        break;
      case "certifications":
        await seedCertifications();
        break;
      case "testimonials":
        await seedTestimonials();
        break;
      case "sitesettings":
        await seedSiteSettings();
        break;
      default:
        break;
    }
  }
  console.log("Done.");
}

async function main() {
  const parsed = parseTargetCollections();
  if (parsed === "help") {
    printHelp();
    process.exit(0);
  }
  if (parsed === "error") {
    process.exit(1);
  }
  await seedSelected(parsed);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);
  });
