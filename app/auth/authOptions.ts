import CredenialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import axios from "axios";
import { User } from "@prisma/client";
import toast from "react-hot-toast";

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

        // // Calling signin API here with credentials is not working properly
        const credentialsData = {
          email: credentials.email,
          password: credentials.password,
        };

        const user = await axios
          .post(`${process.env.NEXTAUTH_URL}/api/users/login`, credentialsData)
          .then((res) => res.data)
          .catch((error) => {
            // console.error(error.response.data.error);
            // throw error;
            throw new Error(error.response.data.error);
          });
        return user ? user : null;
        // this will be sent to next-auth session
        // if the user is inside the session, the user is authenticated; otherwise, not!

        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // });

        // if (!user) throw new Error("User does not exist");

        // const passwordsMatch = await bcrypt.compare(
        //   credentials.password,
        //   user?.hashedPassword!
        // );

        // if (!passwordsMatch) throw new Error("Password is not correct");

        // return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as User;
      return token;
    },

    async session({ session, token }) {
      if (token.user) session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default authOptions;
