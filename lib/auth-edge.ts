import prisma from "@/prisma/client";
import { UserWithDepartment } from "@/prisma/customTypes";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";

export const nextAuthEdgeConfig = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // ========> Don't run this on Edge - see auth-no-edge.ts;
  callbacks: {
    authorized: ({ request, auth }) => {
      // runs on every request with middleware
      console.log("Checking route : ", request.nextUrl.href);

      const isLoggedIn = Boolean(auth?.user);
      const isAdmin = auth?.user.role === "ADMIN";

      const isTryingToAccessDashboard =
        request.nextUrl.pathname.includes("/dashboard");

      const isTryingToAccessHomePage = request.nextUrl.pathname === "/";
      const isTryingToAccessAdminPage =
        request.nextUrl.pathname.includes("/admin");
      const isTryingToAccessProfilePage =
        request.nextUrl.pathname.includes("/profile");

      // return true;
      if (!isAdmin && isTryingToAccessAdminPage) {
        return false;
      }

      if (!isLoggedIn && isTryingToAccessDashboard) {
        return false; // redirect to login?? //TODO:
      }

      if (isLoggedIn && isTryingToAccessDashboard) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessDashboard) {
        // if (isAdmin) return true;

        if (isTryingToAccessProfilePage) return true;

        if (!isAdmin && isTryingToAccessAdminPage) return false;
        if (isAdmin && isTryingToAccessAdminPage) return true;

        return Response.redirect(new URL("/dashboard", request.url));
      }

      if (!isLoggedIn && !isTryingToAccessDashboard) {
        return true;
      }

      return false;

      // if (
      //   isLoggedIn &&
      //   (request.nextUrl.pathname.includes("/login") ||
      //     request.nextUrl.pathname.includes("/signup"))
      // ) {
      //   return Response.redirect(new URL("/dashboard", request.url));
      // }

      // if (isLoggedIn && !isTryingToAccessDashboard) {
      //   if (
      //     request.nextUrl.pathname.includes("/login") ||
      //     request.nextUrl.pathname.includes("/signup")
      //   ) {
      //     return Response.redirect(new URL("/dashboard", request.url));
      //   }

      //   return true;
      // }
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
        // session.user = token.user as UserWithDepartment;
        session.user = token.user as any; // TODO: this is a temporary fix to bypass type checking
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
