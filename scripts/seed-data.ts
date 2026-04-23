import dbConnect from "../lib/mongodb";
import Service from "../models/Service";
import Product from "../models/Product";
import Certification from "../models/Certification";
import Testimonial from "../models/Testimonial";
import SiteSettings from "../models/SiteSettings";
import PageContent from "../models/PageContent";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

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
    images: ["/spray.jpeg"],
    inStock: true,
  }
];

const certifications = [
  {
    title: "Pranic Healer",
    description: "Certified in Pranic Healing techniques for energy body cleansing and restoration.",
    certificateImage: "/logo.jpeg", // Placeholder since we don't have actual certificate images
    order: 1,
  },
  {
    title: "Crystal Healing",
    description: "Trained in crystal healing modalities for chakra balancing and energy work.",
    certificateImage: "/logo.jpeg",
    order: 2,
  },
  {
    title: "Yoga Trainer",
    description: "Certified yoga instructor specializing in therapeutic and healing practices.",
    certificateImage: "/logo.jpeg",
    order: 3,
  }
];

const testimonials = [
  {
    clientName: "Anonymous",
    quote: "The remote pranic healing session was incredibly calming. I felt a sense of peace and lightness that I hadn't experienced in months.",
    tagline: "Emotional relief and peace",
    rating: 5,
    order: 1,
  },
  {
    clientName: "R.P.",
    quote: "After several sessions, I noticed a significant improvement in my stress levels and overall emotional balance.",
    tagline: "Reduced stress & improved balance",
    rating: 5,
    order: 2,
  }
];

async function seedData() {
  await dbConnect();

  console.log("Seeding services...");
  await Service.deleteMany({});
  await Service.insertMany(services);

  console.log("Seeding products...");
  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log("Seeding certifications...");
  await Certification.deleteMany({});
  await Certification.insertMany(certifications);

  console.log("Seeding testimonials...");
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonials);

  console.log("Seeding site settings...");
  await SiteSettings.deleteMany({});
  await SiteSettings.insertMany([
    { key: "phone", value: "9355733831" },
    { key: "email", value: "healinghandswithpreyanka@gmail.com" },
    { key: "whatsapp", value: "919355733831" },
    { key: "tagline", value: "Healing starts from within" }
  ]);

  console.log("Data seeding completed!");
}

seedData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);
  });
