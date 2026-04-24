/** Default featured banner copy (also used by seed). Update here or in Admin → Site Settings. Use blank lines between sections for best layout. */
export const DEFAULT_FEATURED_BANNER_ENABLED = "true";

/** Sections separated by a blank line render with hierarchy; one block of lines starting with • becomes a tidy list. */
export const DEFAULT_FEATURED_BANNER_CONTENT = [
  "Buddha Purnima (Wesak) · 1 May",
  "A meaningful window to renew your energy field, clarify your intentions, and welcome gentle transformation—with reverence and care.",
  "Many people like to prepare mindfully before Wesak: releasing what feels heavy so goals and wishes can land with more ease. If you would like support, share your intention by message; we can hold space with blessings aligned to your path.",
  "You may wish to focus on:",
  "• Energy body and aura clarity\n• Thought patterns and mental steadiness\n• Emotional balance\n• Physical vitality\n• A grounded sense of financial wellness",
  "Together, these layers create a whole-system tune-up before the full moon.",
  "If holistic healing feels like the right next step, you are welcome to connect with Pranic, crystal, angelic, and divine healing—offered in a way that meets you where you are.",
  "With gratitude,\nPreyanka M Jain\nThe Healing Hands\n9355733831\n\nPranic Healing · Crystal, Angel & Divine Healing · Astrology · Numerology · Counselling · Yoga",
].join("\n\n");

export const FEATURED_BANNER_SETTING_DEFAULTS: Record<string, string> = {
  featuredBannerEnabled: DEFAULT_FEATURED_BANNER_ENABLED,
  featuredBannerContent: DEFAULT_FEATURED_BANNER_CONTENT,
};
