// When you want to require authentication for your entire site:
// https://next-auth.js.org/configuration/nextjs#middleware
// Checks if the user logged in; if not, reidrect to login page;
// export { default } from "next-auth/middleware";

// to implement role based authorization, use withAuth
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // function middleware(request: NextRequestWithAuth) {
  //   if (
  //     request.nextUrl.pathname.startsWith("/admin") &&
  //     request.nextauth.token?.user.role !== "ADMIN"
  //   ) {
  //     return NextResponse.rewrite(new URL("/denied", request.url));
  //   }

  //   if (
  //     request.nextUrl.pathname.startsWith("/dashboard") &&
  //     request.nextauth.token?.user.role !== "USER"
  //   ) {
  //     return NextResponse.rewrite(new URL("/denied", request.url));
  //   }
  // },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        return !!token;
      },
    },
  }
);

// If you only want to secure certain pages, export a config object with a matcher:
// Runs the middleware for these routes
export const config = {
  matcher: [
    "/grants/new",
    "/grants/edit/:id+",
    "/profile",
    // "/admin/:path*",
    // "/dashboard/:path*",
  ],
};
