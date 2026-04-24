import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/** Node runtime required for `jsonwebtoken`. */
export const runtime = "nodejs";

/**
 * Mint a short-lived JWT for Chatbase `identify`.
 * Set `CHATBOT_IDENTITY_SECRET` to the secret from Chatbase (identity verification).
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ token: null });
  }

  const secret = process.env.CHATBOT_IDENTITY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CHATBOT_IDENTITY_SECRET is not set", token: null },
      { status: 503 }
    );
  }

  const u = session.user as {
    id?: string;
    email?: string | null;
    name?: string | null;
    username?: string;
    role?: string;
  };

  const payload: Record<string, string> = {
    user_id: (u.id ?? session.user.email) as string,
    email: session.user.email as string,
  };

  if (session.user.name) {
    payload.name = session.user.name;
  }
  if (u.username) {
    payload.username = u.username;
  }
  if (u.role) {
    payload.role = u.role;
  }

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return NextResponse.json({ token });
}
