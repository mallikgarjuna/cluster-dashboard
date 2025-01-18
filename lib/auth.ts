import bcrypt from "bcrypt";
import prisma from "@/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SigninFormSchema } from "@/app/validationSchemas";
import { UserWithDepartment } from "@/prisma/customTypes";

const config = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
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
          user.hashedPassword!, //TODO:
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
    authorized: ({ request, auth }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessDashboard =
        request.nextUrl.pathname.includes("/dashboard");

      if (!isLoggedIn && isTryingToAccessDashboard) {
        return false; // redirect to login?? //TODO:
      }

      if (!isLoggedIn && !isTryingToAccessDashboard) {
        return true;
      }

      if (isLoggedIn && isTryingToAccessDashboard) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessDashboard) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        // on sign in
        token.user = user as UserWithDepartment;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.user) {
        session.user = token.user as UserWithDepartment;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  handlers: { GET, POST },
} = NextAuth(config);
