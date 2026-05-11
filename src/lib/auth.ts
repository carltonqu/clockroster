import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Hardcoded admin for immediate access
const ADMIN_EMAIL = "admin@clockroster.com";
const ADMIN_PASSWORD_HASH = "$2b$10$mEpYqr2reWPyutfWA15sU.jYTIMLWQ9nyOrJqRIigNkIxWDXiNmnq"; // admin123

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();

        // Hardcoded admin login for immediate access
        if (email === ADMIN_EMAIL) {
          const valid = await compare(parsed.data.password, ADMIN_PASSWORD_HASH);
          if (valid) {
            return {
              id: "admin-001",
              name: "Admin User",
              email: ADMIN_EMAIL,
              role: "ADMIN",
            };
          }
        }

        // Also try database lookup
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (user) {
            const valid = await compare(parsed.data.password, user.password);
            if (valid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (e) {
          // Database error - fall through to return null
          console.error("Database auth error:", e);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "ADMIN" | "SUPERVISOR" | "EMPLOYEE") ?? "EMPLOYEE";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
