import { FEATURED_BANNER_SETTING_DEFAULTS } from "@/lib/featured-banner-defaults";
import { FOUNDER_PRACTICE_VIDEO_DEFAULTS } from "@/lib/founder-practice-video";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { cache } from "react";

const SETTING_DEFAULTS: Record<string, string> = {
  ...FEATURED_BANNER_SETTING_DEFAULTS,
  ...FOUNDER_PRACTICE_VIDEO_DEFAULTS,
};

function mergeSettingDefaults(fromDb: Record<string, string>): Record<string, string> {
  const merged = { ...fromDb };
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    if (merged[key] === undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

async function loadSiteSettingsMap(): Promise<Record<string, string>> {
  try {
    await dbConnect();
    const rows = await SiteSettings.find({}).lean();
    const fromDb = rows.reduce<Record<string, string>>((acc, row) => {
      const k = row.key as string | undefined;
      const v = row.value;
      if (k && typeof v === "string") {
        acc[k] = v;
      }
      return acc;
    }, {});
    return mergeSettingDefaults(fromDb);
  } catch {
    return { ...SETTING_DEFAULTS };
  }
}

/** Deduplicated per request (e.g. FeaturedBanner + JSON-LD in the same layout tree). */
export const getSiteSettingsMap = cache(loadSiteSettingsMap);
