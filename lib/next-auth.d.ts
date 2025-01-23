// or types.d.ts
// Next-auth module agumentation:
// https://next-auth.js.org/getting-started/typescript#module-augmentation

import { UserWithDepartment } from "@/prisma/customTypes";
import { User } from "@prisma/client";
import {} from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: User;
    user: UserWithDepartment;
  }
}

// declare module "next-auth/jwt" {
declare module "@auth/core/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    // user: User;
    user: UserWithDepartment;
  }
}
