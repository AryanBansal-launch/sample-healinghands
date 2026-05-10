/** Default featured banner copy (also used by seed). Update here or in Admin → Site Settings. Use blank lines between sections for best layout. */
export const DEFAULT_FEATURED_BANNER_ENABLED = "true";

/** Sections separated by a blank line render with hierarchy; one block of lines starting with • becomes a tidy list. */
export const DEFAULT_FEATURED_BANNER_CONTENT = [
  "Healing Bliss Aromatherapy Mist · Aura Cleansing Spray",
  "A gentle, intention-based mist to refresh your field and your space—without harsh chemicals. Shake, set a prayer or intention, and mist where energy feels heavy.",
  "What it supports:",
  "• Repel negative energies\n• Protect your energy\n• Prevent psychic attacks & nazar\n• Feel more positive and energetic—with a clear mind",
  "How to use: shake well before use. External only—not for internal use; avoid eyes. No harsh chemicals. Speak your intention to clear negativity, then spray through your home—corners and doorways deserve extra love.",
  "Multiple sizes for pocket, home & travel—pick yours in the shop.",
].join("\n\n");

export const FEATURED_BANNER_SETTING_DEFAULTS: Record<string, string> = {
  featuredBannerEnabled: DEFAULT_FEATURED_BANNER_ENABLED,
  featuredBannerContent: DEFAULT_FEATURED_BANNER_CONTENT,
  /** Chip above the headline (short, punchy). */
  featuredBannerBadgeLabel: "Featured · Healing Bliss mist",
  /** Product photo under `public/` (not the flat label artwork). */
  featuredBannerProductImage: "/products/spray.jpeg",
  /** Primary button — internal path or https URL. */
  featuredBannerCtaHref: "/shop/healing-bliss-spray",
  featuredBannerCtaLabel: "Shop Healing Bliss — pick your size",
};
