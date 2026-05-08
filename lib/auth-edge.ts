import prisma from "@/prisma/client";
import { UserWithDepartment } from "@/prisma/customTypes";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { OSDepartmentShortName, UserRole } from "@prisma/client";
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
      const isTryingToAccessAuthPages =
        request.nextUrl.pathname.includes("/auth");
      const isTryingToAccessLoginPage =
        request.nextUrl.pathname.includes("/login");
      const isTryingToAccessSignupPage =
        request.nextUrl.pathname.includes("/signup");
      const isTryingToAccessCreateUserPage =
        request.nextUrl.pathname.includes("/createUser");
      const isTryingToAccessForgotPasswordPage =
        request.nextUrl.pathname.includes("/forgotPassword");
      const isTryingToAccessResetPasswordPage =
        request.nextUrl.pathname.includes("/resetPassword");
      const isTryingToAccessActivationPage =
        request.nextUrl.pathname.includes("/activation");

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

        if (
          isTryingToAccessProfilePage ||
          isTryingToAccessForgotPasswordPage ||
          isTryingToAccessResetPasswordPage
        )
          return true;

        if (!isAdmin && isTryingToAccessAdminPage) return false;
        if (isAdmin && isTryingToAccessAdminPage) return true;

        if (!isAdmin && isTryingToAccessCreateUserPage) return false;
        if (isAdmin && isTryingToAccessCreateUserPage) return true;

        return Response.redirect(new URL("/dashboard", request.url));
      }

      if (!isLoggedIn && !isTryingToAccessDashboard) {
        if (
          isTryingToAccessHomePage ||
          isTryingToAccessLoginPage ||
          isTryingToAccessForgotPasswordPage ||
          isTryingToAccessResetPasswordPage ||
          isTryingToAccessActivationPage
        )
          return true;
        // return true;
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
      // console.log("jwt token b4: ", token);
      // {name: ..., email: ..., picture: null, sub: ...}; // only the 1st time jwt() is called; // sub is the user id;
      // {name: ..., email: ..., picture: null, sub: ..., user: {...}}; // on 2nd time onwards;

      // console.log("jwt user b4 ", user);
      // {...user obj from authorize()} // only the 1st time jwt() is called;
      // sometimes gives `undefined`; why?? // on 2nd time onwards, it doesn't get `user`;

      // `user` from `authorize()` exists only on the 1st time jwt() is called;
      if (user) {
        // on sign in
        // token.user = user as UserWithDepartment;

        // Type assertion to specify that user is of type returned by `authorize()`;
        // This'll ensure that TS recognizes the properties you are trying to access on the `user` object;
        const typedUser = user as UserWithDepartment;

        token.userId = typedUser.id;
        token.email = typedUser.email || ""; // TODO: make `email` non-optional;
        token.firstName = typedUser.firstName || "";
        token.lastName = typedUser.lastName || "";
        token.role = typedUser.role;
        // token.relatedDepartment.nameShort =
        //   typedUser.relatedDepartment?.nameShort || "ERIBA"; //TODO: default department;
        token.relatedDepartmentNameShort =
          typedUser.relatedDepartment?.nameShort || "ERIBA"; //TODO: default department;
      }

      // console.log("jwt Token after: ", token);
      // {name: ..., email: ..., picture: null, sub: ..., user: {...}}; // sub is the user id;

      return token;
    },
    session: async ({ session, token }) => {
      // console.log("session session b4: ", session);
      // { user: {name: ... emal: ..., image: null}, expires: ...}; // 1st and all times (not userWithDepartment);

      // console.log("session token b4: ", token); // from jwt();
      // {name: ..., email: ..., picture: null, sub: ..., user: {...}, iat: ..., exp:..., jti:...}; // all times;

      // if (token.user) {
      // session.user = token.user as UserWithDepartment;
      // session.user = token.user as any; // TODO: this is a temporary fix to bypass type checking
      // }
      session.user.id = token.userId;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.role = token.role;
      session.user.relatedDepartmentNameShort =
        token.relatedDepartmentNameShort;
      // session.user.relatedDepartment.nameShort = token.departmentNameShort;
      // this doesn't work - having an object inside User/JWT type;

      // console.log("session Session after: ", session);
      // { user: {...all fields}, expires: ...} // 1st and all times (now with userWithDepartment);

      return session;
    },
  },
} satisfies NextAuthConfig;
