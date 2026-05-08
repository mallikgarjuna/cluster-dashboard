import { LoginFormSchema } from "@/lib/validationSchemas";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { nextAuthEdgeConfig } from "./auth-edge";

const config = {
  ...nextAuthEdgeConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login

        // validation - later?
        const validatedFormData = LoginFormSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        // extract values
        const { email, password } = validatedFormData.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { relatedDepartment: true }, // to access it from session() callback;
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
          console.log("Email not verified");
          return null;
          // throw new Error("Please verify your email first!");
        }

        return user; // a truthy value
        // Nextauth automatically uses whatever we return here as the user obj throughout the authentication flow
      },
    }),
  ],
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
