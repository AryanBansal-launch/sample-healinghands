import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Service from "@/models/Service";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

/** Always merge latest active services/products from Mongo (not only at build time). */
export const dynamic = "force-dynamic";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/testimonials", changeFrequency: "weekly", priority: 0.8 },
  { path: "/book-session", changeFrequency: "weekly", priority: 0.95 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.85 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  try {
    await dbConnect();
    const [services, products] = await Promise.all([
      Service.find({ isActive: true }).select("slug updatedAt").lean(),
      Product.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);

    const serviceEntries: MetadataRoute.Sitemap = services.map((s) => {
      const slug = String((s as { slug?: string }).slug ?? "").trim();
      const u = (s as { updatedAt?: Date }).updatedAt;
      return {
        url: `${base}/services/${encodeURIComponent(slug)}`,
        lastModified: u ? new Date(u) : now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      };
    });

    const productEntries: MetadataRoute.Sitemap = products.map((p) => {
      const slug = String((p as { slug?: string }).slug ?? "").trim();
      const u = (p as { updatedAt?: Date }).updatedAt;
      return {
        url: `${base}/shop/${encodeURIComponent(slug)}`,
        lastModified: u ? new Date(u) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

    return [...staticEntries, ...serviceEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
