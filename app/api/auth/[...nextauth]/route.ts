// import authOptions from "@/app/auth/authOptions";
// import NextAuth from "next-auth";

// // This will handle /api/auth/* routes (e.g. /api/auth/signin, /api/auth/signup, etc.)
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

export { GET, POST } from "@/lib/auth-no-edge";
