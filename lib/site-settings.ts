import { FEATURED_BANNER_SETTING_DEFAULTS } from "@/lib/featured-banner-defaults";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

function mergeFeaturedDefaults(fromDb: Record<string, string>): Record<string, string> {
  const merged = { ...fromDb };
  for (const [key, value] of Object.entries(FEATURED_BANNER_SETTING_DEFAULTS)) {
    if (merged[key] === undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

export async function getSiteSettingsMap(): Promise<Record<string, string>> {
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
    return mergeFeaturedDefaults(fromDb);
  } catch {
    return { ...FEATURED_BANNER_SETTING_DEFAULTS };
  }
}
