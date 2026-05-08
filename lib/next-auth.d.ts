// or types.d.ts
// Next-auth module agumentation:
// https://next-auth.js.org/getting-started/typescript#module-augmentation

import { OSDepartmentShortName, UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { DefaultSession, Session, User } from "next-auth";

// ********* new: To augument JWT and Session - for the latest next-auth@beta *********
// Refactor by using docs for latest next-auth @beta:
// https://authjs.dev/getting-started/typescript?framework=next-js;

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    relatedDepartmentNameShort: OSDepartmentShortName;
    // relatedDepartment: {
    //   nameShort: OSDepartmentShortName;
    // };
    // this doesn't work - having an object inside User/JWT type;
  }
}

declare module "next-auth" {
  // I don't have to augument User type from next-auth
  // b/c in jwt(), I take the whatever returned by `authorize()`,
  // and type assert the received `user` object;
  // If I do this augumentation, I'll have to return the same type
  // of `user` from the `authorize()` callback
  // (but not the `UserWithDepartment` type as I return currently);
  // Then handle it accordingly in `jwt()` callback;

  // interface User {
  //   email: string;
  //   ....other fields that I want to be returned by `authorize()`;
  // }
  interface Session {
    user: User & {
      id: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      relatedDepartmentNameShort: OSDepartmentShortName;
      // relatedDepartment: {
      //   nameShort: OSDepartmentShortName;
      // };
      // this doesn't work - having an object inside User/JWT type;
    };

    // Or, you can do - by following the docs:
    // user: {...} & DefaultSession["user"];
  }
}

// ********* old-working w/ UserWithDepartment *********
// import { UserWithDepartment } from "@/prisma/customTypes";
// import { User } from "@prisma/client";
// import {} from "next-auth";

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     // user: User;
//     user: UserWithDepartment;
//   }
// }

// // declare module "next-auth/jwt" {
// declare module "@auth/core/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     // user: User;
//     user: UserWithDepartment;
//   }
// }
