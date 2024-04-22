// When you want to require authentication for your entire site:
// https://next-auth.js.org/configuration/nextjs#middleware
// export { default } from "next-auth/middleware";

// to implement role based authorization, use withAuth
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/admin"))
          return token?.user.role === "ADMIN";
        return !!token;
      },
    },
  }
);

// If you only want to secure certain pages, export a config object with a matcher:
export const config = {
  matcher: ["/grants/new", "/grants/edit/:id+", "/profile", "/admin/:path*"],
};
