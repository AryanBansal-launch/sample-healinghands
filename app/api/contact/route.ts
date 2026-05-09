import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettingsMap } from "@/lib/site-settings";
import { buildContactInquiryMessage, buildWaMeUrl } from "@/lib/whatsapp";

const contactBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10),
});

const FALLBACK_WHATSAPP_DIGITS = "919217046526";

function resolveBusinessWhatsAppDigits(settings: Record<string, string>): string {
  const fromDb = settings.whatsapp?.replace(/\D/g, "") ?? "";
  if (fromDb.length >= 10) return fromDb;
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
  if (fromEnv.length >= 10) return fromEnv;
  return FALLBACK_WHATSAPP_DIGITS;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = contactBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data. Please check your fields and try again." },
        { status: 400 }
      );
    }

    const settings = await getSiteSettingsMap();
    const digits = resolveBusinessWhatsAppDigits(settings);
    const text = buildContactInquiryMessage(parsed.data);
    const whatsappUrl = buildWaMeUrl(digits, text);

    return NextResponse.json({ whatsappUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
