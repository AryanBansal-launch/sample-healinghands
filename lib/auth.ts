import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Never throw from authorize — uncaught errors become 500 on /api/auth/* (Vercel).
        // Return null for any failure; NextAuth surfaces CredentialsSignin to the client.
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          await dbConnect();

          const admin = await Admin.findOne({ username: credentials.username });

          if (!admin) {
            return null;
          }

          const isValid = bcrypt.compareSync(
            credentials.password,
            admin.passwordHash
          );

          if (!isValid) {
            return null;
          }

          return {
            id: admin._id.toString(),
            name: admin.name || "Admin",
            // NextAuth expects a string user id and often an email for the default User shape.
            email: `${admin.username}@healinghands.admin`,
            username: admin.username,
            role: admin.role,
          };
        } catch (err) {
          console.error("[auth] authorize failed:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    // Avoid broken /api/auth/error HTML; send users back to login with ?error=...
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
