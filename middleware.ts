export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/grants/new", "/grants/edit/:id+", "/profile", "/admin/:path*"],
};
