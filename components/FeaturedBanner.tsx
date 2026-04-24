import FeaturedBannerClient from "@/components/FeaturedBannerClient";
import { featuredBannerDigest } from "@/lib/featured-banner-digest";
import { getSiteSettingsMap } from "@/lib/site-settings";

export default async function FeaturedBanner() {
  const settings = await getSiteSettingsMap();
  const enabled = (settings.featuredBannerEnabled ?? "true").toLowerCase() !== "false";
  const content = (settings.featuredBannerContent ?? "").trim();

  if (!enabled || !content) {
    return null;
  }

  const digest = featuredBannerDigest(content);

  return <FeaturedBannerClient content={content} digest={digest} />;
}
