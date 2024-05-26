// When you want to require authentication for your entire site:
// https://next-auth.js.org/configuration/nextjs#middleware
// Checks if the user logged in; if not, reidrect to login page;
// Without a defined matcher, this one line applies next-auth to the entire project
// export { default } from "next-auth/middleware";

// to implement role based authorization, use withAuth
// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextauth.token?.user.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }

    if (
      request.nextUrl.pathname.startsWith("/dashboard") &&
      request.nextauth.token?.user.role !== "USER" &&
      request.nextauth.token?.user.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }

    if (
      (request.nextUrl.pathname.startsWith("/dashboard/grants/edit") ||
        request.nextUrl.pathname.startsWith("/dashboard/grants/new")) &&
      request.nextauth.token?.user.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  },
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
// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile",
    "/grants/new",
    "/grants/edit/:id+",
  ],
};
