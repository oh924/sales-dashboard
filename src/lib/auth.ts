import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (!user) {
            console.error("[auth] user not found:", credentials.email);
            return null;
          }
          const ok = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
          if (!ok) {
            console.error("[auth] password mismatch for:", credentials.email);
            return null;
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            salesRepName: user.salesRepName,
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
        token.salesRepName = (user as { salesRepName: string | null })
          .salesRepName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.salesRepName = token.salesRepName as string | null;
      return session;
    },
  },
});
