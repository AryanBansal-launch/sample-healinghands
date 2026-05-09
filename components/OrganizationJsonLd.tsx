import { DEFAULT_PUBLIC_CONTACT_EMAIL } from "@/lib/public-contact";
import { getSiteSettingsMap } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function toTelUri(phoneRaw: string): string | undefined {
  const d = digitsOnly(phoneRaw);
  if (d.length < 10) return undefined;
  if (d.length === 10) return `+91${d}`;
  if (d.startsWith("91") && d.length >= 12) return `+${d}`;
  return `+${d}`;
}

/**
 * Organization + WebSite JSON-LD for rich results eligibility.
 * Uses site settings when available (phone, email).
 */
export default async function OrganizationJsonLd() {
  const base = getSiteUrl();
  const settings = await getSiteSettingsMap();
  const phone = settings.phone ?? "";
  const tel = toTelUri(phone);
  const email = (settings.email ?? "").trim() || DEFAULT_PUBLIC_CONTACT_EMAIL;

  const graph: Record<string, unknown>[] = [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${base}/#organization`,
      name: "The Healing Hands",
      alternateName: "The Healing Hands by Preyanka M Jain",
      description:
        "Remote Pranic Healing, Aura Cleansing, Emotional & Mental Wellness. Energy healing for a calm, balanced life.",
      url: base,
      logo: `${base}/logo.jpeg`,
      image: `${base}/logo.jpeg`,
      email,
      founder: {
        "@type": "Person",
        name: "Preyanka M Jain",
      },
      sameAs: [
        "https://www.instagram.com/tranquil_healing_and_yoga?utm_source=qr&igsh=MTRkNW94MGJhbm1ocQ==",
        "https://www.facebook.com/share/1AoBU5o8v3/",
      ],
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "VirtualLocation", name: "Remote / online sessions", url: base },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name: "The Healing Hands",
      publisher: { "@id": `${base}/#organization` },
    },
  ];

  if (tel) {
    (graph[0] as Record<string, unknown>).telephone = tel;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
