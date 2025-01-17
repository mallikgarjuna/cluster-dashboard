import prisma from "@/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";

const config = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
  },
  providers: [],
  callbacks: {
    authorized: ({ request }) => {
      const isTryingToAccessDashboard =
        request.nextUrl.pathname.includes("/dashboard");

      if (isTryingToAccessDashboard) {
        return false;
      }

      return true;
    },
  },
  session: {},
} satisfies NextAuthConfig;

export const { auth } = NextAuth(config);
