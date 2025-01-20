// "use client";

import { checkAuth } from "@/lib/server-utils";
import { Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";
import { HiOutlineUserCircle } from "react-icons/hi";

export default async function ProfileDetails() {
  // const { data: session } = useSession();
  const session = await checkAuth();
  const user = session?.user;
  console.log("session: ", session);

  return (
    <div>
      <h1 className="text-2xl font-bold">ProfilePage</h1>

      {session?.user?.image ? (
        <Image
          height={300}
          width={300}
          src={session?.user?.image ?? ""}
          alt={session?.user?.firstName ?? ""}
          className="rounded-full"
        />
      ) : (
        <HiOutlineUserCircle size={100} />
      )}

      <div className="grid grid-cols-4 gap-y-4">
        <p>First Name: </p>{" "}
        <p className="col-span-3">{session?.user?.firstName}</p>
        <p>Last Name: </p>{" "}
        <p className="col-span-3">{session?.user?.lastName}</p>
        <p>Email: </p> <p className="col-span-3">{session?.user?.email}</p>
      </div>
    </div>
  );
}
