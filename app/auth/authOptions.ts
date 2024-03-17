import CredenialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import axios from "axios";
import { User } from "@prisma/client";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredenialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if (!credentials?.email || !credentials?.password) return null;

        const credentialsData = {
          email: credentials.email,
          password: credentials.password,
        };
        const user: User = await axios
          .post(`${process.env.BASE_URL}/api/users/login`, credentialsData)
          .then((res) => res.data);

        return user ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/auth/signIn",
  // },
};

export default authOptions;
