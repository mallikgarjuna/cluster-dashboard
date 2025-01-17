import bcrypt from "bcrypt";
import prisma from "@/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SigninFormSchema } from "@/app/validationSchemas";

const config = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login

        // validation - later?
        const validatedFormData = SigninFormSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        // extract values
        const { email, password } = validatedFormData.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          console.log("No user found");
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.hashedPassword,
        );
        if (!isValidPassword) {
          console.log("Invalid credentials");
          return null;
        }

        if (!user.emailVerified) {
          // console.log("Email not verified");
          // return null;
          // throw new Error("Please verify your email first!");
        }

        return user;
      },
    }),
  ],
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

export const { auth, signIn } = NextAuth(config);
